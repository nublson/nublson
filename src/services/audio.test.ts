import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockMaybeSingle,
  mockEq,
  mockSelect,
  mockUpdate,
  mockUpdateEq,
  mockUpsert,
  mockUpload,
  mockGetPublicUrl,
  mockFrom,
  mockStorageFrom,
  mockTtsStream,
} = vi.hoisted(() => {
  const mockTtsStream = vi.fn();
  const mockMaybeSingle = vi.fn();
  const mockEq = vi.fn();
  const mockSelect = vi.fn();
  const mockUpdate = vi.fn();
  const mockUpdateEq = vi.fn();
  const mockUpsert = vi.fn();
  const mockUpload = vi.fn();
  const mockGetPublicUrl = vi.fn();
  const mockStorageFrom = vi.fn(() => ({
    upload: mockUpload,
    getPublicUrl: mockGetPublicUrl,
  }));
  const mockFrom = vi.fn((table: string) => {
    if (table !== "post_audio") {
      throw new Error(`Unexpected table: ${table}`);
    }
    return {
      select: mockSelect,
      update: mockUpdate,
      upsert: mockUpsert,
    };
  });
  return {
    mockMaybeSingle,
    mockEq,
    mockSelect,
    mockUpdate,
    mockUpdateEq,
    mockUpsert,
    mockUpload,
    mockGetPublicUrl,
    mockFrom,
    mockStorageFrom,
    mockTtsStream,
  };
});

vi.mock("@elevenlabs/elevenlabs-js", () => ({
  ElevenLabsClient: class {
    textToSpeech = { stream: mockTtsStream };
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: mockFrom,
    storage: {
      from: mockStorageFrom,
    },
  },
}));

vi.mock("@/services/notion", () => ({
  getPageBlocks: vi.fn().mockResolvedValue([]),
}));

vi.mock("next/server", () => ({
  // Do not run background work inline in unit tests.
  after: vi.fn(),
}));

import type { RichTextItemResponse } from "@notionhq/client";
import { getPageBlocks } from "@/services/notion";
import { after } from "next/server";
import {
  buildNarrationText,
  cacheAudioBuffer,
  getCachedAudio,
  getOrGenerateAudio,
  splitNarration,
} from "./audio";

const sampleMetadata = {
  id: "page-1",
  title: "Hello",
  slug: "hello",
  description: "",
  descriptionRichText: [],
  published_date: "2026-01-01",
  updated_date: "2026-01-01",
  path: "",
  source: "",
  category: "",
  author: "",
};

describe("getCachedAudio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
    mockUpdate.mockReturnValue({ eq: mockUpdateEq });
    mockUpdateEq.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it("returns a slug hit without repairing when post_id matches", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: {
        post_id: "page-1",
        audio_path: "hello.opus",
        content_hash: "abc",
      },
      error: null,
    });

    await expect(getCachedAudio("page-1", "hello")).resolves.toEqual({
      audio_path: "hello.opus",
      content_hash: "abc",
    });
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalledWith("post_id, audio_path, content_hash");
    expect(mockEq).toHaveBeenCalledWith("post_slug", "hello");
  });

  it("repairs drifted post_id on a slug hit and still returns the cache", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: {
        post_id: "old-page",
        audio_path: "hello.opus",
        content_hash: "abc",
      },
      error: null,
    });

    await expect(getCachedAudio("new-page", "hello")).resolves.toEqual({
      audio_path: "hello.opus",
      content_hash: "abc",
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      post_id: "new-page",
      updated_at: expect.any(String),
    });
  });

  it("falls back to post_id when no slug row exists", async () => {
    mockMaybeSingle
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({
        data: { audio_path: "hello.opus", content_hash: "abc" },
        error: null,
      });

    await expect(getCachedAudio("page-1", "hello")).resolves.toEqual({
      audio_path: "hello.opus",
      content_hash: "abc",
    });
    expect(mockEq).toHaveBeenNthCalledWith(1, "post_slug", "hello");
    expect(mockEq).toHaveBeenNthCalledWith(2, "post_id", "page-1");
  });

  it("returns null when neither slug nor post_id matches", async () => {
    mockMaybeSingle
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: null, error: null });

    await expect(getCachedAudio("page-1", "hello")).resolves.toBeNull();
  });

  it("throws when the slug lookup fails", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });

    await expect(getCachedAudio("page-1", "hello")).rejects.toThrow(
      "Failed to fetch post audio: boom",
    );
  });
});

describe("cacheAudioBuffer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpload.mockResolvedValue({ error: null });
    mockUpsert.mockResolvedValue({ error: null });
  });

  it("uploads MP3 and upserts on post_slug conflict", async () => {
    await cacheAudioBuffer("page-1", "hello", "hash123", Buffer.from("mp3"));

    expect(mockStorageFrom).toHaveBeenCalledWith("post-audio");
    expect(mockUpload).toHaveBeenCalledWith(
      "hello.mp3",
      expect.any(Buffer),
      {
        contentType: "audio/mpeg",
        upsert: true,
      },
    );
    expect(mockUpsert).toHaveBeenCalledWith(
      {
        post_id: "page-1",
        post_slug: "hello",
        content_hash: "hash123",
        audio_path: "hello.mp3",
        voice: "JBFqnCBsd6RMkjVDRZzb",
        model: "eleven_v4",
        updated_at: expect.any(String),
      },
      { onConflict: "post_slug" },
    );
  });

  it("throws when upsert fails", async () => {
    mockUpsert.mockResolvedValueOnce({
      error: { message: "duplicate key" },
    });

    await expect(
      cacheAudioBuffer("page-1", "hello", "hash123", Buffer.from("mp3")),
    ).rejects.toThrow("Failed to record post audio: duplicate key");
  });
});

describe("getOrGenerateAudio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
    mockGetPublicUrl.mockReturnValue({
      data: {
        publicUrl:
          "https://example.supabase.co/storage/v1/object/public/post-audio/hello.opus",
      },
    });
  });

  it("redirects to the public URL when a slug-cached row exists", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: {
        post_id: "page-1",
        audio_path: "hello.opus",
        content_hash: "abcdef0123456789",
      },
      error: null,
    });

    const result = await getOrGenerateAudio("page-1", "hello", sampleMetadata);

    expect(result).toEqual({
      type: "redirect",
      url: "https://example.supabase.co/storage/v1/object/public/post-audio/hello.opus?v=abcdef012345",
    });
  });
});

describe("getOrGenerateAudio streaming", () => {
  const bytes = (text: string) =>
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(text));
        controller.close();
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
  });

  it("streams uncached narration from ElevenLabs as MP3", async () => {
    mockTtsStream.mockResolvedValueOnce(bytes("audio"));

    const result = await getOrGenerateAudio("page-1", "hello", sampleMetadata);

    expect(result.type).toBe("stream");
    if (result.type !== "stream") return;
    expect(result.contentType).toBe("audio/mpeg");
    await expect(new Response(result.body).text()).resolves.toBe("audio");
    expect(mockTtsStream).toHaveBeenCalledWith("JBFqnCBsd6RMkjVDRZzb", {
      text: "Hello",
      modelId: "eleven_v4",
      outputFormat: "mp3_44100_128",
      previousText: undefined,
      nextText: undefined,
    });
  });

  it("joins narration over the request limit and passes neighbours as context", async () => {
    const long = (ch: string) =>
      ({
        id: ch,
        type: "paragraph",
        has_children: false,
        paragraph: {
          rich_text: [
            {
              type: "text",
              plain_text: ch.repeat(6000),
              href: null,
              annotations: { bold: false, italic: false, strikethrough: false, code: false },
            },
          ],
        },
      }) as never;
    vi.mocked(getPageBlocks).mockResolvedValueOnce([long("a"), long("b")]);
    mockTtsStream
      .mockResolvedValueOnce(bytes("first-"))
      .mockResolvedValueOnce(bytes("second"));

    const result = await getOrGenerateAudio("page-1", "hello", sampleMetadata);
    if (result.type !== "stream") throw new Error("expected a stream");

    await expect(new Response(result.body).text()).resolves.toBe("first-second");
    expect(mockTtsStream).toHaveBeenCalledTimes(2);
    const [first, second] = mockTtsStream.mock.calls.map((call) => call[1]);
    expect(first.text.length).toBeLessThanOrEqual(9000);
    expect(first.nextText).toBe(second.text);
    expect(second.previousText).toBe(first.text);
  });

  it("errors the stream and skips caching when a later request fails", async () => {
    const long = (ch: string) =>
      ({
        id: ch,
        type: "paragraph",
        has_children: false,
        paragraph: {
          rich_text: [
            {
              type: "text",
              plain_text: ch.repeat(6000),
              href: null,
              annotations: { bold: false, italic: false, strikethrough: false, code: false },
            },
          ],
        },
      }) as never;
    vi.mocked(getPageBlocks).mockResolvedValueOnce([long("a"), long("b")]);
    mockTtsStream
      .mockResolvedValueOnce(bytes("first-"))
      .mockRejectedValueOnce(new Error("Status code: 429"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getOrGenerateAudio("page-1", "hello", sampleMetadata);
    if (result.type !== "stream") throw new Error("expected a stream");

    await expect(new Response(result.body).text()).rejects.toThrow("Status code: 429");
    const cacheInBackground = vi.mocked(after).mock.calls[0][0] as () => Promise<void>;
    await cacheInBackground();

    expect(mockUpload).not.toHaveBeenCalled();
    expect(mockUpsert).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining("failed to cache streamed audio"),
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it("throws before streaming when the first request fails", async () => {
    mockTtsStream.mockRejectedValueOnce(new Error("Status code: 401"));

    await expect(
      getOrGenerateAudio("page-1", "hello", sampleMetadata),
    ).rejects.toThrow("Status code: 401");
  });
});

describe("splitNarration", () => {
  it("keeps short narration in one piece", () => {
    expect(splitNarration("One.\n\nTwo.", 100)).toEqual(["One.\n\nTwo."]);
  });

  it("breaks between paragraphs first", () => {
    expect(splitNarration("aaaa.\n\nbbbb.\n\ncccc.", 13)).toEqual([
      "aaaa.\n\nbbbb.",
      "cccc.",
    ]);
  });

  it("breaks a long paragraph between sentences", () => {
    expect(splitNarration("One two. Three four. Five.", 20)).toEqual([
      "One two. Three four.",
      "Five.",
    ]);
  });

  it("cuts a sentence longer than the limit", () => {
    const pieces = splitNarration("x".repeat(25), 10);
    expect(pieces).toEqual(["x".repeat(10), "x".repeat(10), "x".repeat(5)]);
  });

  it("never returns a piece over the limit", () => {
    const text = Array.from({ length: 40 }, (_, i) => `Sentence number ${i}.`).join(" ");
    for (const piece of splitNarration(text, 50)) {
      expect(piece.length).toBeLessThanOrEqual(50);
    }
  });
});

describe("buildNarrationText", () => {
  const paragraph = (text: string) =>
    ({
      id: text,
      type: "paragraph",
      has_children: false,
      paragraph: {
        rich_text: [
          {
            type: "text",
            plain_text: text,
            href: null,
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              code: false,
            },
          },
        ],
      },
    }) as never;
  const richText = (text: string) =>
    [{ type: "text", plain_text: text, href: null }] as RichTextItemResponse[];

  it("reads the title, then the description, then the body", () => {
    const text = buildNarrationText(
      {
        title: "The Midnight Idea Problem",
        description: "Too many ideas. Not enough answers.",
        descriptionRichText: richText("Too many ideas. Not enough answers."),
      },
      [paragraph("It started at midnight.")],
    );

    expect(text).toBe(
      "The Midnight Idea Problem.\n\nToo many ideas. Not enough answers.\n\nIt started at midnight.",
    );
  });

  it("keeps the description's paragraph breaks", () => {
    const text = buildNarrationText(
      {
        title: "Title",
        description: "First. Second.",
        descriptionRichText: richText("First.\n\nSecond"),
      },
      [],
    );

    expect(text).toBe("Title.\n\nFirst.\n\nSecond");
  });

  it("skips a missing description", () => {
    const text = buildNarrationText(
      { title: "Title?", description: "", descriptionRichText: [] },
      [paragraph("Body.")],
    );

    expect(text).toBe("Title?\n\nBody.");
  });
});
