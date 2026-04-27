"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  label: string;
  path: string;
}

export const NavigationList = ({ items }: { items: NavigationItem[] }) => {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-5">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            className={cn(
              "font-medium text-muted-foreground hover:text-foreground transition-colors",
              pathname === item.path && "text-foreground",
            )}
            href={item.path}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
