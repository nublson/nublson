import { Typography } from "@/components/typography";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  role?: string;
  location?: string;
  description?: string;
  thumbnail?: {
    src: string;
    alt: string;
  };
}

export default function HeroSection({
  title,
  role,
  location,
  description,
  thumbnail,
}: HeroSectionProps) {
  return (
    <section className="pt-31 pb-5 flex flex-col items-start justify-start gap-[60px]">
      <div className=" w-full flex flex-col items-start justify-start gap-[6px]">
        <Typography variant="h1">{title}</Typography>
        {role && (
          <div className="w-full flex items-center justify-between">
            <Typography className="font-bold text-muted-foreground">
              {role}
            </Typography>
            {location && (
              <Typography className="font-bold text-muted-foreground">
                📍 {location}
              </Typography>
            )}
          </div>
        )}
      </div>
      {description && (
        <Typography className="text-muted-foreground">{description}</Typography>
      )}

      {thumbnail && (
        <Image
          src={thumbnail.src}
          alt={thumbnail.alt}
          width={1000}
          height={1000}
          className="w-full h-[480px] object-cover aspect-video rounded-lg"
        />
      )}
    </section>
  );
}
