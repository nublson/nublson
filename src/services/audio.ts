import { supabase } from "@/lib/supabase";
import { getPageBlocks, type BlockWithChildren } from "@/services/notion";
import { blocksToMarkdown } from "@/utils/blocks-to-markdown";
import type { PostMetadata } from "@/utils/formatter";
import { markdownToPlainText } from "@/utils/markdown-to-plain-text";
import { createHash } from "crypto";
import { after } from "next/server";

const OPENAI_SPEECH_URL =
  process.env.OPENAI_SPEECH_URL ?? "https://api.openai.com/v1/audio/speech";
const AUDIO_BUCKET = "post-audio";
const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "cedar";
// Ogg Opus: smaller files than MP3 at equivalent speech quality, and a
// native fit for HTTP-chunked streaming. Safari/iOS only gained native Ogg
// Opus playback in Safari 18.4 (macOS Sequoia 15.4, iOS/iPadOS 18.4);
// older Safari versions have no Ogg container support and won't play it.
const AUDIO_FORMAT = "opus";
const AUDIO_CONTENT_TYPE = "audio/ogg; codecs=opus";
const TTS_INSTRUCTIONS = `Voice affect: Warm, confident, and conversational — like a knowledgeable friend explaining something they find genuinely interesting, not a formal narrator reading a script.

Tone: Friendly and engaging, with light enthusiasm for the subject matter. Approachable and human, never stiff or robotic.`;

export type AudioResult =
  | { type: "redirect"; url: string }
  | { type: "stream"; body: ReadableStream<Uint8Array>; contentType: string };

function buildNarrationText(
  metadata: PostMetadata,
  blocks: BlockWithChildren[],
): string {
  const body = markdownToPlainText(blocksToMarkdown(blocks));
  return [metadata.title, body].filter(Boolean).join(".\n\n");
}

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
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
 * Calls OpenAI's speech endpoint directly (bypassing the AI SDK's
 * generateSpeech, which buffers the full response before returning). Callers
 * decide whether to stream the response live or fully buffer it — this just
 * returns the raw Response so either is possible.
 */
async function requestSpeech(text: string): Promise<Response> {
  const response = await fetch(OPENAI_SPEECH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      instructions: TTS_INSTRUCTIONS,
      response_format: AUDIO_FORMAT,
      stream_format: "audio",
      speed: 1,
    }),
  });

  if (!response.ok || !response.body) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `OpenAI speech request failed (${response.status}): ${errorBody.slice(0, 500)}`,
    );
  }

  return response;
}

/** Uploads narration bytes and upserts the cache row keyed by post_slug. */
export async function cacheAudioBuffer(
  postId: string,
  postSlug: string,
  contentHash: string,
  audioBuffer: Buffer,
): Promise<void> {
  const audioPath = `${postSlug}.${AUDIO_FORMAT}`;

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
  const response = await requestSpeech(narrationText);
  const audioBuffer = Buffer.from(await response.arrayBuffer());
  await cacheAudioBuffer(postId, postSlug, contentHash, audioBuffer);
}

/**
 * Streams narration to a live listener as OpenAI generates it, so playback
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
  const response = await requestSpeech(narrationText);
  const [clientStream, cacheStream] = response.body!.tee();

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
      const freshHash = hashText(narrationText);
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
 * post with no cached audio yet streams narration live as OpenAI generates
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
  const contentHash = hashText(narrationText);

  const body = await streamAndCache(postId, postSlug, narrationText, contentHash);
  return { type: "stream", body, contentType: AUDIO_CONTENT_TYPE };
}
