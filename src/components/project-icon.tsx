import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import Image from "next/image";

/**
 * A project's icon in a 16px box: the Notion page icon, else a crop of the
 * cover, else the first letter. No frame around emoji or images: a ring makes
 * the emoji bitmap's sub-pixel drift visible at some zoom levels. Emoji and
 * images share one optical size (14px), because an emoji's ink fills nearly
 * its whole em and a full 16px image reads a size larger. `leading-none` in a
 * centered box keeps the glyph on the text's optical center. Decorative: the
 * title carries the meaning.
 */
export function ProjectIcon({
  post,
  className,
}: {
  post: Pick<PostMetadata, "title" | "icon" | "thumbnail">;
  className?: string;
}) {
  const box = "flex size-4 shrink-0 items-center justify-center";

  if (post.icon?.type === "emoji") {
    return (
      <span aria-hidden className={cn(box, "text-sm leading-none", className)}>
        {post.icon.value}
      </span>
    );
  }

  const src = post.icon?.type === "image" ? post.icon.src : post.thumbnail;
  if (src) {
    return (
      <span aria-hidden className={cn(box, className)}>
        <Image
          src={src}
          alt=""
          width={28}
          height={28}
          unoptimized
          className="size-3.5 rounded-[3px] object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        box,
        "rounded-[4px] bg-card text-[10px] leading-none font-medium text-subtle-foreground",
        className,
      )}
    >
      {post.title.charAt(0).toUpperCase()}
    </span>
  );
}
