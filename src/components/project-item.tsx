import type { PostMetadata } from "@/utils/formatter";
import { ProjectIcon } from "./project-icon";

export function ProjectItem({ post }: { post: PostMetadata }) {
  return (
    <span className="group/row grid grid-cols-[20px_1fr] gap-x-3 rounded-lg px-2.5 py-2 transition-colors duration-150 ease-(--ease-out) hover:bg-muted">
      <ProjectIcon post={post} className="mt-px" />
      <span className="min-w-0 font-medium text-foreground">{post.title}</span>
      <span className="col-start-2 min-w-0 line-clamp-1 text-subtle-foreground transition-colors duration-150 ease-(--ease-out) group-hover/row:text-muted-foreground">
        {post.description}
      </span>
    </span>
  );
}
