import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { getDatabasePages, getDatabasePageBySlug } from "@/services/notion";
import { formatPostMetadata } from "@/utils/formatter";
import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkPostBody } from "./_components/work-post-body";
import { WorkPostHero } from "./_components/work-post-hero";

export const revalidate = 10;

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

export default function WorkPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <Suspense fallback={<HeroSkeleton showThumbnail showTopNav size="small" />}>
        <WorkPostHero params={params} />
      </Suspense>
      <Suspense fallback={<ContentSectionSkeleton />}>
        <WorkPostBody params={params} />
      </Suspense>
    </>
  );
}
