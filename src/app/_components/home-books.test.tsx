import type { PostMetadata } from "@/utils/formatter";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/notion", () => ({
  getAllPublishedPostsForFeed: vi.fn(async () => []),
}));

const { HomeBooks, pickHomeBooks } = await import("./home-books");

const book = (title: string, status: string, featured = true) =>
  ({
    id: title,
    title,
    author: "A",
    isbn: "",
    path: "",
    status,
    featured,
  }) as PostMetadata;

describe("pickHomeBooks", () => {
  it("takes featured books Reading, then Read, then Wishlist, four at most", () => {
    const picked = pickHomeBooks([
      book("Sapiens", "Wishlist"),
      book("Atomic Habits", "Read"),
      book("Meditations", "Reading"),
      book("Essentialism", "Read"),
      book("Zero to One", "Reading"),
      book("Hyperfocus", "Read"),
    ]);
    expect(picked.map((b) => b.title)).toEqual([
      "Meditations",
      "Zero to One",
      "Atomic Habits",
      "Essentialism",
    ]);
  });

  it("leaves out books that aren't Featured", () => {
    const picked = pickHomeBooks([
      book("Meditations", "Reading", false),
      book("Atomic Habits", "Read"),
      book("Sapiens", "Wishlist", false),
    ]);
    expect(picked.map((b) => b.title)).toEqual(["Atomic Habits"]);
  });

  it("fills up with Wishlist books when fewer are read", () => {
    const picked = pickHomeBooks([
      book("Sapiens", "Wishlist"),
      book("Meditations", "Reading"),
    ]);
    expect(picked.map((b) => b.title)).toEqual(["Meditations", "Sapiens"]);
  });
});

describe("HomeBooks", () => {
  it("titles the section Books and links to /books", () => {
    render(<HomeBooks books={[book("Meditations", "Reading")]} />);
    expect(screen.getByRole("heading", { name: "Books" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all books" })).toHaveAttribute(
      "href",
      "/books",
    );
  });

  it("renders nothing without books", () => {
    const { container } = render(<HomeBooks books={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
