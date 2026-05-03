import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeHero } from "./_components/home-hero";
import { HomePosts } from "./_components/home-posts";
import { HomeProjects } from "./_components/home-projects";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
  const meta = formatPageMetadata(page);
  const ogImage = meta.thumbnail ?? "/logo.svg";
  return {
    title: { absolute: meta.title },
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
