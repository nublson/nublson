import ContentSection from "@/sections/content";
import { getPageBlocks } from "@/services/notion";
import { formatBlockWithChildren } from "@/utils/formatter";

export async function WorkBody() {
  const pageBlocks = await getPageBlocks(process.env.NOTION_PAGE_WORK_ID!);
  const pageContent = formatBlockWithChildren(pageBlocks);
  return <ContentSection blocks={pageContent} />;
}
