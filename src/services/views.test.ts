import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockMaybeSingle, mockEq, mockSelect, mockRpc, mockFrom } = vi.hoisted(
  () => {
    const mockMaybeSingle = vi.fn();
    const mockEq = vi.fn();
    const mockSelect = vi.fn();
    const mockRpc = vi.fn();
    const mockFrom = vi.fn((table: string) => {
      if (table !== "post_view_counts") {
        throw new Error(`Unexpected table: ${table}`);
      }
      return {
        select: mockSelect,
      };
    });
    return { mockMaybeSingle, mockEq, mockSelect, mockRpc, mockFrom };
  },
);

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: mockFrom,
    rpc: mockRpc,
  },
}));

import { getViewCount, recordUniqueView } from "./views";

describe("getViewCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
  });

  it("returns 0 when no row exists", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    await expect(getViewCount("post-1")).resolves.toBe(0);
  });

  it("returns the stored views value", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { views: 42 },
      error: null,
    });

    await expect(getViewCount("post-1")).resolves.toBe(42);
  });

  it("throws when supabase returns an error", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });

    await expect(getViewCount("post-1")).rejects.toThrow(
      "Failed to fetch view count: boom",
    );
  });
});

describe("recordUniqueView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the rpc result for a first-time view", async () => {
    mockRpc.mockResolvedValueOnce({ data: 1, error: null });

    await expect(
      recordUniqueView("post-1", "hello-world", "session-a"),
    ).resolves.toBe(1);

    expect(mockRpc).toHaveBeenCalledWith("record_unique_view", {
      p_post_id: "post-1",
      p_post_slug: "hello-world",
      p_session_id: "session-a",
    });
  });

  it("returns the same total when the session already counted", async () => {
    mockRpc.mockResolvedValueOnce({ data: 5, error: null });

    await expect(
      recordUniqueView("post-1", "hello-world", "session-a"),
    ).resolves.toBe(5);
  });

  it("returns 0 when rpc data is null", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: null });

    await expect(
      recordUniqueView("post-1", "hello-world", "session-a"),
    ).resolves.toBe(0);
  });

  it("throws when rpc fails", async () => {
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: "rpc failed" },
    });

    await expect(
      recordUniqueView("post-1", "hello-world", "session-a"),
    ).rejects.toThrow("Failed to record view: rpc failed");
  });
});
