/**
 * Resolves a site's favicon on the server and encodes it as a small PNG data
 * URL, trying Google first and DuckDuckGo second (it knows subdomains Google
 * misses). Caching lives in `@/services/favicon`; this module only fetches.
 */

import sharp from "sharp";
import { decodeIco, isIco } from "./ico";

/** One slow provider must not stall ISR regeneration. */
const FETCH_TIMEOUT_MS = 3000;

/** Favicons are tiny; anything bigger is not one. */
const MAX_ICON_BYTES = 512 * 1024;

/** 2x the 13px it renders at, so it stays sharp on retina screens. */
const ICON_SIZE = 32;

type Provider = { name: string; url: (host: string) => string };

export const FAVICON_PROVIDERS: readonly Provider[] = [
  {
    name: "google",
    url: (host) =>
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`,
  },
  {
    name: "duckduckgo",
    url: (host) =>
      `https://icons.duckduckgo.com/ip3/${encodeURIComponent(host)}.ico`,
  },
];

/** A provider could not answer (timeout, 5xx, rate limit): worth retrying later. */
export class FaviconUnavailableError extends Error {
  constructor(host: string, cause?: unknown) {
    super(`No provider could answer for ${host}`, { cause });
    this.name = "FaviconUnavailableError";
  }
}

type ProviderAnswer = { kind: "found"; bytes: Buffer } | { kind: "missing" };

/** Statuses that mean "try again later" rather than "this site has no icon". */
function isTransientStatus(status: number): boolean {
  return status >= 500 || status === 408 || status === 429;
}

async function askProvider(url: string): Promise<ProviderAnswer> {
  const response = await fetch(url, {
    // Cached per host in `@/services/favicon`, not per provider URL.
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      "User-Agent": "nublson-favicon/1.0",
      Accept: "image/*,*/*;q=0.8",
    },
  });

  if (isTransientStatus(response.status)) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }
  // Google answers 404 (with its grey globe in the body) when it has no icon.
  if (!response.ok) return { kind: "missing" };

  const length = Number(response.headers.get("content-length"));
  if (length > MAX_ICON_BYTES) return { kind: "missing" };

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_ICON_BYTES) {
    return { kind: "missing" };
  }
  return { kind: "found", bytes };
}

/**
 * Any image a provider returns (PNG, JPEG, GIF, WebP, SVG or ICO) as a PNG
 * data URL at most {@link ICON_SIZE}px square, or null when it can't be decoded.
 */
export async function toFaviconDataUrl(bytes: Buffer): Promise<string | null> {
  try {
    // sharp can't read ICO, which is what DuckDuckGo usually serves.
    const input = isIco(bytes) ? decodeIco(bytes) : bytes;
    if (!input) return null;

    const image =
      "rgba" in input
        ? sharp(input.rgba, {
            raw: { width: input.width, height: input.height, channels: 4 },
          })
        : sharp(input, { failOn: "none" });

    const png = await image
      .resize(ICON_SIZE, ICON_SIZE, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * The favicon for `host` as a data URL, or null when every provider says it
 * has none (the caller then draws its own globe).
 *
 * Throws {@link FaviconUnavailableError} when no provider found an icon and at
 * least one couldn't answer, so a transient failure is never cached as "none".
 */
export async function resolveFavicon(host: string): Promise<string | null> {
  let unavailable: unknown;

  for (const provider of FAVICON_PROVIDERS) {
    let answer: ProviderAnswer;
    try {
      answer = await askProvider(provider.url(host));
    } catch (error) {
      unavailable ??= error;
      continue;
    }

    if (answer.kind === "found") {
      const dataUrl = await toFaviconDataUrl(answer.bytes);
      // An undecodable icon counts as missing: the next provider may do better.
      if (dataUrl) return dataUrl;
    }
  }

  if (unavailable) throw new FaviconUnavailableError(host, unavailable);
  return null;
}
