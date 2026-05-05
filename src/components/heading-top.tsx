import Link from "next/link";
import { Typography } from "./typography";
import { Separator } from "./ui/separator";

interface HeadingTopProps {
  title: string;
  date: string;
  /** Raw ISO/machine date for `<time>` (e.g. Notion publish date string). */
  dateTime: string;
  postsPath: string;
  postType?: string;
}

export function HeadingTop({
  title,
  date,
  dateTime,
  postsPath,
  postType = "Posts",
}: HeadingTopProps) {
  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
      <div className="flex-1 flex items-center justify-start gap-2.5">
        <Typography
          size="small"
          className="whitespace-nowrap text-muted-foreground hover:text-accent-foreground transition-colors duration-300"
        >
          <Link href={postsPath} aria-label={`View all ${postType}`}>
            All {postType}
          </Link>
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
        <span aria-hidden>🗓️ </span>
        <time dateTime={dateTime}>{date}</time>
      </Typography>
    </div>
  );
}
