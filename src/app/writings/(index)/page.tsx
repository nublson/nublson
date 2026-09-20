import { BlogHero } from "@/app/_components/blog-hero";
import { BlogPosts } from "@/app/_components/blog-posts";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import { getPageData, withThumbnailBlur } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_BLOG_ID!, {
    canonical: "/writings",
  });
}

export default async function BlogPage() {
  const page = await getPageData(process.env.NOTION_PAGE_BLOG_ID!);
  const heroMetadata = await withThumbnailBlur(formatPageMetadata(page));

  return (
    <section className="article-layout">
      <BlogHero metadata={heroMetadata} />
      <Suspense fallback={<PostsSectionSkeleton rowCount={6} />}>
        <BlogPosts />
      </Suspense>
    </section>
  );
}
