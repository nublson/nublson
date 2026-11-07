import { supabase } from "@/lib/supabase";
import { getPageBlocks, type BlockWithChildren } from "@/services/notion";
import type { PostMetadata } from "@/utils/formatter";
import { markdownToPlainText } from "@/utils/markdown-to-plain-text";
import { notionBlocksToMarkdown } from "@/utils/pages-to-markdown";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createHash } from "crypto";
import { after } from "next/server";

const AUDIO_BUCKET = "post-audio";
const TTS_MODEL = "eleven_v4";
// The author's own cloned voice on the ElevenLabs account.
const TTS_VOICE = "LSe5j9I6V28KFrWYUXOw";
// MP3 plays in every browser (Ogg Opus needs Safari 18.4+), and its frames
// can be joined end to end, so chunked narration plays as one file.
const AUDIO_FORMAT = "mp3_44100_128";
const AUDIO_EXTENSION = "mp3";
const AUDIO_CONTENT_TYPE = "audio/mpeg";
// eleven_v4 accepts at most 10,000 characters per request; leave headroom.
const MAX_REQUEST_CHARS = 9_000;

export type AudioResult =
  | { type: "redirect"; url: string }
  | { type: "stream"; body: ReadableStream<Uint8Array>; contentType: string };

/** Ends a part with a full stop unless it already ends a sentence, so the voice pauses once. */
function asSentence(text: string): string {
  return /[.!?…:]["'’”)\]]*$/.test(text) ? text : `${text}.`;
}

/** What the listener hears: the title, the description (the article lede), then the body. */
export function buildNarrationText(
  metadata: Pick<PostMetadata, "title" | "description" | "descriptionRichText">,
  blocks: BlockWithChildren[],
): string {
  // The rich text keeps the lede's paragraph breaks; the plain field collapses them.
  const description =
    metadata.descriptionRichText
      .map((item) => item.plain_text)
      .join("")
      .trim() || metadata.description;
  const body = markdownToPlainText(notionBlocksToMarkdown(blocks));
  return [metadata.title.trim(), description, body]
    .filter(Boolean)
    .map((part, i, parts) => (i < parts.length - 1 ? asSentence(part) : part))
    .join("\n\n");
}

/**
 * Hashes the narration with the model and voice that speak it, so changing
 * either regenerates every post's cached audio, not only edited posts.
 */
function hashNarration(text: string): string {
  return createHash("sha256")
    .update(`${TTS_MODEL}:${TTS_VOICE}\n${text}`)
    .digest("hex");
}

/**
 * Splits narration into pieces of at most `maxChars`, breaking between
 * paragraphs, then between sentences, and only mid-sentence as a last resort.
 */
export function splitNarration(text: string, maxChars: number): string[] {
  const pieces: string[] = [];
  let current = "";

  const push = (unit: string, separator: string) => {
    if (!current) {
      current = unit;
    } else if (current.length + separator.length + unit.length <= maxChars) {
      current += separator + unit;
    } else {
      pieces.push(current);
      current = unit;
    }
  };

  for (const paragraph of text.split(/\n{2,}/)) {
    if (paragraph.length <= maxChars) {
      push(paragraph, "\n\n");
      continue;
    }
    for (const sentence of paragraph.split(/(?<=[.!?…])\s+/)) {
      for (let i = 0; i < sentence.length; i += maxChars) {
        push(sentence.slice(i, i + maxChars), " ");
      }
    }
  }
  if (current) pieces.push(current);
  return pieces;
}

function publicAudioUrl(audioPath: string, contentHash: string): string {
  const { data } = supabase.storage.from(AUDIO_BUCKET).getPublicUrl(audioPath);
  return `${data.publicUrl}?v=${contentHash.slice(0, 12)}`;
}

type CachedAudio = { audio_path: string; content_hash: string };

/**
 * Resolves cached narration by public slug first (UNIQUE + storage path), then
 * falls back to Notion post_id. When a slug hit has a drifted post_id (e.g.
 * duplicate Notion pages / env DB mismatch), repairs the row in place so the
 * primary key stays aligned without breaking UNIQUE(post_slug).
 */
export async function getCachedAudio(
  postId: string,
  postSlug: string,
): Promise<CachedAudio | null> {
  const { data: bySlug, error: slugError } = await supabase
    .from("post_audio")
    .select("post_id, audio_path, content_hash")
    .eq("post_slug", postSlug)
    .maybeSingle();

  if (slugError) {
    throw new Error(`Failed to fetch post audio: ${slugError.message}`);
  }

  if (bySlug) {
    if (bySlug.post_id !== postId) {
      const { error: repairError } = await supabase
        .from("post_audio")
        .update({
          post_id: postId,
          updated_at: new Date().toISOString(),
        })
        .eq("post_slug", postSlug)
        .eq("post_id", bySlug.post_id);

      if (repairError) {
        console.error(
          `[speech-mode] failed to repair post_id for slug "${postSlug}" (${bySlug.post_id} → ${postId}):`,
          repairError,
        );
      }
    }

    return {
      audio_path: bySlug.audio_path,
      content_hash: bySlug.content_hash,
    };
  }

  const { data: byId, error: idError } = await supabase
    .from("post_audio")
    .select("audio_path, content_hash")
    .eq("post_id", postId)
    .maybeSingle();

  if (idError) {
    throw new Error(`Failed to fetch post audio: ${idError.message}`);
  }

  return byId;
}

/**
 * Streams narration from ElevenLabs, one request per piece of at most
 * MAX_REQUEST_CHARS, joined into a single MP3 stream. Each request gets its
 * neighbours as context so the voice carries across the joins. The first
 * request is awaited, so a bad key or quota error throws before any audio
 * is sent; a later failure errors the stream, which also skips caching.
 */
async function requestSpeech(text: string): Promise<ReadableStream<Uint8Array>> {
  const client = new ElevenLabsClient();
  const pieces = splitNarration(text, MAX_REQUEST_CHARS);

  const speak = (i: number) =>
    client.textToSpeech.stream(TTS_VOICE, {
      text: pieces[i],
      modelId: TTS_MODEL,
      outputFormat: AUDIO_FORMAT,
      previousText: pieces[i - 1],
      nextText: pieces[i + 1],
    });

  let next = 1;
  let reader = (await speak(0)).getReader();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      for (;;) {
        const { done, value } = await reader.read();
        if (!done) {
          controller.enqueue(value);
          return;
        }
        if (next >= pieces.length) {
          controller.close();
          return;
        }
        reader = (await speak(next++)).getReader();
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

/** Uploads narration bytes and upserts the cache row keyed by post_slug. */
export async function cacheAudioBuffer(
  postId: string,
  postSlug: string,
  contentHash: string,
  audioBuffer: Buffer,
): Promise<void> {
  const audioPath = `${postSlug}.${AUDIO_EXTENSION}`;

  const { error: uploadError } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(audioPath, audioBuffer, {
      contentType: AUDIO_CONTENT_TYPE,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload post audio: ${uploadError.message}`);
  }

  // Conflict on post_slug (not post_id): Notion page ids can drift across
  // duplicate titles / data sources while the public slug stays stable. A
  // post_id-only upsert left UNIQUE(post_slug) rows stranded and broke caching.
  const { error: upsertError } = await supabase.from("post_audio").upsert(
    {
      post_id: postId,
      post_slug: postSlug,
      content_hash: contentHash,
      audio_path: audioPath,
      voice: TTS_VOICE,
      model: TTS_MODEL,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "post_slug" },
  );

  if (upsertError) {
    throw new Error(`Failed to record post audio: ${upsertError.message}`);
  }
}

/** Generates and caches narration with no live listener (background use only). */
async function regenerateAndCache(
  postId: string,
  postSlug: string,
  narrationText: string,
  contentHash: string,
): Promise<void> {
  const audio = await requestSpeech(narrationText);
  const audioBuffer = Buffer.from(await new Response(audio).arrayBuffer());
  await cacheAudioBuffer(postId, postSlug, contentHash, audioBuffer);
}

/**
 * Streams narration to a live listener as ElevenLabs generates it, so playback
 * can start well before the full file exists — while caching the complete
 * file in the background once the stream finishes, for instant playback on
 * every future request.
 */
async function streamAndCache(
  postId: string,
  postSlug: string,
  narrationText: string,
  contentHash: string,
): Promise<ReadableStream<Uint8Array>> {
  const audio = await requestSpeech(narrationText);
  const [clientStream, cacheStream] = audio.tee();

  after(async () => {
    try {
      const audioBuffer = Buffer.from(await new Response(cacheStream).arrayBuffer());
      await cacheAudioBuffer(postId, postSlug, contentHash, audioBuffer);
    } catch (err) {
      console.error(
        `[speech-mode] failed to cache streamed audio for post ${postId} (${postSlug}):`,
        err,
      );
    }
  });

  return clientStream;
}

/**
 * Regenerates a post's narration in the background if its content changed,
 * without blocking the response. Notion flakiness here must never break
 * playback of audio that's already cached and correct.
 */
function scheduleRevalidation(
  postId: string,
  postSlug: string,
  metadata: PostMetadata,
  currentContentHash: string,
): void {
  after(async () => {
    try {
      const blocks = await getPageBlocks(postId);
      const narrationText = buildNarrationText(metadata, blocks);
      const freshHash = hashNarration(narrationText);
      if (freshHash === currentContentHash) return;

      await regenerateAndCache(postId, postSlug, narrationText, freshHash);
    } catch (err) {
      console.error(
        `[speech-mode] background revalidation failed for post ${postId} (${postSlug}):`,
        err,
      );
    }
  });
}

/**
 * Resolves a post's narration audio. A cached post redirects to its public
 * URL immediately, with freshness checked against Notion in the background
 * so a slow or unavailable Notion API never blocks or breaks playback. A
 * post with no cached audio yet streams narration live as ElevenLabs generates
 * it, caching the complete file in the background for instant playback next
 * time.
 */
export async function getOrGenerateAudio(
  postId: string,
  postSlug: string,
  metadata: PostMetadata,
): Promise<AudioResult> {
  const cached = await getCachedAudio(postId, postSlug);

  if (cached) {
    scheduleRevalidation(postId, postSlug, metadata, cached.content_hash);
    return {
      type: "redirect",
      url: publicAudioUrl(cached.audio_path, cached.content_hash),
    };
  }

  const blocks = await getPageBlocks(postId);
  const narrationText = buildNarrationText(metadata, blocks);
  const contentHash = hashNarration(narrationText);

  const body = await streamAndCache(postId, postSlug, narrationText, contentHash);
  return { type: "stream", body, contentType: AUDIO_CONTENT_TYPE };
}
