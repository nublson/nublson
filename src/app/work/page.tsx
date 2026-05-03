import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkBody } from "../_components/work-body";
import { WorkHero } from "../_components/work-hero";
import { WorkProjects } from "../_components/work-projects";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData(process.env.NOTION_PAGE_WORK_ID!);
  const meta = formatPageMetadata(page);
  const ogImage = meta.thumbnail ?? "/logo.svg";
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@nublson",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  };
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
