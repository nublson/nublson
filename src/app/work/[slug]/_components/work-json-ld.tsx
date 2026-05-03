import { JsonLd } from "@/components/json-ld";
import { getDatabasePageBySlug } from "@/services/notion";

export async function WorkJsonLd({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    slug,
  );
  if (!found) return null;

  const { metadata } = found;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: metadata.title,
        description: metadata.description,
        image: metadata.thumbnail,
        url: `${process.env.BASE_URL}/work/${slug}`,
        creator: {
          "@type": "Person",
          name: "Nubelson Fernandes",
          url: process.env.BASE_URL,
        },
      }}
    />
  );
}
