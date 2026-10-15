import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsSectionSkeletonProps {
  rowCount?: number;
  showViewAll?: boolean;
}

export function ProjectsSectionSkeleton({
  rowCount = 3,
  showViewAll = false,
}: ProjectsSectionSkeletonProps) {
  return (
    <section
      aria-hidden
      data-skeleton
      className="flex w-full flex-col gap-3.5"
    >
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-4 w-16 rounded" />
        {showViewAll && <Skeleton className="h-4 w-6 rounded" />}
      </div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="grid grid-cols-[16px_1fr] gap-x-3 py-2">
            <Skeleton className="size-4 rounded-[3px]" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="col-start-2 mt-1.5 h-4 w-[min(100%,320px)] rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
