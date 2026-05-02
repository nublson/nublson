import { Typography } from "@/components/typography";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { PostMetadata } from "@/utils/formatter";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

interface ProjectItemProps {
  size?: "sm" | "lg";
  post: PostMetadata;
}

export function ProjectItem({ size = "lg", post }: ProjectItemProps) {
  return (
    <Item
      className={cn(
        "flex flex-col items-start justify-start gap-2.5 p-0",
        size === "sm" ? "w-63" : "w-97.5",
      )}
    >
      <ItemMedia
        variant="image"
        className={cn("w-full", size === "sm" ? "h-47.5" : "h-73")}
      >
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={255}
            height={300}
            loading="eager"
            className="w-full h-full object-cover"
          />
        )}
      </ItemMedia>
      <ItemContent className="w-full">
        <ItemTitle className="w-full flex items-center justify-between gap-2">
          <Typography
            component="h4"
            variant="h4"
            className="max-w-[90%] text-accent-foreground line-clamp-1 break-all"
          >
            {post.title}
          </Typography>

          <SquareArrowOutUpRight className="size-4 text-accent-foreground hidden group-hover/item:block" />
        </ItemTitle>
        <Typography
          size="small"
          className="text-muted-foreground line-clamp-2 break-all"
        >
          {post.description}
        </Typography>
      </ItemContent>
    </Item>
  );
}
