"use client";

import assets from "@/assets/blur.json";
import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Next image that fades in (300ms, opacity) over its blur placeholder instead
 * of swapping in a single frame. The placeholder sits on the wrapper so it
 * stays visible while the image is transparent. Without scripting the image
 * is never hidden (see `.fade-in-image` in globals.css). An inset hairline
 * (`--image-outline`) on an ::after layer above the image keeps light or dark
 * images edged against the page.
 */
export function CoverImage({
  src,
  alt,
  className,
  sizes = "(max-width: 672px) 100vw, 640px",
  width = 1000,
  height = 1000,
  blurDataURL,
  onLoad,
  ...props
}: ImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // A server-rendered image can finish loading before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) queueMicrotask(() => setLoaded(true));
  }, []);

  return (
    <span
      className="relative block w-full overflow-hidden rounded-[10px] bg-cover bg-center after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:shadow-[inset_0_0_0_1px_var(--image-outline)]"
      // Flat 1x1 PNG when the caller has no generated placeholder. Read from
      // the JSON directly rather than from `@/lib/blur-placeholder`, which
      // imports `sharp` and must stay out of the component bundle graph.
      style={{ backgroundImage: `url(${blurDataURL ?? assets.base64})` }}
    >
      <Image
        {...props}
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        data-loaded={loaded || undefined}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={cn("thumbnail fade-in-image", className)}
      />
    </span>
  );
}
