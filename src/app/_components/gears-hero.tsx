import Hero from "@/sections/hero";
import type { PageMetadata } from "@/utils/formatter";

export function GearsHero({ metadata }: { metadata: PageMetadata }) {
  return (
    <Hero
      title={metadata.title}
      description={metadata.description}
      descriptionRichText={metadata.descriptionRichText}
    />
  );
}
