import assets from "@/assets/blur.json";
import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";

export function CoverImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 840px",
  width = 1000,
  height = 1000,
  blurDataURL,
  ...props
}: ImageProps) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={cn("thumbnail", className)}
      placeholder="blur"
      // Flat 1x1 PNG when the caller has no generated placeholder. Read from
      // the JSON directly rather than from `@/lib/blur-placeholder`, which
      // imports `sharp` and must stay out of the component bundle graph.
      blurDataURL={blurDataURL ?? assets.base64}
    />
  );
}
