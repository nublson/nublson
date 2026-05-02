import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface PostsSectionSkeletonProps {
  rowCount?: number;
  showViewAll?: boolean;
}

export function PostsSectionSkeleton({
  rowCount = 4,
  showViewAll = false,
}: PostsSectionSkeletonProps) {
  return (
    <section className="flex w-full flex-col items-center justify-start gap-8 pb-5">
      <div className="flex w-full flex-col items-start justify-start gap-2">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-8 w-36 rounded-lg" />
          {showViewAll && <Skeleton className="h-4 w-16 rounded-md" />}
        </div>
        <Separator />
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-3">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex w-full flex-col gap-2.5">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Skeleton className="h-4 w-20 shrink-0 rounded-md" />
                <Skeleton className="h-5 min-w-0 flex-1 rounded-md" />
              </div>
              <Skeleton className="hidden h-4 w-4 shrink-0 rounded md:block" />
            </div>
            {i < rowCount - 1 && <Separator />}
          </div>
        ))}
      </div>
    </section>
  );
}
