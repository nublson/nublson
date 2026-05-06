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

export const NavigationList = ({ items, className }: NavigationListProps) => {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-2.5 md:gap-5">
      {items.map((item) => (
        <Typography
          size="small"
          component="li"
          key={item.label}
          className={cn(
            "link font-medium",
            pathname === item.path && "font-semibold! text-accent-foreground!",
            className,
          )}
        >
          <Link
            href={item.path}
            aria-current={pathname === item.path ? "page" : undefined}
          >
            {item.label}
          </Link>
        </Typography>
      ))}
    </ul>
  );
};
