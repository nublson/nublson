import { Typography } from "@/components/typography";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

export function ProjectItem() {
  return (
    <Item className="w-63.5 flex flex-col items-start justify-start gap-2.5 p-0">
      <ItemMedia variant="image" className="w-full h-47.5">
        <Image
          src={`https://avatar.vercel.sh/post-1`}
          alt="Post 1"
          width={255}
          height={300}
          loading="eager"
          className="w-full h-full object-cover grayscale"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="w-full flex items-center justify-between gap-2">
          <Typography
            component="h4"
            variant="h4"
            className="text-accent-foreground"
          >
            Purl
          </Typography>

          <SquareArrowOutUpRight className="size-4 text-muted-foreground hidden group-hover/item:block" />
        </ItemTitle>
        <Typography
          size="small"
          className="text-muted-foreground line-clamp-2 break-all"
        >
          Modern design inspired by the great outdoors.
        </Typography>
      </ItemContent>
    </Item>
  );
}
