import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutContent } from "../_components/about-content";
import { AboutHero } from "../_components/about-hero";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData(process.env.NOTION_PAGE_ABOUT_ID!);
  const meta = formatPageMetadata(page);
  const ogImage = meta.thumbnail ?? "/logo.svg";
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@nublson",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  };
}

export default function AboutPage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton size="small" showThumbnail />}>
        <AboutHero />
      </Suspense>
      <Suspense fallback={<ContentSectionSkeleton />}>
        <AboutContent />
      </Suspense>
    </>
  );
}
