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
        size="icon-sm"
        className="relative text-subtle-foreground"
        disabled
        aria-hidden
      >
        <Sun />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  // Contextual icon swap: both icons stay mounted and cross-fade with scale
  // and blur, so a quick double toggle retargets instead of snapping.
  const icon =
    "absolute left-1/2 top-1/2 size-[15px] -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]";
  const shown = "scale-100 opacity-100 blur-0";
  const hidden = "scale-25 opacity-0 blur-[4px]";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="relative cursor-pointer text-subtle-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={cn(
          icon,
          isDark ? hidden : shown,
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          icon,
          isDark ? shown : hidden,
        )}
        aria-hidden
      />
    </Button>
  );
}
