import { WorkBody } from "@/app/_components/work-body";
import { WorkHero } from "@/app/_components/work-hero";
import { WorkProjects } from "@/app/_components/work-projects";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";
import { getPageBlocks, getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_WORK_ID!, {
    canonical: "/projects",
  });
}

export default async function WorkPage() {
  const pageId = process.env.NOTION_PAGE_WORK_ID!;
  const [page, pageBlocks] = await Promise.all([
    getPageData(pageId),
    getPageBlocks(pageId),
  ]);
  const heroMetadata = formatPageMetadata(page);

  return (
    <section className="article-layout">
      <WorkHero metadata={heroMetadata} />
      <Suspense
        fallback={
          <ProjectsSectionSkeleton rowCount={6} />
        }
      >
        <WorkProjects />
      </Suspense>
      <WorkBody blocks={pageBlocks} />
    </section>
  );
}
