import Link from "next/link";
import type { ReactNode } from "react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="link inline-flex w-fit items-center gap-1.5">
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export function ArticleMeta({
  date,
  dateTime,
  category,
  actions,
}: {
  date: string;
  dateTime: string;
  category?: string;
  /** Inline controls after the meta text, such as Listen. */
  actions?: ReactNode;
}) {
  const separator = (
    <span aria-hidden className="opacity-60">
      ·
    </span>
  );

  return (
    <p className="flex flex-wrap items-center gap-2 text-subtle-foreground tabular-nums">
      {date && <time dateTime={dateTime}>{date}</time>}
      {date && category && separator}
      {category && <span>{category}</span>}
      {actions && (date || category) && separator}
      {actions}
    </p>
  );
}
