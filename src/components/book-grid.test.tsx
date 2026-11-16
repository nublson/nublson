import type { PostMetadata } from "@/utils/formatter";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookGrid } from "./book-grid";

const book = (overrides: Partial<PostMetadata>) =>
  ({
    id: "1",
    title: "Atomic Habits",
    slug: "atomic-habits",
    author: "James Clear",
    isbn: "9780735211292",
    status: "Read",
    published_date: "2021-01-13",
    ...overrides,
  }) as PostMetadata;

describe("BookGrid", () => {
  it("links each card to its book", () => {
    render(<BookGrid books={[book({})]} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/books/atomic-habits",
    );
  });

  it("shows the finish year, not a date", () => {
    render(<BookGrid books={[book({})]} />);
    expect(screen.getByText("2021")).toBeInTheDocument();
    expect(screen.queryByText(/13/)).toBeNull();
  });

  it("omits the year when undated", () => {
    const { container } = render(
      <BookGrid books={[book({ published_date: "" })]} />,
    );
    expect(container.querySelector("time")).toBeNull();
  });

  it("rings the book being read", () => {
    const { container } = render(
      <BookGrid
        books={[
          book({ id: "1", status: "Reading" }),
          book({ id: "2", slug: "other", status: "Read" }),
        ]}
      />,
    );
    const covers = container.querySelectorAll("[aria-hidden]");
    expect(covers[0]!.className).toContain("outline-foreground");
    expect(covers[1]!.className).not.toContain("outline-foreground");
  });
});
