"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:block"
        disabled
        aria-hidden
      >
        <Sun />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const icon =
    "absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-all";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative hidden lg:block cursor-pointer"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={cn(
          icon,
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          icon,
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
        )}
        aria-hidden
      />
    </Button>
  );
}
