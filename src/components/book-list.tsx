import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import { BookCover } from "./book-cover";
import { BookLink } from "./book-link";

/** Statuses whose covers show in colour; a book with no status counts as read. */
const READ_STATUSES = new Set(["Reading", "Read", ""]);

/**
 * Books as a compact list: a tiny cover beside the title and author, two
 * columns, one on phones. Covers of books not yet read (Wishlist) are greyed.
 */
export function BookList({ books }: { books: PostMetadata[] }) {
  return (
    <ul className="-mx-2.5 grid grid-cols-2 gap-x-1 gap-y-1 max-[560px]:grid-cols-1">
      {books.map((book) => (
        <li key={book.id}>
          <BookLink
            href={book.path}
            className={cn(
              "grid grid-cols-[28px_1fr] items-center gap-3 rounded-lg px-2.5 py-2",
              // Same hover as project and gear rows; only linked books are interactive.
              book.path && "group/book press hover:bg-muted",
            )}
          >
            <BookCover
              book={book}
              className={cn(
                "shadow-[0_1px_2px_oklch(0_0_0/0.1),0_4px_8px_-4px_oklch(0_0_0/0.3)]",
                !READ_STATUSES.has(book.status) && "opacity-70 grayscale",
              )}
            />
            <span className="min-w-0">
              <span className="block leading-snug font-medium break-words text-foreground">
                {book.title}
              </span>
              <span className="block text-subtle-foreground transition-colors duration-150 ease-(--ease-out) group-hover/book:text-muted-foreground">
                {book.author}
              </span>
            </span>
          </BookLink>
        </li>
      ))}
    </ul>
  );
}
