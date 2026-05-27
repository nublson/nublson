import ContentSection from "@/sections/content";
import { getPageBlocks } from "@/services/notion";

export async function GearsBody() {
  const pageContent = await getPageBlocks(process.env.NOTION_PAGE_GEARS_ID!);
  return <ContentSection blocks={pageContent} />;
}
