import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { getDatabasePages, getDatabasePageBySlug } from "@/services/notion";
import { formatPostMetadata } from "@/utils/formatter";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogPostBody } from "./_components/blog-post-body";
import { BlogPostHero } from "./_components/blog-post-hero";

const SLUG_PAGE_LIMIT = 100;

export async function generateStaticParams() {
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;
  const pages = await getDatabasePages(databaseId, "Blog", SLUG_PAGE_LIMIT);
  return formatPostMetadata(pages).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    slug,
  );
  if (!found) {
    return { title: "Post not found" };
  }
  return {
    title: found.metadata.title,
    description: found.metadata.description,
  };
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <Suspense fallback={<HeroSkeleton showThumbnail showTopNav size="small" />}>
        <BlogPostHero params={params} />
      </Suspense>
      <Suspense fallback={<ContentSectionSkeleton />}>
        <BlogPostBody params={params} />
      </Suspense>
    </>
  );
}
