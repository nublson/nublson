import { JsonLd } from "@/components/json-ld";
import { getDatabasePageBySlug } from "@/services/notion";

export async function BlogJsonLd({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    slug,
  );
  if (!found) return null;

  const { metadata } = found;

  const author = {
    "@type": "Person",
    name: metadata.author,
    url: process.env.BASE_URL,
  };

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: metadata.title,
        description: metadata.description,
        image: metadata.thumbnail,
        datePublished: metadata.published_date,
        dateModified: metadata.updated_date,
        articleSection: metadata.category,
        url: `${process.env.BASE_URL}/blog/${slug}`,
        author: author,
        publisher: author,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${process.env.BASE_URL}/blog/${slug}`,
        },
      }}
    />
  );
}
