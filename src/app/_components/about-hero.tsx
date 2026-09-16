import { JsonLd } from "@/components/json-ld";
import social from "@/data/social.json";
import Hero from "@/sections/hero";
import type { PageMetadata } from "@/utils/formatter";

export function AboutHero({ metadata }: { metadata: PageMetadata }) {
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
        thumbnail={metadata.thumbnail}
        blurDataURL={metadata.blurDataURL}
        size="small"
      />
    </>
  );
}
