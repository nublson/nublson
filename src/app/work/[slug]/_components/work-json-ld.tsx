import { DatabasePostJsonLd } from "@/components/database-post-json-ld";
import type { PostMetadata } from "@/utils/formatter";

export function WorkJsonLd({
  slug,
  metadata,
}: {
  slug: string;
  metadata: PostMetadata;
}) {
  return (
    <DatabasePostJsonLd
      slug={slug}
      metadata={metadata}
      schemaType="CreativeWork"
      routePrefix="work"
      titleProperty="name"
      personProperty="creator"
    />
  );
}
