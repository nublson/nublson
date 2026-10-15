import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import Image from "next/image";

/** 20px tile: Notion page icon, else a crop of the cover, else the first letter. */
export function ProjectIcon({
  post,
  className,
}: {
  post: Pick<PostMetadata, "title" | "icon" | "thumbnail">;
  className?: string;
}) {
  if (post.icon?.type === "emoji") {
    return (
      <span aria-hidden className={cn("tile text-xs leading-none", className)}>
        {post.icon.value}
      </span>
    );
  }

  const src = post.icon?.type === "image" ? post.icon.src : post.thumbnail;
  if (src) {
    return (
      <span aria-hidden className={cn("tile", className)}>
        <Image
          src={src}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "tile text-[10px] font-medium text-subtle-foreground",
        className,
      )}
    >
      {post.title.charAt(0).toUpperCase()}
    </span>
  );
}
