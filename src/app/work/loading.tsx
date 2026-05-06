import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";

export default function WorkLoading() {
  return (
    <>
      <HeroSkeleton size="small" />
      <ProjectsSectionSkeleton
        cardCount={6}
        gridClassName="grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
      />
      <ContentSectionSkeleton />
    </>
  );
}
