"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <ul className="flex flex-wrap items-center gap-4">
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
          <li
            key={item.label}
            className={cn(
              "text-sm text-subtle-foreground transition-colors duration-150 ease-(--ease-out) hover:text-foreground",
              isActive && "text-foreground",
              className,
            )}
          >
            {content}
          </li>
        );
      })}
    </ul>
  );
};
