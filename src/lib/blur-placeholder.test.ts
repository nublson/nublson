// @vitest-environment node

import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FALLBACK_BLUR_DATA_URL,
  generateBlurDataUrl,
} from "./blur-placeholder";

const UPSTREAM_URL = "https://example.invalid/cover.jpg";

/** A realistic cover-sized JPEG so the resize step has something to shrink. */
async function makeSourceImage(width = 1200, height = 800): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 200, g: 80, b: 40 },
    },
  })
    .jpeg()
    .toBuffer();
}

function mockFetchResolving(body: Buffer, init?: { ok?: boolean }): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: init?.ok ?? true,
      arrayBuffer: async () =>
        body.buffer.slice(
          body.byteOffset,
          body.byteOffset + body.byteLength,
        ) as ArrayBuffer,
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("FALLBACK_BLUR_DATA_URL", () => {
  it("is a base64 PNG data URL usable as blurDataURL", () => {
    expect(FALLBACK_BLUR_DATA_URL).toMatch(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/);
  });
});

describe("generateBlurDataUrl", () => {
  it("encodes a WebP data URL from the fetched image", async () => {
    mockFetchResolving(await makeSourceImage());

    const result = await generateBlurDataUrl(UPSTREAM_URL);

    expect(result).toMatch(/^data:image\/webp;base64,[A-Za-z0-9+/=]+$/);
  });

  it("downscales the source to 16px wide", async () => {
    mockFetchResolving(await makeSourceImage(1200, 800));

    const result = await generateBlurDataUrl(UPSTREAM_URL);
    const encoded = result!.replace("data:image/webp;base64,", "");
    const metadata = await sharp(Buffer.from(encoded, "base64")).metadata();

    expect(metadata.width).toBe(16);
    // 1200x800 source keeps its 3:2 aspect ratio.
    expect(metadata.height).toBe(11);
  });

  it("stays small enough to inline in HTML for every card", async () => {
    mockFetchResolving(await makeSourceImage());

    const result = await generateBlurDataUrl(UPSTREAM_URL);

    expect(result!.length).toBeLessThan(2048);
  });

  it("does not enlarge an image already smaller than the blur width", async () => {
    mockFetchResolving(await makeSourceImage(8, 8));

    const result = await generateBlurDataUrl(UPSTREAM_URL);
    const encoded = result!.replace("data:image/webp;base64,", "");
    const metadata = await sharp(Buffer.from(encoded, "base64")).metadata();

    expect(metadata.width).toBe(8);
  });

  it("returns undefined on a non-2xx response", async () => {
    mockFetchResolving(await makeSourceImage(), { ok: false });

    await expect(generateBlurDataUrl(UPSTREAM_URL)).resolves.toBeUndefined();
  });

  it("returns undefined when the fetch times out", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new DOMException("The operation was aborted", "TimeoutError");
      }),
    );

    await expect(generateBlurDataUrl(UPSTREAM_URL)).resolves.toBeUndefined();
  });

  it("returns undefined on a network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );

    await expect(generateBlurDataUrl(UPSTREAM_URL)).resolves.toBeUndefined();
  });

  it("returns undefined on an empty body", async () => {
    mockFetchResolving(Buffer.alloc(0));

    await expect(generateBlurDataUrl(UPSTREAM_URL)).resolves.toBeUndefined();
  });

  it("returns undefined when the payload is not a decodable image", async () => {
    mockFetchResolving(Buffer.from("<!doctype html><html>nope</html>"));

    await expect(generateBlurDataUrl(UPSTREAM_URL)).resolves.toBeUndefined();
  });

  it("requests the upstream URL without reusing a cached signed link", async () => {
    mockFetchResolving(await makeSourceImage());

    await generateBlurDataUrl(UPSTREAM_URL);

    expect(fetch).toHaveBeenCalledWith(
      UPSTREAM_URL,
      expect.objectContaining({ cache: "no-store" }),
    );
  });
});
