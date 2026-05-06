import ContentSection from "@/sections/content";
import { getPageBlocks } from "@/services/notion";

export async function AboutContent() {
  const pageContent = await getPageBlocks(process.env.NOTION_PAGE_ABOUT_ID!);
  return <ContentSection blocks={pageContent} />;
}
