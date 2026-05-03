import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import {
  getAllPublishedSlugsForStaticParams,
  getDatabasePageBySlug,
} from "@/services/notion";
import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkJsonLd } from "./_components/work-json-ld";
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
  const ogImage = found.metadata.thumbnail ?? "/logo.svg";
  return {
    title: found.metadata.title,
    description: found.metadata.description,
    openGraph: {
      title: found.metadata.title,
      description: found.metadata.description,
      type: "website",
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

export default function WorkPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <WorkJsonLd params={params} />
      <Suspense fallback={<HeroSkeleton showThumbnail showTopNav size="small" />}>
        <WorkPostHero params={params} />
      </Suspense>
      <Suspense fallback={<ContentSectionSkeleton />}>
        <WorkPostBody params={params} />
      </Suspense>
    </>
  );
}
