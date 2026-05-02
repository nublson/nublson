import assets from "@/assets/blur.json";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Responsive hint for the image optimizer (matches `.wrapper` max width). */
  sizes?: string;
  priority?: boolean;
}

export function CoverImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 840px",
  priority = false,
}: CoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1000}
      height={1000}
      sizes={sizes}
      priority={priority}
      className={cn("thumbnail", className)}
      placeholder="blur"
      blurDataURL={assets.base64}
    />
  );
}
