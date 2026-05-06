import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogHero } from "../_components/blog-hero";
import { BlogPosts } from "../_components/blog-posts";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_BLOG_ID!);
}

export default function BlogPage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton size="small" showThumbnail />}>
        <BlogHero />
      </Suspense>
      <Suspense fallback={<PostsSectionSkeleton rowCount={6} />}>
        <BlogPosts />
      </Suspense>
    </>
  );
}
