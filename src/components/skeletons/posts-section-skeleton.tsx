import { Skeleton } from "@/components/ui/skeleton";

interface PostsSectionSkeletonProps {
  rowCount?: number;
  showViewAll?: boolean;
  groupByYear?: boolean;
}

export function PostsSectionSkeleton({
  rowCount = 4,
  showViewAll = false,
  groupByYear = false,
}: PostsSectionSkeletonProps) {
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
      <div className="w-full divide-y divide-border border-y border-border">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            {groupByYear && (
              <Skeleton
                className={i === 0 ? "h-4 w-9 rounded" : "h-4 w-9 opacity-0"}
              />
            )}
            <Skeleton className="h-4 flex-1 rounded" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
