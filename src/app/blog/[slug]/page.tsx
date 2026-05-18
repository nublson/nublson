import { MorePosts } from "@/app/_components/more-posts";
import { PostReactionsLoader } from "@/app/_components/post-reactions-loader";
import { PostReactionsSkeleton } from "@/components/skeletons/post-reactions-skeleton";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import {
  getAllPublishedSlugsForStaticParams,
  getDatabasePageBySlug,
} from "@/services/notion";
import { buildShareMetadata } from "@/utils/share-metadata";
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
  return buildShareMetadata(
    {
      title: found.metadata.title,
      description: found.metadata.description,
      thumbnail: found.metadata.thumbnail,
    },
    {
      canonical: `/blog/${slug}`,
      openGraphType: "article",
      publishedTime: found.metadata.published_date,
      section: found.metadata.category,
    },
  );
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <BlogJsonLd params={params} />
      <BlogPostHero params={params} />
      <BlogPostBody params={params} />
      <Suspense fallback={<PostsSectionSkeleton rowCount={4} />}>
        <MorePosts params={params} />
      </Suspense>
      <Suspense fallback={<PostReactionsSkeleton />}>
        <PostReactionsLoader params={params} />
      </Suspense>
    </>
  );
}
