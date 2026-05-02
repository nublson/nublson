import assets from "@/assets/blur.json";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CoverImage({ src, alt, className }: CoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1000}
      height={1000}
      className={cn("thumbnail", className)}
      loading="eager"
      placeholder="blur"
      blurDataURL={assets.base64}
    />
  );
}
