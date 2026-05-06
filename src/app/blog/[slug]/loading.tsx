import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";

export default function BlogPostLoading() {
  return (
    <>
      <HeroSkeleton showThumbnail showTopNav size="small" />
      <ContentSectionSkeleton />
    </>
  );
}
