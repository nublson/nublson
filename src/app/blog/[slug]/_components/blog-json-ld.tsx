import { DatabasePostJsonLd } from "@/components/database-post-json-ld";

export async function BlogJsonLd({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <DatabasePostJsonLd
      params={params}
      media="Blog"
      schemaType="BlogPosting"
      routePrefix="blog"
      titleProperty="headline"
      personProperty="author"
      extraData={(metadata) => ({
        articleSection: metadata.category,
      })}
    />
  );
}
