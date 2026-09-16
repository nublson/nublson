import Hero from "@/sections/hero";
import type { PageMetadata } from "@/utils/formatter";

export function BlogHero({ metadata }: { metadata: PageMetadata }) {
  return (
    <Hero
      title={metadata.title}
      description={metadata.description}
      thumbnail={metadata.thumbnail}
      blurDataURL={metadata.blurDataURL}
      size="small"
    />
  );
}
