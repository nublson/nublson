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
} = vi.hoisted(() => {
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
  };
});

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

import { cacheAudioBuffer, getCachedAudio, getOrGenerateAudio } from "./audio";

const sampleMetadata = {
  id: "page-1",
  title: "Hello",
  slug: "hello",
  description: "",
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

  it("uploads Opus and upserts on post_slug conflict", async () => {
    await cacheAudioBuffer("page-1", "hello", "hash123", Buffer.from("ogg"));

    expect(mockStorageFrom).toHaveBeenCalledWith("post-audio");
    expect(mockUpload).toHaveBeenCalledWith(
      "hello.opus",
      expect.any(Buffer),
      {
        contentType: "audio/ogg; codecs=opus",
        upsert: true,
      },
    );
    expect(mockUpsert).toHaveBeenCalledWith(
      {
        post_id: "page-1",
        post_slug: "hello",
        content_hash: "hash123",
        audio_path: "hello.opus",
        voice: "cedar",
        model: "gpt-4o-mini-tts",
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
      cacheAudioBuffer("page-1", "hello", "hash123", Buffer.from("ogg")),
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
