import { DatabasePostJsonLd } from "@/components/database-post-json-ld";

export async function WorkJsonLd({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <DatabasePostJsonLd
      params={params}
      media="Project"
      schemaType="CreativeWork"
      routePrefix="work"
      titleProperty="name"
      personProperty="creator"
    />
  );
}
