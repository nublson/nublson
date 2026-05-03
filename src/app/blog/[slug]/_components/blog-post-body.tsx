import ContentSection from "@/sections/content";
import { getDatabasePageBySlug, getPageBlocks } from "@/services/notion";
import { notFound } from "next/navigation";

export async function BlogPostBody({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    slug,
  );
  if (!found) notFound();

  const pageBlocks = await getPageBlocks(found.page.id);
  return <ContentSection blocks={pageBlocks} />;
}
