import { HeadingPage } from "@/components/heading-page";
import { Typography } from "@/components/typography";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  description?: string;
  thumbnail?: string;
  bottom?: React.ReactNode;
}

export default function HeroSection({
  title,
  description,
  thumbnail,
  bottom,
}: HeroSectionProps) {
  return (
    <section className="pt-31 pb-5 flex flex-col items-start justify-start gap-[60px]">
      <HeadingPage title={title} bottom={bottom} />
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
        />
      )}
    </section>
  );
}
