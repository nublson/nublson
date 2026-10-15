import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import { ArrowUpRight } from "lucide-react";
import { ProjectIcon } from "./project-icon";

interface ProjectItemProps {
  post: PostMetadata;
  /** One line with the full text in a tooltip (project rows). */
  clampDescription?: boolean;
  /** Marks a row that opens another site. */
  external?: boolean;
}

export function ProjectItem({
  post,
  clampDescription = false,
  external = false,
}: ProjectItemProps) {
  return (
    <span className="group/row grid grid-cols-[16px_1fr] items-center gap-x-3 rounded-lg px-2.5 py-2 transition-colors duration-150 ease-(--ease-out) hover:bg-muted">
      <ProjectIcon post={post} />
      <span className="flex min-w-0 items-center gap-1 font-medium text-foreground">
        {post.title}
        {external && (
          <ArrowUpRight
            aria-hidden
            strokeWidth={1.5}
            className="size-3.5 shrink-0 text-subtle-foreground transition-colors duration-150 ease-(--ease-out) group-hover/row:text-foreground"
          />
        )}
      </span>
      <span
        title={clampDescription ? post.description : undefined}
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
