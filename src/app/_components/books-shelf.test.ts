import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/notion", () => ({
  BOOK_FILTER_PROPERTIES: ["title", "Status"],
  getAllPublishedPostsForFeed: vi.fn(async () => []),
}));

const { getAllPublishedPostsForFeed } = await import("@/services/notion");
const { getBooks } = await import("./books-shelf");

describe("getBooks", () => {
  it("requests Status, which the shelf groups by", async () => {
    await getBooks();
    // Notion returns only the requested properties; without Status every
    // book would fall under "Read".
    const filterProperties = vi.mocked(getAllPublishedPostsForFeed).mock
      .calls[0]![2];
    expect(filterProperties).toContain("Status");
  });
});
