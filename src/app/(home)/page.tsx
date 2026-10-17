import { HomeHero } from "@/app/_components/home-hero";
import { getHomePosts, HomePosts } from "@/app/_components/home-posts";
import { getHomeProjects, HomeProjects } from "@/app/_components/home-projects";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_HOME_ID!, {
    absoluteTitle: true,
    canonical: "/",
  });
}

export default async function Home() {
  const [page, projects, posts] = await Promise.all([
    getPageData(process.env.NOTION_PAGE_HOME_ID!),
    getHomeProjects(),
    getHomePosts(),
  ]);
  const heroMetadata = formatPageMetadata(page);

  return (
    <section className="article-layout">
      <HomeHero metadata={heroMetadata} />
      <HomeProjects posts={projects} />
      <HomePosts posts={posts} />
    </section>
  );
}
