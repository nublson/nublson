import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import { BookCover } from "./book-cover";
import { BookLink } from "./book-link";

/**
 * The books being read, one per row: a small cover, then the title, author,
 * a two-line description and a "Get it" link to the book's `Path`.
 */
export function BookReading({ books }: { books: PostMetadata[] }) {
  return (
    <ul className="flex flex-col">
      {books.map((book) => (
        <li
          key={book.id}
          className="grid grid-cols-[72px_1fr] items-start gap-[18px] py-6 first:pt-0 last:pb-0 not-first:border-t not-first:border-border max-[560px]:grid-cols-[60px_1fr] max-[560px]:gap-3.5"
        >
          <BookLink href={book.path} tabIndex={-1} aria-hidden className={cn("block", book.path && "group/book")}>
            <BookCover
              book={book}
              className="transition-transform duration-200 ease-(--ease-out) group-hover/book:-translate-y-1 motion-reduce:transform-none"
            />
          </BookLink>
          <div className="min-w-0">
            <h3 className="font-heading text-xl leading-[26px] font-medium tracking-[-0.01em] text-balance break-words text-foreground">
              {book.title}
            </h3>
            <p className="text-subtle-foreground">{book.author}</p>
            {book.description && (
              <p className="mt-2 line-clamp-2 text-pretty text-subtle-foreground">
                {book.description}
              </p>
            )}
            {book.path && (
              <p className="mt-3 text-[13px]">
                <BookLink
                  href={book.path}
                  className="text-foreground underline decoration-border underline-offset-[3px] transition-colors duration-150 ease-(--ease-out) hover:decoration-foreground"
                >
                  Get it ↗
                </BookLink>
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
