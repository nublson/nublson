import { Typography } from "@/components/typography";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { formatPostDate, PostMetadata } from "@/utils/formatter";

interface PostItemProps {
  separator?: boolean;
  post: PostMetadata;
}

export function PostItem({ separator = true, post }: PostItemProps) {
  return (
    <Item className="px-0">
      <ItemContent className="gap-2.5">
        <ItemTitle className="font-normal">
          <Typography component="span" className="text-muted-foreground">
            {formatPostDate(post.published_date)}
          </Typography>
          <Typography className="text-accent-foreground line-clamp-1 break-all">
            {post.title}
          </Typography>
        </ItemTitle>
        {separator && <Separator />}
      </ItemContent>
    </Item>
  );
}
