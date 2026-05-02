import { HeadingTop } from "@/components/heading-top";
import ContentSection from "@/sections/content";
import Hero from "@/sections/hero";
import {
  getDatabasePageBySlug,
  getDatabasePages,
  getPageBlocks,
} from "@/services/notion";
import {
  formatBlockWithChildren,
  formatPostDateFull,
  formatPostMetadata,
} from "@/utils/formatter";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";

const SLUG_PAGE_LIMIT = 100;

export async function generateStaticParams() {
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;
  const pages = await getDatabasePages(databaseId, "Project", SLUG_PAGE_LIMIT);
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
    "Project",
    slug,
  );
  if (!found) {
    return { title: "Project not found" };
  }
  return {
    title: found.metadata.title,
    description: found.metadata.description,
  };
}

export default async function WorkPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    slug,
  );
  if (!found) notFound();

  const { metadata } = found;
  const pageBlocks = await getPageBlocks(found.page.id);
  const pageContent = formatBlockWithChildren(pageBlocks);

  const dateLabel = formatPostDateFull(metadata.published_date);

  return (
    <Fragment>
      <Hero
        top={
          <HeadingTop
            title={metadata.title}
            date={dateLabel}
            postsPath="/work"
            postType="Projects"
          />
        }
        title={metadata.title}
        description={metadata.description}
        thumbnail={metadata.thumbnail}
        size="small"
      />
      <ContentSection blocks={pageContent} />
    </Fragment>
  );
}
