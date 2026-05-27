import Hero from "@/sections/hero";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";

export async function GearsHero() {
  const page = await getPageData(process.env.NOTION_PAGE_GEARS_ID!);
  const pageMetadata = formatPageMetadata(page);

  return (
    <Hero
      title={pageMetadata.title}
      description={pageMetadata.description}
      thumbnail={pageMetadata.thumbnail}
      size="small"
    />
  );
}
