import { supabase } from "@/lib/supabase";
import { getPageBlocks, type BlockWithChildren } from "@/services/notion";
import { blocksToMarkdown } from "@/utils/blocks-to-markdown";
import type { PostMetadata } from "@/utils/formatter";
import { markdownToPlainText } from "@/utils/markdown-to-plain-text";
import { openai } from "@ai-sdk/openai";
import { generateSpeech } from "ai";
import { createHash } from "crypto";
import { after } from "next/server";

const AUDIO_BUCKET = "post-audio";
const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "cedar";
const TTS_INSTRUCTIONS = `Voice affect: Warm, confident, and conversational — like a knowledgeable friend explaining something they find genuinely interesting, not a formal narrator reading a script.

Tone: Friendly and engaging, with light enthusiasm for the subject matter. Approachable and human, never stiff or robotic.`;

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

/** Fetches the post body from Notion, generates narration, and caches it. */
async function synthesizeAndCache(
  postId: string,
  postSlug: string,
  metadata: PostMetadata,
): Promise<{ audioPath: string; contentHash: string }> {
  const blocks = await getPageBlocks(postId);
  const narrationText = buildNarrationText(metadata, blocks);
  const contentHash = hashText(narrationText);

  const { audio } = await generateSpeech({
    model: openai.speech(TTS_MODEL),
    text: narrationText,
    voice: TTS_VOICE,
    outputFormat: "mp3",
    instructions: TTS_INSTRUCTIONS,
    speed: 1,
  });

  const audioPath = `${postSlug}.mp3`;

  const { error: uploadError } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(audioPath, Buffer.from(audio.uint8Array), {
      contentType: "audio/mpeg",
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

  return { audioPath, contentHash };
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

      await synthesizeAndCache(postId, postSlug, metadata);
    } catch (err) {
      console.error(
        `[speech-mode] background revalidation failed for post ${postId} (${postSlug}):`,
        err,
      );
    }
  });
}

/**
 * Returns the public MP3 URL for a post's narration. A cached audio serves
 * immediately, with freshness checked against Notion in the background so a
 * slow or unavailable Notion API never blocks or breaks playback. Only a
 * post with no cached audio yet pays for a synchronous Notion fetch + TTS
 * generation.
 */
export async function getOrGenerateAudioUrl(
  postId: string,
  postSlug: string,
  metadata: PostMetadata,
): Promise<string> {
  const cached = await getCachedAudio(postId);

  if (cached) {
    scheduleRevalidation(postId, postSlug, metadata, cached.content_hash);
    return publicAudioUrl(cached.audio_path, cached.content_hash);
  }

  const { audioPath, contentHash } = await synthesizeAndCache(
    postId,
    postSlug,
    metadata,
  );
  return publicAudioUrl(audioPath, contentHash);
}
