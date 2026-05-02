import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import {
  getAllPublishedSlugsForStaticParams,
  getDatabasePageBySlug,
} from "@/services/notion";
import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkPostBody } from "./_components/work-post-body";
import { WorkPostHero } from "./_components/work-post-hero";

export const revalidate = 10;

export async function generateStaticParams() {
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;
  return getAllPublishedSlugsForStaticParams(databaseId, "Project");
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
