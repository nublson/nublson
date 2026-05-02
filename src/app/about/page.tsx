import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { Suspense } from "react";
import { AboutContent } from "../_components/about-content";
import { AboutHero } from "../_components/about-hero";

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
