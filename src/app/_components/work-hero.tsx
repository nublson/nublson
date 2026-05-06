import Hero from "@/sections/hero";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";

export async function WorkHero() {
  const page = await getPageData(process.env.NOTION_PAGE_WORK_ID!);
  const pageMetadata = formatPageMetadata(page);

  return (
    <Hero
      title={pageMetadata.title}
      description={pageMetadata.description}
      size="small"
    />
  );
}
