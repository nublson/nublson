import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import Link from "next/link";
import { BookCover } from "./book-cover";

/**
 * Books as cover cards: four across, two on phones. Each card shows the
 * cover, title, author and finish year, and opens the book's page. The book
 * being read gets a thin ring around its cover.
 */
export function BookGrid({ books }: { books: PostMetadata[] }) {
  return (
    <ul className="grid grid-cols-4 gap-x-5 gap-y-8 max-[560px]:grid-cols-2">
      {books.map((book) => {
        const year = book.published_date.slice(0, 4);
        return (
          <li key={book.id}>
            <Link
              href={`/books/${book.slug}`}
              className="group/book block"
            >
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
              <span className="block text-subtle-foreground">
                {book.author}
              </span>
              {year && (
                <time
                  dateTime={year}
                  className="block text-xs text-subtle-foreground tabular-nums"
                >
                  {year}
                </time>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
