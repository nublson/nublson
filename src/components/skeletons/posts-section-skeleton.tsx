import { Skeleton } from "@/components/ui/skeleton";

interface PostsSectionSkeletonProps {
  rowCount?: number;
  showViewAll?: boolean;
}

const TITLE_WIDTHS = ["w-[62%]", "w-[78%]", "w-[48%]", "w-[66%]"];

/**
 * Mirrors a short PostList inside SectionWrapper box for box, so the real
 * list replaces it without a shift: a 20px label row, a 14px gap, then rows
 * of a 22px text line in `py-2.5` between 1px hairlines (padding, not a fixed
 * height, because border-box would swallow each hairline).
 */
export function PostsSectionSkeleton({
  rowCount = 4,
  showViewAll = false,
}: PostsSectionSkeletonProps) {
  return (
    <section
      aria-hidden
      data-skeleton
      className="flex w-full flex-col gap-3.5"
    >
      <div className="flex h-5 w-full items-center justify-between">
        <Skeleton className="h-3 w-12 rounded" />
        {showViewAll && <Skeleton className="h-3 w-5 rounded" />}
      </div>
      <div className="w-full divide-y divide-border border-y border-border">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4 py-2.5">
            <div className="flex h-[22px] min-w-0 flex-1 items-center">
              <Skeleton
                className={`h-3.5 rounded ${TITLE_WIDTHS[i % TITLE_WIDTHS.length]}`}
              />
            </div>
            <div className="flex h-[22px] items-center">
              <Skeleton className="h-3.5 w-10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
