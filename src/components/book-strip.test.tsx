import type { PostMetadata } from "@/utils/formatter";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BookStrip } from "./book-strip";

// jsdom has no ResizeObserver; the strip only uses it to re-check its edges.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    disconnect() {}
  },
);

const book = (overrides: Partial<PostMetadata>) =>
  ({
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    status: "Read",
    path: "https://amzn.to/4ax82J8",
    ...overrides,
  }) as PostMetadata;

const books = [book({}), book({ id: "2", title: "Essentialism", path: "" })];

describe("BookStrip", () => {
  it("titles its section and lists every book", () => {
    render(<BookStrip title="Read" id="read" books={books} />);
    expect(screen.getByRole("heading", { name: "Read" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("links a book to its Path in a new tab, and not a book without one", () => {
    render(<BookStrip title="Read" id="read" books={books} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://amzn.to/4ax82J8");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveTextContent("Atomic Habits");
  });

  it("starts at the beginning, so back is disabled", () => {
    render(<BookStrip title="Read" id="read" books={books} />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("scrolls one view forward when next is pressed", () => {
    render(<BookStrip title="Read" id="read" books={books} />);
    const list = screen.getByRole("list");
    Object.defineProperty(list, "clientWidth", { value: 600 });
    Object.defineProperty(list, "scrollWidth", { value: 1800 });
    list.scrollBy = vi.fn();
    fireEvent.scroll(list);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(list.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 600 }),
    );
  });
});
