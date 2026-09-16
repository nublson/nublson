import Hero from "@/sections/hero";
import type { PageMetadata } from "@/utils/formatter";

export function WorkHero({ metadata }: { metadata: PageMetadata }) {
  return (
    <Hero
      title={metadata.title}
      description={metadata.description}
      size="small"
    />
  );
}
