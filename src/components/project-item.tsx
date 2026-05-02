import { Typography } from "@/components/typography";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { PostMetadata } from "@/utils/formatter";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

interface ProjectItemProps {
  post: PostMetadata;
}

export function ProjectItem({ post }: ProjectItemProps) {
  return (
    <Item className="flex flex-col items-start justify-start gap-2.5 p-0 w-full">
      <ItemMedia variant="image" className="w-full h-auto">
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={640}
            height={424}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            loading="lazy"
            className="aspect-4/3 h-full w-full object-cover"
          />
        )}
      </ItemMedia>
      <ItemContent className="w-full">
        <ItemTitle className="w-full flex items-center justify-between gap-2">
          <Typography
            component="h3"
            className="max-w-[90%] text-accent-foreground line-clamp-1 break-all"
          >
            {post.title}
          </Typography>

          <SquareArrowOutUpRight className="size-4 text-accent-foreground hidden group-hover/item:block" />
        </ItemTitle>
        <Typography
          size="small"
          className="text-muted-foreground group-hover/item:text-accent-foreground transition-colors duration-300 line-clamp-2 break-all"
        >
          {post.description}
        </Typography>
      </ItemContent>
    </Item>
  );
}
