import { CoverImage } from "@/components/cover-image";
import { HeadingPage } from "@/components/heading-page";
import { Typography } from "@/components/typography";

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
    <section className="w-full pt-21 md:pt-26 lg:pt-31 pb-5 flex flex-col items-start justify-start gap-10 lg:gap-[60px]">
      <HeadingPage title={title} top={top} bottom={bottom} size={size} />
      {description && (
        <Typography className="text-muted-foreground">{description}</Typography>
      )}

      {thumbnail && (
        <CoverImage
          src={thumbnail}
          alt={title}
          priority
          className="aspect-video"
        />
      )}
    </section>
  );
}
