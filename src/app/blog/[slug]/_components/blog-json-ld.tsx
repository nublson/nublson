import { DatabasePostJsonLd } from "@/components/database-post-json-ld";
import type { PostMetadata } from "@/utils/formatter";

export function BlogJsonLd({
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
      schemaType="BlogPosting"
      routePrefix="blog"
      titleProperty="headline"
      personProperty="author"
      extraData={(meta) => ({
        articleSection: meta.category,
      })}
    />
  );
}
