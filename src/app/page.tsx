import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeHero } from "./_components/home-hero";
import { HomePosts } from "./_components/home-posts";
import { HomeProjects } from "./_components/home-projects";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_HOME_ID!, {
    absoluteTitle: true,
    canonical: "/",
  });
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton size="default" showBottomRow />}>
        <HomeHero />
      </Suspense>
      <Suspense
        fallback={
          <ProjectsSectionSkeleton
            cardCount={3}
            gridClassName="grid-cols-[repeat(auto-fill,minmax(240px,1fr))]"
            showViewAll
          />
        }
      >
        <HomeProjects />
      </Suspense>
      <Suspense fallback={<PostsSectionSkeleton rowCount={4} showViewAll />}>
        <HomePosts />
      </Suspense>
    </>
  );
}
