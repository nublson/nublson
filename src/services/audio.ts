import { supabase } from "@/lib/supabase";
import { getPageBlocks, type BlockWithChildren } from "@/services/notion";
import { blocksToMarkdown } from "@/utils/blocks-to-markdown";
import type { PostMetadata } from "@/utils/formatter";
import { markdownToPlainText } from "@/utils/markdown-to-plain-text";
import { createHash } from "crypto";
import { after } from "next/server";

const AUDIO_BUCKET = "post-audio";
const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "cedar";
// Ogg Opus: smaller files than MP3 at equivalent speech quality, and a
// native fit for HTTP-chunked streaming. Safari/iOS has no native Ogg
// container support, so playback there will fail until a fallback exists.
const AUDIO_FORMAT = "opus";
const AUDIO_EXTENSION = "opus";
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

async function getCachedAudio(postId: string): Promise<CachedAudio | null> {
  const { data, error } = await supabase
    .from("post_audio")
    .select("audio_path, content_hash")
    .eq("post_id", postId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch post audio: ${error.message}`);
  }

  return data;
}

/**
 * Calls OpenAI's speech endpoint directly (bypassing the AI SDK's
 * generateSpeech, which buffers the full response before returning) so the
 * response body can be streamed to a live listener as audio is generated.
 */
async function requestSpeech(text: string): Promise<Response> {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
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

async function cacheAudioBuffer(
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
    { onConflict: "post_id" },
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
  const cached = await getCachedAudio(postId);

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
