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
    path: "https://amzn.to/4ax82J8",
    ...overrides,
  }) as PostMetadata;

describe("BookGrid", () => {
  it("links each card to the book's Path in a new tab", () => {
    render(<BookGrid books={[book({})]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://amzn.to/4ax82J8");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a card without a link when there is no Path", () => {
    render(<BookGrid books={[book({ path: "" })]} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
  });

  it("shows no date", () => {
    const { container } = render(<BookGrid books={[book({})]} />);
    expect(container.querySelector("time")).toBeNull();
    expect(screen.queryByText("2021")).toBeNull();
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
