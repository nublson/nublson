import { bookCoverUrl } from "@/utils/formatter";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookCover } from "./book-cover";

const book = {
  title: "Atomic Habits",
  author: "James Clear",
  isbn: "9780735211292",
};

describe("BookCover", () => {
  it("renders the Open Library cover", () => {
    const { container } = render(<BookCover book={book} />);
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      bookCoverUrl(book.isbn),
    );
  });

  it("draws a cover when there is no ISBN", () => {
    const { container } = render(<BookCover book={{ ...book, isbn: "" }} />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("James Clear")).toBeInTheDocument();
  });

  it("draws a cover when the image fails", () => {
    const { container } = render(<BookCover book={book} />);
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
  });
});
