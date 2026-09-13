/**
 * Generates tiny base64 blur placeholders for `next/image` `blurDataURL`.
 *
 * Deliberately free of any `@/services/*` import so the Notion service layer
 * can depend on it without a cycle: callers pass an already-resolved URL.
 */

import assets from "@/assets/blur.json";
import sharp from "sharp";

/** Flat 1x1 PNG used whenever a real placeholder is unavailable. */
export const FALLBACK_BLUR_DATA_URL: string = assets.base64;

/** Upstream images are small; a slow origin must not stall ISR regeneration. */
const FETCH_TIMEOUT_MS = 3000;

/** Width in px of the encoded placeholder. `next/image` scales it up and blurs it. */
const BLUR_WIDTH = 16;

const BLUR_QUALITY = 40;

/**
 * Downloads an image and encodes a ~16px WebP data URL from it.
 *
 * @param upstreamUrl - Directly fetchable image URL (already resolved; Notion
 *   signed S3 links work, the `/api/notion-image` proxy path does not).
 * @returns A `data:image/webp;base64,...` string, or `undefined` on any
 *   network error, timeout, non-2xx response, or undecodable payload.
 */
export async function generateBlurDataUrl(
  upstreamUrl: string,
): Promise<string | undefined> {
  try {
    const response = await fetch(upstreamUrl, {
      // Signed URLs expire, so they must never be served from the data cache.
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": "nublson-blur-placeholder/1.0",
        Accept: "image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) return undefined;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength === 0) return undefined;

    const blur = await sharp(buffer, { failOn: "none" })
      .resize(BLUR_WIDTH, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: BLUR_QUALITY })
      .toBuffer();

    return `data:image/webp;base64,${blur.toString("base64")}`;
  } catch {
    return undefined;
  }
}
