import { GearsBody } from "@/app/_components/gears-body";
import { GearsCategory } from "@/app/_components/gears-category";
import { GearsHero } from "@/app/_components/gears-hero";
import { ContentSectionSkeleton } from "@/components/skeletons/content-section-skeleton";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { ProjectsSectionSkeleton } from "@/components/skeletons/projects-section-skeleton";
import { metadataFromNotionPageId } from "@/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 10;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromNotionPageId(process.env.NOTION_PAGE_GEARS_ID!, {
    canonical: "/gears",
  });
}

export default function GearsPage() {
  return (
    <section className="article-layout">
      <Suspense fallback={<HeroSkeleton size="small" showThumbnail />}>
        <GearsHero />
      </Suspense>
      <Suspense fallback={<ContentSectionSkeleton />}>
        <GearsBody />
      </Suspense>
      <Suspense
        fallback={
          <ProjectsSectionSkeleton
            cardCount={12}
            gridClassName="grid auto-rows-fr grid-cols-2 gap-5 md:grid-cols-3"
          />
        }
      >
        <GearsCategory />
      </Suspense>
    </section>
  );
}
