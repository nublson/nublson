import Hero from "@/sections/hero";
import { getPageData, withThumbnailBlur } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";

export async function GearsHero() {
  const page = await getPageData(process.env.NOTION_PAGE_GEARS_ID!);
  const pageMetadata = await withThumbnailBlur(formatPageMetadata(page));

  return (
    <Hero
      title={pageMetadata.title}
      description={pageMetadata.description}
      thumbnail={pageMetadata.thumbnail}
      blurDataURL={pageMetadata.blurDataURL}
      size="small"
    />
  );
}
