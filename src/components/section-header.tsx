import Link from "next/link";

/**
 * Screen readers hear a link name out of context, so "All" is named for where
 * it goes ("View all posts"), not for the section ("View all More posts").
 */
const VIEW_ALL_LABELS: Record<string, string> = {
  "/writings": "View all posts",
  "/projects": "View all projects",
};

interface SectionHeaderProps {
  title: string;
  href?: string;
  /** When set, labels this region for assistive tech (pairs with `section` `aria-labelledby`). */
  titleId?: string;
}

export function SectionHeader({ title, href, titleId }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-baseline justify-between gap-4">
      <h2 id={titleId} className="text-sm font-normal text-subtle-foreground">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          aria-label={VIEW_ALL_LABELS[href] ?? `View all ${title.toLowerCase()}`}
          className="text-sm text-subtle-foreground transition-colors duration-150 ease-(--ease-out) hover:text-foreground"
        >
          All
        </Link>
      )}
    </div>
  );
}
