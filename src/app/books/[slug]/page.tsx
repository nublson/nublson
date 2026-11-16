import { BlogPostBody } from "@/app/writings/[slug]/_components/blog-post-body";
import {
  getAllPublishedSlugsForStaticParams,
  getDatabasePageBySlug,
  getPageBlocks,
  withThumbnailBlur,
} from "@/services/notion";
import { buildShareMetadata } from "@/utils/share-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookHero } from "./_components/book-hero";

export const revalidate = 10;

export async function generateStaticParams() {
  return getAllPublishedSlugsForStaticParams(
    process.env.NOTION_DATABASE_BOOKS_ID!,
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_BOOKS_ID!,
    undefined,
    slug,
  );
  if (!found) {
    return { title: "Book not found" };
  }
  return buildShareMetadata(
    {
      title: found.metadata.title,
      description: found.metadata.description,
      thumbnail: found.metadata.thumbnail,
    },
    {
      canonical: `/books/${slug}`,
      openGraphType: "article",
      publishedTime: found.metadata.published_date,
      section: found.metadata.category,
    },
  );
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_BOOKS_ID!,
    undefined,
    slug,
  );
  if (!found) notFound();

  const pageBlocks = await getPageBlocks(found.page.id);

  return (
    <article className="article-layout">
      <BookHero metadata={await withThumbnailBlur(found.metadata)} />
      <BlogPostBody blocks={pageBlocks} />
    </article>
  );
}
