import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { PostsSectionSkeleton } from "@/components/skeletons/posts-section-skeleton";

export default function BlogLoading() {
  return (
    <>
      <HeroSkeleton size="small" showThumbnail />
      <PostsSectionSkeleton rowCount={6} />
    </>
  );
}
