import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProjectsSectionSkeletonProps {
  cardCount?: number;
  gridClassName: string;
  showViewAll?: boolean;
}

export function ProjectsSectionSkeleton({
  cardCount = 3,
  gridClassName,
  showViewAll = false,
}: ProjectsSectionSkeletonProps) {
  return (
    <section className="flex w-full flex-col items-center justify-start gap-8 pb-5">
      <div className="flex w-full flex-col items-start justify-start gap-2">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-8 w-40 rounded-lg" />
          {showViewAll && <Skeleton className="h-4 w-16 rounded-md" />}
        </div>
        <Separator />
      </div>

      <div
        className={cn(
          "grid w-full auto-rows-fr justify-center gap-5",
          gridClassName,
        )}
      >
        {Array.from({ length: cardCount }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-2.5">
      <Skeleton className="aspect-4/3 w-full rounded-lg" />
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-5 w-4/5 rounded-md" />
        <Skeleton className="h-4 w-full max-w-[240px] rounded-md" />
      </div>
    </div>
  );
}
