import { GearsBody } from "@/app/_components/gears-body";
import { GearsCategory } from "@/app/_components/gears-category";
import { GearsHero } from "@/app/_components/gears-hero";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";
import { getPageBlocks, getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_GEARS_ID!, {
    canonical: "/gears",
  });
}

export default async function GearsPage() {
  const pageId = process.env.NOTION_PAGE_GEARS_ID!;
  const [page, pageBlocks] = await Promise.all([
    getPageData(pageId),
    getPageBlocks(pageId),
  ]);
  const heroMetadata = formatPageMetadata(page);

  return (
    <section className="article-layout">
      <GearsHero metadata={heroMetadata} />
      <GearsBody blocks={pageBlocks} />
      <Suspense
        fallback={
          <ProjectsSectionSkeleton rowCount={8} />
        }
      >
        <GearsCategory />
      </Suspense>
    </section>
  );
}
