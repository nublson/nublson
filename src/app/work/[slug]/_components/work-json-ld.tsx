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

  const creator = {
    "@type": "Person",
    name: metadata.author,
    url: process.env.BASE_URL,
  };

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: metadata.title,
        description: metadata.description,
        image: metadata.thumbnail,
        url: `${process.env.BASE_URL}/work/${slug}`,
        creator: creator,
        publisher: creator,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${process.env.BASE_URL}/work/${slug}`,
        },
      }}
    />
  );
}
