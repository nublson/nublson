"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A project's image icon. A muted square holds its place while it loads (the
 * Notion proxy can take a second), then it fades in like `CoverImage`; one
 * that fails shows `fallback` instead. Without scripting it is never hidden
 * (see `.fade-in-image` in globals.css).
 */
export function ProjectIconImage({
  src,
  fallback,
}: {
  src: string;
  fallback: ReactNode;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"loading" | "loaded" | "failed">(
    "loading",
  );

  // A server-rendered image can finish (or fail) before React attaches its handlers.
  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    queueMicrotask(() => setState(img.naturalWidth > 0 ? "loaded" : "failed"));
  }, []);

  if (state === "failed") return fallback;

  return (
    <span
      className={
        state === "loading" ? "rounded-[3px] bg-muted" : "rounded-[3px]"
      }
    >
      <Image
        ref={imgRef}
        src={src}
        alt=""
        width={28}
        height={28}
        unoptimized
        data-loaded={state === "loaded" || undefined}
        onLoad={() => setState("loaded")}
        onError={() => setState("failed")}
        className="fade-in-image block size-3.5 rounded-[3px] object-cover"
      />
    </span>
  );
}
