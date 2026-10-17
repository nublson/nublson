import { cn } from "@/lib/utils";
import {
  formatDateTimeIso,
  formatPostDateCompact,
  formatPostDayMonth,
  groupPostsByYear,
  type PostMetadata,
  type PostYearGroup,
} from "@/utils/formatter";
import Link from "next/link";

interface PostListProps {
  posts: PostMetadata[];
  /** Archive layout: a year column, `dd/mm` dates. Short lists leave it off. */
  groupByYear?: boolean;
  /** For tests; defaults to this year. */
  currentYear?: number;
  /**
   * Archive only: past this many posts, the rest sit in a native
   * `<details>` toggle. They stay in the HTML for scrapers and no-JS readers.
   */
  collapseAfter?: number;
}

function PostRows({
  posts,
  formatDate,
}: {
  posts: PostMetadata[];
  formatDate: (date: string) => string;
}) {
  return (
    <ul className="group/list min-w-0">
      {posts.map((post) => (
        <li key={post.id} className="border-t border-border first:border-t-0">
          <Link
            href={`/writings/${post.slug}`}
            aria-label={`${post.title} — read post`}
            className="press group/row flex items-baseline justify-between gap-4 py-2.5"
          >
            <span className="min-w-0 text-foreground transition-colors duration-150 ease-(--ease-out) group-hover/list:text-subtle-foreground group-hover/row:text-foreground!">
              {post.title}
            </span>
            <time
              dateTime={formatDateTimeIso(post.published_date)}
              className="shrink-0 text-subtle-foreground tabular-nums"
            >
              {formatDate(post.published_date)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function YearGroups({
  groups,
  continuesYear = false,
}: {
  groups: PostYearGroup[];
  /** The first group carries on a year already shown above, so its label is blank. */
  continuesYear?: boolean;
}) {
  return groups.map((group, index) => (
    <div
      key={group.year || "undated"}
      className={cn(
        "grid grid-cols-[52px_1fr] md:grid-cols-[64px_1fr]",
        index > 0 && "border-t border-border",
      )}
    >
      <span data-year className="py-2.5 text-subtle-foreground tabular-nums">
        {index === 0 && continuesYear ? "" : group.year || "—"}
      </span>
      <PostRows posts={group.posts} formatDate={formatPostDayMonth} />
    </div>
  ));
}

export function PostList({
  posts,
  groupByYear = false,
  currentYear,
  collapseAfter,
}: PostListProps) {
  if (posts.length === 0) return null;

  if (!groupByYear) {
    return (
      <div className="w-full border-y border-border">
        <PostRows
          posts={posts}
          formatDate={(date) => formatPostDateCompact(date, currentYear)}
        />
      </div>
    );
  }

  const limit =
    collapseAfter != null && posts.length > collapseAfter
      ? collapseAfter
      : posts.length;
  const shown = groupPostsByYear(posts.slice(0, limit));
  const older = groupPostsByYear(posts.slice(limit));
  const olderCount = posts.length - limit;

  return (
    <div className="w-full border-y border-border">
      <YearGroups groups={shown} />
      {olderCount > 0 && (
        <details className="group/older border-t border-border">
          <summary className="press flex cursor-pointer list-none justify-between gap-4 py-2.5 text-subtle-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
            <span data-show className="group-open/older:hidden">
              {`Show ${olderCount} older ${olderCount === 1 ? "post" : "posts"}`}
            </span>
            <span className="hidden group-open/older:inline">
              Hide older posts
            </span>
            <span
              aria-hidden
              className="transition-[rotate] duration-200 ease-(--ease-out) group-open/older:rotate-180"
            >
              ↓
            </span>
          </summary>
          <div className="older-posts border-t border-border">
            <YearGroups
              groups={older}
              continuesYear={shown.at(-1)?.year === older[0]?.year}
            />
          </div>
        </details>
      )}
    </div>
  );
}
