import { JsonLd } from "@/components/json-ld";
import { SocialLinks } from "@/components/social-links";
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
          <Typography className="text-subtle-foreground">
            {[metadata.role, metadata.location].filter(Boolean).join(" · ")}
          </Typography>
        }
      >
        <SocialLinks />
      </Hero>
    </>
  );
}
