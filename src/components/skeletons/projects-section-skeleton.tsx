import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsSectionSkeletonProps {
  rowCount?: number;
  showViewAll?: boolean;
}

const TITLE_WIDTHS = ["w-16", "w-12", "w-20"];

/**
 * Mirrors ProjectsSection box for box, so the real rows replace it without a
 * shift: a 20px label row, a 14px gap, then 60px rows (`py-2` around two 22px
 * text lines) 4px apart, with the icon in a 16px column.
 */
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
      <div className="flex h-5 w-full items-center justify-between">
        <Skeleton className="h-3 w-14 rounded" />
        {showViewAll && <Skeleton className="h-3 w-5 rounded" />}
      </div>
      <div className="-mx-2.5 flex flex-col gap-1">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[16px_1fr] items-center gap-x-3 px-2.5 py-2"
          >
            <Skeleton className="size-4 rounded-[3px]" />
            <div className="flex h-[22px] items-center">
              <Skeleton
                className={`h-3.5 rounded ${TITLE_WIDTHS[i % TITLE_WIDTHS.length]}`}
              />
            </div>
            <div className="col-start-2 flex h-[22px] items-center">
              <Skeleton className="h-3.5 w-[min(100%,420px)] rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
