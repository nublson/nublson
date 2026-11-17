import type { PostMetadata } from "@/utils/formatter";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookList } from "./book-list";

const book = (overrides: Partial<PostMetadata>) =>
  ({
    id: "1",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    status: "Wishlist",
    path: "",
    ...overrides,
  }) as PostMetadata;

describe("BookList", () => {
  it("lists each book's title and author", () => {
    render(<BookList books={[book({})]} />);
    expect(screen.getByText("Sapiens")).toBeInTheDocument();
    expect(screen.getByText("Yuval Noah Harari")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("links a book with a Path in a new tab", () => {
    render(<BookList books={[book({ path: "https://amzn.to/y" })]} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://amzn.to/y");
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("greys the covers of unread books only", () => {
    const { container } = render(
      <BookList
        books={[
          book({}),
          book({ id: "2", title: "Meditations", status: "Reading" }),
          book({ id: "3", title: "Atomic Habits", status: "Read" }),
        ]}
      />,
    );
    const covers = container.querySelectorAll("[aria-hidden]");
    expect(covers[0]!.className).toContain("grayscale");
    expect(covers[1]!.className).not.toContain("grayscale");
    expect(covers[2]!.className).not.toContain("grayscale");
  });
});
