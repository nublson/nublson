import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";

interface PageSkeletonProps {
  heroSize?: "default" | "small";
  contentBlocks?: number;
}

/** Full-page stub for route `loading.tsx` (navigation transitions). */
export function PageSkeleton({
  heroSize = "small",
  contentBlocks = 6,
}: PageSkeletonProps) {
  return (
    <>
      <HeroSkeleton size={heroSize} showThumbnail />
      <ContentSectionSkeleton blocks={contentBlocks} />
    </>
  );
}
