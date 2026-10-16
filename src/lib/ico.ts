/**
 * Minimal ICO reader, because sharp (libvips) can't decode ICO files.
 *
 * Picks the largest image in the file. Modern ICOs embed PNGs, which are
 * returned as is for sharp to read; older ones hold 24- or 32-bit bitmaps,
 * decoded here to raw RGBA. Paletted (1/4/8-bit) bitmaps are not supported.
 */

export type DecodedIco =
  | Buffer
  | { rgba: Buffer; width: number; height: number };

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

/** ICO header: reserved 0, type 1 (icon), at least one image. */
export function isIco(bytes: Buffer): boolean {
  return (
    bytes.length >= 6 &&
    bytes.readUInt16LE(0) === 0 &&
    bytes.readUInt16LE(2) === 1 &&
    bytes.readUInt16LE(4) > 0
  );
}

type Entry = { width: number; offset: number; size: number };

function readEntries(bytes: Buffer): Entry[] {
  const count = bytes.readUInt16LE(4);
  const entries: Entry[] = [];
  for (let i = 0; i < count; i++) {
    const at = 6 + i * 16;
    if (at + 16 > bytes.length) break;
    const offset = bytes.readUInt32LE(at + 12);
    const size = bytes.readUInt32LE(at + 8);
    if (offset + size > bytes.length) continue;
    // A stored 0 means 256px.
    entries.push({ width: bytes[at] || 256, offset, size });
  }
  return entries;
}

function decodeBitmap(data: Buffer): DecodedIco | null {
  if (data.length < 40) return null;
  const headerSize = data.readUInt32LE(0);
  const width = data.readInt32LE(4);
  // The stored height covers the colour rows and the AND mask rows.
  const height = Math.abs(data.readInt32LE(8)) / 2;
  const bitCount = data.readUInt16LE(14);
  if (width <= 0 || height <= 0 || (bitCount !== 32 && bitCount !== 24)) {
    return null;
  }

  const bytesPerPixel = bitCount / 8;
  const rowStride = Math.ceil((width * bytesPerPixel) / 4) * 4;
  const maskStride = Math.ceil(width / 32) * 4;
  const pixelsStart = headerSize;
  const maskStart = pixelsStart + rowStride * height;
  if (maskStart > data.length) return null;
  const hasMask = maskStart + maskStride * height <= data.length;

  const rgba = Buffer.alloc(width * height * 4);
  let anyAlpha = false;

  for (let y = 0; y < height; y++) {
    // Bitmap rows are stored bottom-up.
    const src = pixelsStart + (height - 1 - y) * rowStride;
    for (let x = 0; x < width; x++) {
      const p = src + x * bytesPerPixel;
      const o = (y * width + x) * 4;
      rgba[o] = data[p + 2]!;
      rgba[o + 1] = data[p + 1]!;
      rgba[o + 2] = data[p]!;
      rgba[o + 3] = bitCount === 32 ? data[p + 3]! : 255;
      if (bitCount === 32 && data[p + 3] !== 0) anyAlpha = true;
    }
  }

  // 24-bit icons, and 32-bit ones with an empty alpha channel, rely on the mask.
  if (hasMask && !anyAlpha) {
    for (let y = 0; y < height; y++) {
      const row = maskStart + (height - 1 - y) * maskStride;
      for (let x = 0; x < width; x++) {
        const transparent = (data[row + (x >> 3)]! >> (7 - (x & 7))) & 1;
        rgba[(y * width + x) * 4 + 3] = transparent ? 0 : 255;
      }
    }
  }

  return { rgba, width, height };
}

/** The largest image in an ICO file, or null when none can be read. */
export function decodeIco(bytes: Buffer): DecodedIco | null {
  const entries = readEntries(bytes).sort((a, b) => b.width - a.width);
  for (const entry of entries) {
    const data = bytes.subarray(entry.offset, entry.offset + entry.size);
    if (data.subarray(0, 4).equals(PNG_SIGNATURE)) return Buffer.from(data);
    const bitmap = decodeBitmap(data);
    if (bitmap) return bitmap;
  }
  return null;
}
