import type { PostMetadata } from "@/utils/formatter";
import { describe, expect, it, vi } from "vitest";

const book = (id: string, status: string) => ({ id, status }) as PostMetadata;

vi.mock("./books-shelf", () => ({
  getBooks: vi.fn(async () => [
    book("a", "Read"),
    book("b", "Read"),
    book("c", "Read"),
    book("d", "Read"),
    book("e", "Reading"),
  ]),
}));

const { getHomeBooks } = await import("./home-books");

describe("getHomeBooks", () => {
  it("takes the first four in shelf order, Reading first", async () => {
    const books = await getHomeBooks();
    expect(books.map((b) => b.id)).toEqual(["e", "a", "b", "c"]);
  });
});
