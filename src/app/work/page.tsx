import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkBody } from "../_components/work-body";
import { WorkHero } from "../_components/work-hero";
import { WorkProjects } from "../_components/work-projects";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_WORK_ID!);
}

export default function WorkPage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton size="small" />}>
        <WorkHero />
      </Suspense>
      <Suspense
        fallback={
          <ProjectsSectionSkeleton
            cardCount={6}
            gridClassName="grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
          />
        }
      >
        <WorkProjects />
      </Suspense>
      <Suspense fallback={<ContentSectionSkeleton />}>
        <WorkBody />
      </Suspense>
    </>
  );
}
