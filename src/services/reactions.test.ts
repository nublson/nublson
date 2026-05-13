import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock the Supabase client before importing the service under test.
// ---------------------------------------------------------------------------

const mockEqDelete = vi.fn();

const mockSelect = vi.fn();
const mockEqSelect = vi.fn();

const mockUpsert = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table !== "post_reactions") throw new Error(`Unexpected table: ${table}`);
      return {
        select: mockSelect,
        upsert: mockUpsert,
        delete: () => ({ eq: mockEqDelete }),
      };
    }),
  },
}));

// Import service after mocking
import {
  getPostReactions,
  upsertReaction,
  deleteReaction,
} from "./reactions";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type ReactionRow = { reaction_type: string; session_id: string; ip_hash: string | null };

function setupSelectMock(rows: ReactionRow[], error: null | { message: string } = null) {
  mockEqSelect.mockResolvedValueOnce({ data: rows, error });
  mockSelect.mockReturnValueOnce({ eq: mockEqSelect });
}

// ---------------------------------------------------------------------------
// getPostReactions
// ---------------------------------------------------------------------------

describe("getPostReactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns zero counts and null userReaction when there are no rows", async () => {
    setupSelectMock([]);

    const result = await getPostReactions("post-1", "session-abc");

    expect(result).toEqual({ likes: 0, dislikes: 0, userReaction: null });
  });

  it("aggregates like and dislike counts correctly", async () => {
    setupSelectMock([
      { reaction_type: "like", session_id: "s1", ip_hash: null },
      { reaction_type: "like", session_id: "s2", ip_hash: null },
      { reaction_type: "dislike", session_id: "s3", ip_hash: null },
    ]);

    const result = await getPostReactions("post-1", "s9");

    expect(result).toEqual({ likes: 2, dislikes: 1, userReaction: null });
  });

  it("sets userReaction when the session has an existing row", async () => {
    setupSelectMock([
      { reaction_type: "like", session_id: "me", ip_hash: null },
      { reaction_type: "dislike", session_id: "other", ip_hash: null },
    ]);

    const result = await getPostReactions("post-1", "me");

    expect(result).toEqual({ likes: 1, dislikes: 1, userReaction: "like" });
  });

  it("finds userReaction by ip_hash when provided", async () => {
    setupSelectMock([
      { reaction_type: "like", session_id: "browser-a", ip_hash: "hash-device-1" },
      { reaction_type: "dislike", session_id: "other", ip_hash: "hash-device-2" },
    ]);

    // browser-b is on the same device/network (same ip_hash)
    const result = await getPostReactions("post-1", "browser-b", "hash-device-1");

    expect(result).toEqual({ likes: 1, dislikes: 1, userReaction: "like" });
  });

  it("falls back to session_id lookup when ip_hash matches no row", async () => {
    setupSelectMock([
      { reaction_type: "dislike", session_id: "me", ip_hash: null },
    ]);

    const result = await getPostReactions("post-1", "me", "unknown-hash");

    expect(result).toEqual({ likes: 0, dislikes: 1, userReaction: "dislike" });
  });

  it("throws when Supabase returns an error", async () => {
    setupSelectMock([], { message: "Connection refused" });

    await expect(getPostReactions("post-1", "s")).rejects.toThrow(
      "Failed to fetch reactions: Connection refused",
    );
  });
});

// ---------------------------------------------------------------------------
// upsertReaction
// ---------------------------------------------------------------------------

describe("upsertReaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("upserts with session conflict target when no ip_hash provided", async () => {
    mockUpsert.mockResolvedValueOnce({ error: null });
    setupSelectMock([{ reaction_type: "like", session_id: "s1", ip_hash: null }]);

    const result = await upsertReaction("post-1", "my-post", "s1", "like");

    expect(mockUpsert).toHaveBeenCalledWith(
      {
        post_id: "post-1",
        post_slug: "my-post",
        session_id: "s1",
        reaction_type: "like",
      },
      { onConflict: "post_id,session_id" },
    );
    expect(result).toEqual({ likes: 1, dislikes: 0, userReaction: "like" });
  });

  it("upserts with ip_hash conflict target when ip_hash provided", async () => {
    mockUpsert.mockResolvedValueOnce({ error: null });
    setupSelectMock([{ reaction_type: "like", session_id: "s1", ip_hash: "hash-x" }]);

    const result = await upsertReaction("post-1", "my-post", "s1", "like", "hash-x");

    expect(mockUpsert).toHaveBeenCalledWith(
      {
        post_id: "post-1",
        post_slug: "my-post",
        session_id: "s1",
        reaction_type: "like",
        ip_hash: "hash-x",
      },
      { onConflict: "post_id,ip_hash" },
    );
    expect(result).toEqual({ likes: 1, dislikes: 0, userReaction: "like" });
  });

  it("throws when upsert fails", async () => {
    mockUpsert.mockResolvedValueOnce({ error: { message: "DB error" } });

    await expect(
      upsertReaction("post-1", "my-post", "s1", "dislike"),
    ).rejects.toThrow("Failed to upsert reaction: DB error");
  });
});

// ---------------------------------------------------------------------------
// deleteReaction
// ---------------------------------------------------------------------------

describe("deleteReaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes by session_id when no ip_hash provided", async () => {
    const mockEqSession = vi.fn().mockResolvedValueOnce({ error: null });
    mockEqDelete.mockReturnValueOnce({ eq: mockEqSession });
    setupSelectMock([]);

    const result = await deleteReaction("post-1", "s1");

    expect(mockEqDelete).toHaveBeenCalledWith("post_id", "post-1");
    expect(mockEqSession).toHaveBeenCalledWith("session_id", "s1");
    expect(result).toEqual({ likes: 0, dislikes: 0, userReaction: null });
  });

  it("deletes by ip_hash when ip_hash provided", async () => {
    const mockEqIpHash = vi.fn().mockResolvedValueOnce({ error: null });
    mockEqDelete.mockReturnValueOnce({ eq: mockEqIpHash });
    setupSelectMock([]);

    const result = await deleteReaction("post-1", "s1", "hash-x");

    expect(mockEqDelete).toHaveBeenCalledWith("post_id", "post-1");
    expect(mockEqIpHash).toHaveBeenCalledWith("ip_hash", "hash-x");
    expect(result).toEqual({ likes: 0, dislikes: 0, userReaction: null });
  });

  it("throws when delete fails", async () => {
    const mockEqSession = vi.fn().mockResolvedValueOnce({
      error: { message: "Delete failed" },
    });
    mockEqDelete.mockReturnValueOnce({ eq: mockEqSession });

    await expect(deleteReaction("post-1", "s1")).rejects.toThrow(
      "Failed to delete reaction: Delete failed",
    );
  });
});
