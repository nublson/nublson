import Link from "next/link";

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
}: {
  date: string;
  dateTime: string;
  category?: string;
}) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-subtle-foreground tabular-nums">
      {date && <time dateTime={dateTime}>{date}</time>}
      {date && category && (
        <span aria-hidden className="opacity-60">
          ·
        </span>
      )}
      {category && <span>{category}</span>}
    </p>
  );
}
