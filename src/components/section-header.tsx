import Link from "next/link";
import { Typography } from "./typography";
import { Separator } from "./ui/separator";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-2">
      <div className="w-full flex items-center justify-between">
        <Typography variant="h3">{title}</Typography>
        {href && (
          <Link
            href={href}
            className="text-muted-foreground hover:text-accent-foreground transition-colors duration-100 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        )}
      </div>
      <Separator />
    </div>
  );
}
