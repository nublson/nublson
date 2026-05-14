import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutContent } from "../_components/about-content";
import { AboutHero } from "../_components/about-hero";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_ABOUT_ID!, {
    canonical: "/about",
  });
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
