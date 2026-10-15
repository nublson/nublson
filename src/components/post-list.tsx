import { cn } from "@/lib/utils";
import {
  formatDateTimeIso,
  formatPostDateCompact,
  formatPostDayMonth,
  groupPostsByYear,
  type PostMetadata,
} from "@/utils/formatter";
import Link from "next/link";

interface PostListProps {
  posts: PostMetadata[];
  /** Archive layout: a year column, `dd/mm` dates. Short lists leave it off. */
  groupByYear?: boolean;
  /** For tests; defaults to this year. */
  currentYear?: number;
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
            className="group/row flex items-baseline justify-between gap-4 py-2.5"
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

export function PostList({
  posts,
  groupByYear = false,
  currentYear,
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

  return (
    <div className="w-full border-y border-border">
      {groupPostsByYear(posts).map((group, index) => (
        <div
          key={group.year || "undated"}
          className={cn(
            "grid grid-cols-[52px_1fr] md:grid-cols-[64px_1fr]",
            index > 0 && "border-t border-border",
          )}
        >
          <span className="py-2.5 text-subtle-foreground tabular-nums">
            {group.year || "—"}
          </span>
          <PostRows posts={group.posts} formatDate={formatPostDayMonth} />
        </div>
      ))}
    </div>
  );
}
