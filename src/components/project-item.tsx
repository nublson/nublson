import { Typography } from "@/components/typography";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { PostMetadata } from "@/utils/formatter";
import { SquareArrowOutUpRight } from "lucide-react";
import { CoverImage } from "./cover-image";

interface ProjectItemProps {
  post: PostMetadata;
}

export function ProjectItem({ post }: ProjectItemProps) {
  return (
    <Item className="flex flex-col items-start justify-start gap-2.5 p-0 w-full">
      <ItemMedia variant="image" className="w-full h-auto">
        {post.thumbnail && (
          <CoverImage
            src={post.thumbnail}
            alt=""
            blurDataURL={post.blurDataURL}
            width={640}
            height={480}
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
            className="max-w-[85%] text-accent-foreground line-clamp-1 break-words"
          >
            {post.title}
          </Typography>

          <SquareArrowOutUpRight className="size-4 shrink-0 -translate-x-0.5 translate-y-0.5 text-accent-foreground opacity-0 transition-[opacity,translate] duration-150 ease-(--ease-out) group-hover/item:translate-0 group-hover/item:opacity-100" />
        </ItemTitle>
        <Typography
          size="small"
          className="text-muted-foreground group-hover/item:text-accent-foreground transition-colors duration-300 line-clamp-2 break-words"
        >
          {post.description}
        </Typography>
      </ItemContent>
    </Item>
  );
}
