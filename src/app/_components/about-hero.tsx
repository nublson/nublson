import { JsonLd } from "@/components/json-ld";
import social from "@/data/social.json";
import Hero from "@/sections/hero";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";

export async function AboutHero() {
  const page = await getPageData(process.env.NOTION_PAGE_ABOUT_ID!);
  const pageMetadata = formatPageMetadata(page);
  const sameAs = social.media
    .filter((item) => item.url.startsWith("https://"))
    .map((item) => item.url);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: pageMetadata.title,
          url: process.env.BASE_URL,
          jobTitle: pageMetadata.role,
          sameAs,
        }}
      />
      <Hero
        title={pageMetadata.title}
        description={pageMetadata.description}
        thumbnail={pageMetadata.thumbnail}
        size="small"
      />
    </>
  );
}
