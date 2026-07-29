"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typography } from "./typography";

interface NavigationItem {
  label: string;
  path: string;
}

interface NavigationListProps {
  items: NavigationItem[];
  className?: string;
}

function isDocumentPath(path: string): boolean {
  return /\.[a-z0-9]+$/i.test(path);
}

export const NavigationList = ({ items, className }: NavigationListProps) => {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-2.5 md:gap-5">
      {items.map((item) => {
        const isActive = pathname === item.path;
        const content = isDocumentPath(item.path) ? (
          <a href={item.path} aria-current={isActive ? "page" : undefined}>
            {item.label}
          </a>
        ) : (
          <Link
            href={item.path}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );

        return (
          <Typography
            size="small"
            component="li"
            key={item.label}
            className={cn(
              "link font-medium",
              isActive && "font-semibold! text-accent-foreground!",
              className,
            )}
          >
            {content}
          </Typography>
        );
      })}
    </ul>
  );
};
