import { Typography } from "@/components/typography";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";

interface PostItemProps {
  separator?: boolean;
}

export function PostItem({ separator = true }: PostItemProps) {
  return (
    <Item className="px-0">
      <ItemContent className="gap-2.5">
        <ItemTitle className="font-normal">
          <Typography component="span" className="text-muted-foreground">
            Dec 2025
          </Typography>
          <Typography className="text-accent-foreground line-clamp-1 break-all">
            How I Built My Framer Templates
          </Typography>
        </ItemTitle>
        {separator && <Separator />}
      </ItemContent>
    </Item>
  );
}
