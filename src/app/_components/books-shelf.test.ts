import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/notion", () => ({
  getAllPublishedPostsForFeed: vi.fn(async () => []),
}));

const { getAllPublishedPostsForFeed } = await import("@/services/notion");
const { getBooks } = await import("./books-shelf");

const callArgs = async () => {
  vi.mocked(getAllPublishedPostsForFeed).mockClear();
  await getBooks();
  return vi.mocked(getAllPublishedPostsForFeed).mock.calls[0]!;
};

describe("getBooks", () => {
  it("requests Status, ISBN and Featured, which the shelf and Home use", async () => {
    // Notion returns only the requested properties; without Status every
    // book would fall under "Read".
    const [, , filterProperties] = await callArgs();
    expect(filterProperties).toEqual(
      expect.arrayContaining(["Status", "ISBN", "Featured"]),
    );
  });

  it("doesn't request fields books no longer use", async () => {
    // Notion answers 400 for a requested property that doesn't exist, so
    // these could not be deleted from the database otherwise.
    const [, , filterProperties] = await callArgs();
    expect(filterProperties).not.toContain("Publish Date");
    expect(filterProperties).not.toContain("Source");
    expect(filterProperties).not.toContain("Category");
  });

  it("sorts books by Read Date, newest first, then by title", async () => {
    const [, , , sorts] = await callArgs();
    expect(sorts).toEqual([
      { property: "Read Date", direction: "descending" },
      { property: "Name", direction: "ascending" },
    ]);
  });
});
