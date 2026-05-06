import ContentSection from "@/sections/content";
import { getPageBlocks } from "@/services/notion";

export async function WorkBody() {
  const pageContent = await getPageBlocks(process.env.NOTION_PAGE_WORK_ID!);
  return <ContentSection blocks={pageContent} />;
}
