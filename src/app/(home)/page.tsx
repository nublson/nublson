import { HomeHero } from "@/app/_components/home-hero";
import { HomePosts } from "@/app/_components/home-posts";
import { HomeProjects } from "@/app/_components/home-projects";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_HOME_ID!, {
    absoluteTitle: true,
    canonical: "/",
  });
}

export default async function Home() {
  const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
  const heroMetadata = formatPageMetadata(page);

  return (
    <section className="article-layout">
      <HomeHero metadata={heroMetadata} />
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
    </section>
  );
}
