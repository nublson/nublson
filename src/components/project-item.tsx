import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import { ArrowUpRight } from "lucide-react";
import { CoverImage } from "./cover-image";
import { ProjectIcon } from "./project-icon";

interface ProjectItemProps {
  post: PostMetadata;
  /**
   * One line, with the full text in a tooltip (project rows). Thumbnail rows
   * skip the tooltip: their hover card already shows the whole description.
   */
  clampDescription?: boolean;
  /** Marks a row that opens another site. */
  external?: boolean;
  /**
   * Leads with the cover as a 40px tile beside both lines (gear rows), where
   * a product photo needs more room than a 16px icon gives it.
   */
  thumbnail?: boolean;
}

export function ProjectItem({
  post,
  clampDescription = false,
  external = false,
  thumbnail = false,
}: ProjectItemProps) {
  const showThumbnail = thumbnail && post.thumbnail;

  return (
    <span
      className={cn(
        "group/row grid items-center gap-x-3 rounded-lg px-2.5 py-2 transition-colors duration-150 ease-(--ease-out) hover:bg-muted",
        showThumbnail ? "grid-cols-[40px_1fr]" : "grid-cols-[16px_1fr]",
      )}
    >
      {showThumbnail ? (
        <span aria-hidden className="row-span-2 size-10 self-start">
          <CoverImage
            src={post.thumbnail!}
            alt=""
            width={80}
            height={80}
            sizes="40px"
            blurDataURL={post.blurDataURL}
            className="aspect-square"
          />
        </span>
      ) : (
        <ProjectIcon post={post} />
      )}
      <span className="flex min-w-0 items-center gap-1 font-medium text-foreground">
        {post.title}
        {external && (
          <ArrowUpRight
            aria-hidden
            strokeWidth={1.5}
            className="nudge-out size-3.5 shrink-0 text-subtle-foreground group-hover/row:text-foreground"
          />
        )}
      </span>
      <span
        title={clampDescription && !thumbnail ? post.description : undefined}
        className={cn(
          "col-start-2 min-w-0 text-pretty text-subtle-foreground transition-colors duration-150 ease-(--ease-out) group-hover/row:text-muted-foreground",
          clampDescription && "line-clamp-1",
        )}
      >
        {post.description}
      </span>
    </span>
  );
}
