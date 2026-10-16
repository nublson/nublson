import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  FaviconUnavailableError,
  resolveFavicon,
  toFaviconDataUrl,
} from "./favicon";
import { decodeIco } from "./ico";

async function png(size: number): Promise<Buffer> {
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
}

/** An ICO file holding one image (a PNG or a bitmap) of the given width. */
function ico(image: Buffer, width: number): Buffer {
  const header = Buffer.alloc(6 + 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = width;
  header[7] = width;
  header.writeUInt32LE(image.length, 6 + 8);
  header.writeUInt32LE(header.length, 6 + 12);
  return Buffer.concat([header, image]);
}

/** A 2x2 24-bit bitmap (blue) whose AND mask makes the top-left pixel transparent. */
function bitmap24(): Buffer {
  const info = Buffer.alloc(40);
  info.writeUInt32LE(40, 0);
  info.writeInt32LE(2, 4);
  info.writeInt32LE(4, 8); // colour rows + mask rows
  info.writeUInt16LE(1, 12);
  info.writeUInt16LE(24, 14);
  // Two bottom-up rows of 2 BGR pixels, padded to 8 bytes.
  const pixels = Buffer.from([
    255, 0, 0, 255, 0, 0, 0, 0, 255, 0, 0, 255, 0, 0, 0, 0,
  ]);
  // Mask rows, bottom-up, 4 bytes each: top row's first pixel is transparent.
  const mask = Buffer.from([0, 0, 0, 0, 0b1000_0000, 0, 0, 0]);
  return Buffer.concat([info, pixels, mask]);
}

function respond(status: number, body: Buffer = Buffer.alloc(0)): Response {
  return new Response(status === 204 ? null : new Uint8Array(body), {
    status,
  });
}

function stubFetch(...answers: Array<Response | Error>) {
  const fetchMock = vi.fn();
  for (const answer of answers) {
    if (answer instanceof Error) fetchMock.mockRejectedValueOnce(answer);
    else fetchMock.mockResolvedValueOnce(answer);
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("resolveFavicon", () => {
  it("uses Google's icon when it has one", async () => {
    const fetchMock = stubFetch(respond(200, await png(64)));

    const src = await resolveFavicon("github.com");

    expect(src).toMatch(/^data:image\/png;base64,/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]![0]).toContain("google.com/s2/favicons");
  });

  it("falls back to DuckDuckGo when Google has none", async () => {
    const fetchMock = stubFetch(
      respond(404, await png(16)),
      respond(200, ico(await png(32), 32)),
    );

    const src = await resolveFavicon("sonner.emilkowal.ski");

    expect(src).toMatch(/^data:image\/png;base64,/);
    expect(fetchMock.mock.calls[1]![0]).toContain(
      "icons.duckduckgo.com/ip3/sonner.emilkowal.ski.ico",
    );
  });

  it("returns null (draw the globe) when every provider says there is none", async () => {
    stubFetch(respond(404), respond(404));
    await expect(resolveFavicon("example.invalid")).resolves.toBeNull();
  });

  it("throws, so nothing is cached, when a provider couldn't answer", async () => {
    stubFetch(new Error("timeout"), respond(404));
    await expect(resolveFavicon("example.com")).rejects.toBeInstanceOf(
      FaviconUnavailableError,
    );
  });

  it("treats 5xx and 429 as transient", async () => {
    stubFetch(respond(503), respond(429));
    await expect(resolveFavicon("example.com")).rejects.toBeInstanceOf(
      FaviconUnavailableError,
    );
  });

  it("still uses DuckDuckGo's icon when Google timed out", async () => {
    stubFetch(new Error("timeout"), respond(200, await png(32)));
    await expect(resolveFavicon("example.com")).resolves.toMatch(/^data:/);
  });

  it("moves on when a provider returns bytes that aren't an image", async () => {
    stubFetch(
      respond(200, Buffer.from("<html>nope</html>")),
      respond(200, await png(32)),
    );
    await expect(resolveFavicon("example.com")).resolves.toMatch(/^data:/);
  });
});

describe("toFaviconDataUrl", () => {
  it("shrinks large icons to 32px", async () => {
    const src = await toFaviconDataUrl(await png(256));
    const out = Buffer.from(src!.split(",")[1]!, "base64");
    expect((await sharp(out).metadata()).width).toBe(32);
  });

  it("never enlarges small icons", async () => {
    const src = await toFaviconDataUrl(await png(16));
    const out = Buffer.from(src!.split(",")[1]!, "base64");
    expect((await sharp(out).metadata()).width).toBe(16);
  });

  it("decodes ICO files holding a bitmap", async () => {
    const src = await toFaviconDataUrl(ico(bitmap24(), 2));
    expect(src).toMatch(/^data:image\/png;base64,/);
  });
});

describe("decodeIco", () => {
  it("returns an embedded PNG as is", async () => {
    const image = await png(32);
    expect(decodeIco(ico(image, 32))).toEqual(image);
  });

  it("decodes 24-bit bitmaps top-down with the AND mask as alpha", () => {
    const decoded = decodeIco(ico(bitmap24(), 2));
    expect(decoded).not.toBeNull();
    if (!decoded || Buffer.isBuffer(decoded)) throw new Error("expected RGBA");
    expect(decoded.width).toBe(2);
    expect(decoded.height).toBe(2);
    // Top-left: blue, transparent. Top-right: blue, opaque.
    expect([...decoded.rgba.subarray(0, 8)]).toEqual([
      0, 0, 255, 0, 0, 0, 255, 255,
    ]);
  });

  it("returns null for paletted or truncated images", () => {
    expect(decodeIco(ico(Buffer.alloc(10), 16))).toBeNull();
  });
});
