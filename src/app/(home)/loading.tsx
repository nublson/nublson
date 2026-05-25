import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";

export default function HomeLoading() {
  return (
    <>
      <HeroSkeleton size="default" showBottomRow />
      <ProjectsSectionSkeleton
        cardCount={3}
        gridClassName="grid-cols-[repeat(auto-fill,minmax(240px,1fr))]"
        showViewAll
      />
      <PostsSectionSkeleton rowCount={4} showViewAll />
    </>
  );
}
