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
      blurDataURL={assets.base64}
    />
  );
}
