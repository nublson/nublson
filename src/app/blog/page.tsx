import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogHero } from "../_components/blog-hero";
import { BlogPosts } from "../_components/blog-posts";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData(process.env.NOTION_PAGE_BLOG_ID!);
  const meta = formatPageMetadata(page);
  const ogImage = meta.thumbnail ?? "/logo.svg";
  return {
    title: meta.title,
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
