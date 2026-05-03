import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import {
  getAllPublishedSlugsForStaticParams,
  getDatabasePageBySlug,
} from "@/services/notion";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogJsonLd } from "./_components/blog-json-ld";
import { BlogPostBody } from "./_components/blog-post-body";
import { BlogPostHero } from "./_components/blog-post-hero";

export const revalidate = 10;

export async function generateStaticParams() {
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;
  return getAllPublishedSlugsForStaticParams(databaseId, "Blog");
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
  const ogImage = found.metadata.thumbnail ?? "/logo.svg";
  return {
    title: found.metadata.title,
    description: found.metadata.description,
    openGraph: {
      title: found.metadata.title,
      description: found.metadata.description,
      type: "article",
      publishedTime: found.metadata.published_date,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@nublson",
      title: found.metadata.title,
      description: found.metadata.description,
      images: [ogImage],
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <BlogJsonLd params={params} />
      <Suspense
        fallback={<HeroSkeleton showThumbnail showTopNav size="small" />}
      >
        <BlogPostHero params={params} />
      </Suspense>
      <Suspense fallback={<ContentSectionSkeleton />}>
        <BlogPostBody params={params} />
      </Suspense>
    </>
  );
}
