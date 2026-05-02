import { Typography } from "@/components/typography";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatPostDate, PostMetadata } from "@/utils/formatter";
import { SquareArrowOutUpRight } from "lucide-react";

interface PostItemProps {
  separator?: boolean;
  post: PostMetadata;
}

export function PostItem({ separator = true, post }: PostItemProps) {
  return (
    <Item className="p-0">
      <ItemContent className="gap-2.5">
        <ItemTitle className="font-normal w-full">
          <Typography
            component="span"
            className="text-muted-foreground max-w-22.5 line-clamp-1 break-all"
          >
            {formatPostDate(post.published_date)}
          </Typography>
          <Typography className="flex-1 text-accent-foreground line-clamp-1 break-all">
            {post.title}
          </Typography>
          <SquareArrowOutUpRight className="size-4 text-accent-foreground hidden group-hover/item:block" />
        </ItemTitle>
        <Separator
          className={cn(
            "group-hover/item:bg-accent-foreground transition-colors duration-300",
            separator ? "bg-muted" : "bg-transparent",
          )}
        />
      </ItemContent>
    </Item>
  );
}
