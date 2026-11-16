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
  it("requests Status and ISBN, which the shelf groups and draws by", async () => {
    // Notion returns only the requested properties; without Status every
    // book would fall under "Read".
    const [, , filterProperties] = await callArgs();
    expect(filterProperties).toEqual(
      expect.arrayContaining(["Status", "ISBN"]),
    );
  });

  it("doesn't request fields books no longer use", async () => {
    // Notion answers 400 for a requested property that doesn't exist, so
    // these could not be deleted from the database otherwise.
    const [, , filterProperties] = await callArgs();
    expect(filterProperties).not.toContain("Publish Date");
    expect(filterProperties).not.toContain("Source");
  });

  it("sorts books by title, A to Z", async () => {
    const [, , , sorts] = await callArgs();
    expect(sorts).toEqual([{ property: "Name", direction: "ascending" }]);
  });
});
