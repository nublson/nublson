import Link from "next/link";
import { Typography } from "./typography";
import { Separator } from "./ui/separator";

interface SectionHeaderProps {
  title: string;
  href?: string;
  /** When set, labels this region for assistive tech (pairs with `section` `aria-labelledby`). */
  titleId?: string;
}

export function SectionHeader({ title, href, titleId }: SectionHeaderProps) {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-2">
      <div className="w-full flex items-center justify-between">
        <Typography component="h2" variant="h3" id={titleId}>
          {title}
        </Typography>
        {href && (
          <Typography
            size="small"
            className="text-muted-foreground hover:text-accent-foreground transition-colors duration-300 underline-offset-4 hover:underline"
          >
            <Link aria-label={`View all ${title}`} href={href}>
              View all
            </Link>
          </Typography>
        )}
      </div>
      <Separator />
    </div>
  );
}
