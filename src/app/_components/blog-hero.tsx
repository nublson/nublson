import Hero from "@/sections/hero";
import { getPageData, withThumbnailBlur } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";

export async function BlogHero() {
  const page = await getPageData(process.env.NOTION_PAGE_BLOG_ID!);
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
