import { AboutContent } from "@/app/_components/about-content";
import { AboutHero } from "@/app/_components/about-hero";
import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { getPageData, withThumbnailBlur } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_ABOUT_ID!, {
    canonical: "/about",
  });
}

export default async function AboutPage() {
  const page = await getPageData(process.env.NOTION_PAGE_ABOUT_ID!);
  const heroMetadata = await withThumbnailBlur(formatPageMetadata(page));

  return (
    <section className="article-layout">
      <AboutHero metadata={heroMetadata} />
      <Suspense fallback={<ContentSectionSkeleton />}>
        <AboutContent />
      </Suspense>
    </section>
  );
}
