import { Typography, typographyVariants } from "@/components/typography";
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
        <ItemTitle className="font-normal w-full flex items-center justify-between gap-2">
          <div className="flex items-baseline justify-start gap-2 md:max-w-[95%]">
            <time
              dateTime={post.published_date}
              className={typographyVariants({
                size: "small",
                className: "text-muted-foreground w-20 line-clamp-1 break-all",
              })}
            >
              {formatPostDate(post.published_date)}
            </time>
            <Typography
              component="h3"
              className="flex-1 text-accent-foreground line-clamp-2 break-words"
            >
              {post.title}
            </Typography>
          </div>
          <SquareArrowOutUpRight className="size-4 text-accent-foreground hidden md:group-hover/item:block" />
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
