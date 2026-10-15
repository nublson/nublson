import { BlogHero } from "@/app/_components/blog-hero";
import { BlogPosts, getBlogPosts } from "@/app/_components/blog-posts";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_BLOG_ID!, {
    canonical: "/writings",
  });
}

export default async function BlogPage() {
  const [page, posts] = await Promise.all([
    getPageData(process.env.NOTION_PAGE_BLOG_ID!),
    getBlogPosts(),
  ]);
  const heroMetadata = formatPageMetadata(page);

  return (
    <section className="article-layout">
      <BlogHero metadata={heroMetadata} />
      <BlogPosts posts={posts} />
    </section>
  );
}
