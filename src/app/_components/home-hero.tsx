import { JsonLd } from "@/components/json-ld";
import { Typography } from "@/components/typography";
import social from "@/data/social.json";
import Hero from "@/sections/hero";
import type { PageMetadata } from "@/utils/formatter";

export function HomeHero({ metadata }: { metadata: PageMetadata }) {
  const sameAs = social.media
    .filter((item) => item.url.startsWith("https://"))
    .map((item) => item.url);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: metadata.title,
          url: process.env.BASE_URL,
          jobTitle: metadata.role,
          sameAs,
        }}
      />
      <Hero
        title={metadata.title}
        description={metadata.description}
        bottom={
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <Typography className="line-clamp-1 break-words font-bold text-muted-foreground">
              {metadata.role}
            </Typography>
            <Typography className="line-clamp-1 break-words font-bold text-muted-foreground">
              <span aria-hidden="true">📍</span> {metadata.location}
            </Typography>
          </div>
        }
      />
    </>
  );
}
