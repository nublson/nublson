import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type PostReactionsSkeletonProps = ComponentProps<"div"> & {
  /** Adds the views count, shown only on blog posts. */
  trackViews?: boolean;
};

/**
 * Mirrors PostReactions' end-of-article row — [views?] … [like] [dislike]
 * [Purl] [share] — so there's no layout shift when the real row replaces it.
 */
export function PostReactionsSkeleton({
  className,
  children,
  trackViews = false,
  ...props
}: PostReactionsSkeletonProps) {
  return (
    <div
      data-skeleton
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {children}
      <div className="flex w-full items-center justify-between gap-3 border-t border-border pt-4">
        {trackViews ? <Skeleton className="h-4 w-16 rounded" /> : <span />}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-7 w-12 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}
