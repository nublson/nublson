import type { PostMetadata } from "@/utils/formatter";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookReading } from "./book-reading";

const book = (overrides: Partial<PostMetadata>) =>
  ({
    id: "1",
    title: "Meditations",
    author: "Marcus Aurelius",
    isbn: "9780812968255",
    status: "Reading",
    category: "Philosophy",
    description: "The private notebook of a Roman emperor.",
    path: "https://amzn.to/x",
    ...overrides,
  }) as PostMetadata;

describe("BookReading", () => {
  it("shows the title, author and description, but not the category", () => {
    render(<BookReading books={[book({})]} />);
    expect(screen.getByRole("heading", { name: "Meditations" })).toBeInTheDocument();
    expect(screen.getByText("Marcus Aurelius")).toBeInTheDocument();
    expect(screen.getByText("The private notebook of a Roman emperor.")).toBeInTheDocument();
    expect(screen.queryByText("Philosophy")).toBeNull();
  });

  it("links to the book's Path in a new tab", () => {
    render(<BookReading books={[book({})]} />);
    const link = screen.getByRole("link", { name: /get it/i });
    expect(link).toHaveAttribute("href", "https://amzn.to/x");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has no links when the book has no Path", () => {
    render(<BookReading books={[book({ path: "" })]} />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders one entry per book", () => {
    render(
      <BookReading books={[book({}), book({ id: "2", title: "Zero to One" })]} />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[1]!).getByText("Zero to One")).toBeInTheDocument();
  });
});
