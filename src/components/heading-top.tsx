import Link from "next/link";
import { Typography } from "./typography";
import { Separator } from "./ui/separator";

interface HeadingTopProps {
  title: string;
  date: string;
  postsPath: string;
  postType?: string;
}

export function HeadingTop({
  title,
  date,
  postsPath,
  postType = "Posts",
}: HeadingTopProps) {
  return (
    <div className="w-full flex items-center justify-between gap-2">
      <div className="flex items-center justify-start gap-2.5">
        <Typography
          size="small"
          className="text-muted-foreground hover:text-accent-foreground transition-colors duration-300"
        >
          <Link href={postsPath}>All {postType}</Link>
        </Typography>

        <Separator
          orientation="vertical"
          className="h-5 data-vertical:self-center"
        />
        <Typography
          size="small"
          className="text-muted-foreground line-clamp-1 break-all"
        >
          {title}
        </Typography>
      </div>

      <Typography size="small" className="text-muted-foreground">
        🗓️ {date}
      </Typography>
    </div>
  );
}
