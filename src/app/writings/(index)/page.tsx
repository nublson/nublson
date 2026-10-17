import { BlogBody } from "@/app/_components/blog-body";
import { BlogHero } from "@/app/_components/blog-hero";
import { BlogPosts, getBlogPosts } from "@/app/_components/blog-posts";
import { getPageBlocks, getPageData } from "@/services/notion";
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
  const pageId = process.env.NOTION_PAGE_BLOG_ID!;
  const [page, pageBlocks, posts] = await Promise.all([
    getPageData(pageId),
    getPageBlocks(pageId),
    getBlogPosts(),
  ]);
  const heroMetadata = formatPageMetadata(page);

  return (
    <section className="article-layout">
      <BlogHero metadata={heroMetadata} />
      <BlogPosts posts={posts} />
      <BlogBody blocks={pageBlocks} />
    </section>
  );
}
