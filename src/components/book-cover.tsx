"use client";

import { cn } from "@/lib/utils";
import { bookCoverUrl, type PostMetadata } from "@/utils/formatter";
import { useEffect, useRef, useState } from "react";

type BookCoverProps = {
  book: Pick<PostMetadata, "title" | "author" | "isbn">;
  className?: string;
};

/**
 * A book's flat cover from Open Library, shaped like a book: a spine crease
 * on the left, a hairline edge and a soft shadow. A book with no ISBN, or one
 * Open Library has no cover for, gets a drawn cover with its title and
 * author, so nothing ever shows broken. Decorative: the card names the book.
 */
export function BookCover({ book, className }: BookCoverProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"loading" | "loaded" | "failed">(
    book.isbn ? "loading" : "failed",
  );

  // A server-rendered image can finish (or fail) before React attaches its handlers.
  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    queueMicrotask(() => setState(img.naturalWidth > 0 ? "loaded" : "failed"));
  }, []);

  return (
    <span
      aria-hidden
      className={cn(
        "relative block aspect-[2/3] overflow-hidden rounded-[2px_4px_4px_2px] bg-card shadow-[0_1px_2px_oklch(0_0_0/0.08),0_8px_18px_-6px_oklch(0_0_0/0.25)] dark:shadow-[0_1px_2px_oklch(0_0_0/0.4),0_10px_22px_-8px_oklch(0_0_0/0.7)]",
        // Spine crease, then a hairline edge above the image.
        "before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-[8%] before:bg-[linear-gradient(90deg,oklch(0_0_0/0.28),oklch(1_0_0/0.12)_45%,oklch(0_0_0/0.1))]",
        "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--image-outline)]",
        className,
      )}
    >
      {state === "failed" ? (
        <span className="flex size-full flex-col justify-between p-2 pl-[calc(8%+0.5rem)]">
          <span className="text-[10px] leading-tight font-medium text-pretty text-foreground">
            {book.title}
          </span>
          <span className="text-[9px] leading-tight text-subtle-foreground">
            {book.author}
          </span>
        </span>
      ) : (
        // Open Library redirects to archive.org hosts; next/image would need them all allowlisted.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={bookCoverUrl(book.isbn)}
          alt=""
          loading="lazy"
          decoding="async"
          data-loaded={state === "loaded" || undefined}
          onLoad={() => setState("loaded")}
          onError={() => setState("failed")}
          className="fade-in-image size-full object-cover"
        />
      )}
    </span>
  );
}
