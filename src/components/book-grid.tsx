import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import { BookCover } from "./book-cover";

/**
 * Books as cover cards: four across, two on phones. Each card shows the
 * cover, title and author, and opens the book's `Path` (where to
 * get it) in a new tab; a book without one is a plain card. The book being
 * read gets a thin ring around its cover.
 */
export function BookGrid({ books }: { books: PostMetadata[] }) {
  return (
    <ul className="grid grid-cols-4 gap-x-5 gap-y-8 max-[560px]:grid-cols-2">
      {books.map((book) => {
        const card = (
          <>
            <BookCover
              book={book}
              className={cn(
                "transition-transform duration-200 ease-(--ease-out) group-hover/book:-translate-y-1 motion-reduce:transform-none",
                book.status === "Reading" &&
                  "outline outline-1 outline-offset-[3px] outline-foreground",
              )}
            />
            <span className="mt-3.5 block leading-snug font-medium text-pretty text-foreground">
              {book.title}
            </span>
            <span className="block text-subtle-foreground">{book.author}</span>
          </>
        );
        return (
          <li key={book.id}>
            {book.path ? (
              <a
                href={book.path}
                target="_blank"
                rel="noopener noreferrer"
                className="group/book block"
              >
                {card}
              </a>
            ) : (
              <div>{card}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
