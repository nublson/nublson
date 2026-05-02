import assets from "@/assets/blur.json";
import { HeadingPage } from "@/components/heading-page";
import { Typography } from "@/components/typography";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  description?: string;
  thumbnail?: string;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  size?: "small" | "default";
}

export default function HeroSection({
  title,
  description,
  thumbnail,
  top,
  bottom,
  size = "default",
}: HeroSectionProps) {
  return (
    <section className="pt-31 pb-5 flex flex-col items-start justify-start gap-[60px]">
      <HeadingPage title={title} top={top} bottom={bottom} size={size} />
      {description && (
        <Typography className="text-muted-foreground">{description}</Typography>
      )}

      {thumbnail && (
        <Image
          src={thumbnail}
          alt="Thumbnail"
          width={1000}
          height={1000}
          className="thumbnail"
          loading="eager"
          placeholder="blur"
          blurDataURL={assets.base64}
        />
      )}
    </section>
  );
}
