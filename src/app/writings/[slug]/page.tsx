import { getMorePosts, MorePosts } from "@/app/_components/more-posts";
import { PostReactionsLoader } from "@/app/_components/post-reactions-loader";
import { PostReactionsSkeleton } from "@/components/skeletons/post-reactions-skeleton";
import {
  getAllPublishedSlugsForStaticParams,
  getDatabasePageBySlug,
  getPageBlocks,
  withThumbnailBlur,
} from "@/services/notion";
import { buildShareMetadata } from "@/utils/share-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      canonical: `/writings/${slug}`,
      // The generated title card, instead of the square app icon.
      fallbackImage: `/writings/${slug}/opengraph-image`,
      openGraphType: "article",
      publishedTime: found.metadata.published_date,
      section: found.metadata.category,
    },
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    slug,
  );
  if (!found) notFound();

  const [pageBlocks, morePosts] = await Promise.all([
    getPageBlocks(found.page.id),
    getMorePosts(found.metadata.title),
  ]);

  return (
    <>
      <BlogJsonLd slug={slug} metadata={found.metadata} />
      <article className="article-layout">
        <BlogPostHero
          metadata={await withThumbnailBlur(found.metadata)}
          slug={slug}
        />
        <BlogPostBody blocks={pageBlocks} />
      </article>
      <Suspense fallback={<PostReactionsSkeleton trackViews />}>
        <PostReactionsLoader params={params} media="Blog" />
      </Suspense>
      <MorePosts posts={morePosts} />
    </>
  );
}
