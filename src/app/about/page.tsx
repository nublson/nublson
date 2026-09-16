import { AboutContent } from "@/app/_components/about-content";
import { AboutHero } from "@/app/_components/about-hero";
import {
  getPageBlocks,
  getPageData,
  withThumbnailBlur,
} from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_ABOUT_ID!, {
    canonical: "/about",
  });
}

export default async function AboutPage() {
  const pageId = process.env.NOTION_PAGE_ABOUT_ID!;
  const [page, pageBlocks] = await Promise.all([
    getPageData(pageId),
    getPageBlocks(pageId),
  ]);
  const heroMetadata = await withThumbnailBlur(formatPageMetadata(page));

  return (
    <section className="article-layout">
      <AboutHero metadata={heroMetadata} />
      <AboutContent blocks={pageBlocks} />
    </section>
  );
}
