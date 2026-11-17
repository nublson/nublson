"use client";

import { Button } from "@/components/ui/button";
import type { PostMetadata } from "@/utils/formatter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookCover } from "./book-cover";
import { BookLink } from "./book-link";
import { SectionWrapper } from "./section-wrapper";

/**
 * A section of books in one sideways row: seven across with the next one
 * peeking into the edge fade, about four on phones. Arrow buttons in the header page one view at a time and grey out
 * at either end.
 */
export function BookStrip({
  title,
  id,
  books,
}: {
  title: string;
  id: string;
  books: PostMetadata[];
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setEdges({
      start: list.scrollLeft < 4,
      end: list.scrollLeft + list.clientWidth > list.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(list);
    return () => observer.disconnect();
  }, [sync]);

  const page = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: direction * list.clientWidth,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  // Same look as the theme toggle: ghost icon buttons in the muted text
  // colour. Negative margins keep the 28px hit area without making this header
  // taller than the others or pulling the icon in from the column's edge.
  const arrowButton =
    "cursor-pointer text-subtle-foreground hover:text-foreground [&_svg]:size-[15px]";
  const arrows = (
    <div className="-my-1 -mr-1.5 flex gap-0.5 self-center">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={arrowButton}
        aria-label={`Previous ${title.toLowerCase()} books`}
        aria-controls={`${id}-list`}
        disabled={edges.start}
        onClick={() => page(-1)}
      >
        <ArrowLeft aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={arrowButton}
        aria-label={`Next ${title.toLowerCase()} books`}
        aria-controls={`${id}-list`}
        disabled={edges.end}
        onClick={() => page(1)}
      >
        <ArrowRight aria-hidden />
      </Button>
    </div>
  );

  return (
    <SectionWrapper title={title} id={id} action={arrows}>
      <ul
        ref={listRef}
        id={`${id}-list`}
        onScroll={sync}
        className="flex snap-x snap-mandatory scroll-fade-x gap-3.5 [--fade-size:2.5rem] overflow-x-auto pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {books.map((book) => (
          <li
            key={book.id}
            className="w-[calc((100%-7*0.875rem)/7.4)] flex-none snap-start max-[560px]:w-[calc((100%-4*0.875rem)/4.4)]"
          >
            <BookLink href={book.path} className="group/book block">
              <BookCover
                book={book}
                className="transition-transform duration-200 ease-(--ease-out) group-hover/book:-translate-y-1 motion-reduce:transform-none"
              />
              <span className="mt-2 line-clamp-2 text-xs leading-snug font-medium break-words text-pretty text-foreground">
                {book.title}
              </span>
              <span className="block text-xs text-subtle-foreground">{book.author}</span>
            </BookLink>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
