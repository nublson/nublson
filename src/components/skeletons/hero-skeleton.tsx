import { Skeleton } from "@/components/ui/skeleton";

interface HeroSkeletonProps {
  size?: "default" | "small";
  showThumbnail?: boolean;
  showBottomRow?: boolean;
  showTopNav?: boolean;
}

export function HeroSkeleton({
  size = "default",
  showThumbnail = false,
  showBottomRow = false,
  showTopNav = false,
}: HeroSkeletonProps) {
  const titleHeight =
    size === "small" ? "h-8 w-[min(100%,420px)]" : "h-11 w-[min(100%,520px)]";

  return (
    <section className="w-full flex flex-col items-start justify-start gap-[60px] pt-31 pb-5">
      <div className="flex w-full flex-col items-start justify-start gap-5">
        {showTopNav && (
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <Skeleton className="h-4 w-[min(80%,380px)]" />
            <Skeleton className="h-4 w-28" />
          </div>
        )}
        <div className="flex w-full flex-col items-start gap-1.5">
          <Skeleton className={`rounded-lg ${titleHeight}`} />
          {showBottomRow && (
            <div className="mt-2 flex w-full items-center justify-between gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-36" />
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-1.5">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-full rounded-md md:max-w-md" />
      </div>
      {showThumbnail && (
        <Skeleton className="aspect-video w-full max-w-4xl rounded-lg" />
      )}
    </section>
  );
}
