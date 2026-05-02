import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import { Suspense } from "react";
import { BlogHero } from "../_components/blog-hero";
import { BlogPosts } from "../_components/blog-posts";

export const revalidate = 10;

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
