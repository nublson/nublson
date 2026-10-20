import { Typography } from "@/components/typography";
import ContentSection from "@/sections/content";
import { getPageBlocks } from "@/services/notion";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Notion blocks",
  robots: { index: false, follow: false },
};

/**
 * Development only: every Notion block type, rendered as an article renders
 * them, from the draft "Notion Blocks Playground" page in the content database.
 */
export default async function DevBlocksPage() {
  const pageId = process.env.NOTION_PAGE_PLAYGROUND_ID;
  if (process.env.NODE_ENV === "production" || !pageId) notFound();

  const blocks = await getPageBlocks(pageId);

  return (
    <section className="article-layout">
      <Typography component="h1" variant="h1">
        Notion blocks
      </Typography>
      <ContentSection blocks={blocks} />
    </section>
  );
}
