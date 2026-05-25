import { PostReactionsLoader } from "@/app/_components/post-reactions-loader";
import { NavigationProjects } from "@/components/navigation-projects";
import { NavigationProjectsSkeleton } from "@/components/skeletons/navigation-projects-skeleton";
import { PostReactionsSkeleton } from "@/components/skeletons/post-reactions-skeleton";
import {
  getAllPublishedSlugsForStaticParams,
  getDatabasePageBySlug,
} from "@/services/notion";
import { buildShareMetadata } from "@/utils/share-metadata";
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
  return buildShareMetadata(
    {
      title: found.metadata.title,
      description: found.metadata.description,
      thumbnail: found.metadata.thumbnail,
    },
    {
      canonical: `/work/${slug}`,
      openGraphType: "article",
      publishedTime: found.metadata.published_date,
    },
  );
}

export default function WorkPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <WorkJsonLd params={params} />
      <article className="article-layout">
        <WorkPostHero params={params} />
        <WorkPostBody params={params} />
      </article>
      <Suspense fallback={<NavigationProjectsSkeleton />}>
        <NavigationProjects params={params} />
      </Suspense>
      <Suspense fallback={<PostReactionsSkeleton />}>
        <PostReactionsLoader params={params} media="Project" />
      </Suspense>
    </>
  );
}
