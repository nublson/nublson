import ContentSection from "@/sections/content";
import { getDatabasePageBySlug, getPageBlocks } from "@/services/notion";
import { formatBlockWithChildren } from "@/utils/formatter";
import { notFound } from "next/navigation";

export async function WorkPostBody({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    slug,
  );
  if (!found) notFound();

  const pageBlocks = await getPageBlocks(found.page.id);
  const pageContent = formatBlockWithChildren(pageBlocks);
  return <ContentSection blocks={pageContent} />;
}
