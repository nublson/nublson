import { HomeHero } from "@/app/_components/home-hero";
import { HomePosts } from "@/app/_components/home-posts";
import { getHomeProjects, HomeProjects } from "@/app/_components/home-projects";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
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
  // Projects are awaited with the page: their count changes, so no skeleton
  // could match it. The writing list (always 4) keeps its exact skeleton.
  const [page, projects] = await Promise.all([
    getPageData(process.env.NOTION_PAGE_HOME_ID!),
    getHomeProjects(),
  ]);
  const heroMetadata = formatPageMetadata(page);

  return (
    <section className="article-layout">
      <HomeHero metadata={heroMetadata} />
      <HomeProjects posts={projects} />
      <Suspense fallback={<PostsSectionSkeleton rowCount={4} showViewAll />}>
        <HomePosts />
      </Suspense>
    </section>
  );
}
