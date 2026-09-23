import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type PostReactionsSkeletonProps = ComponentProps<"div"> & {
  /** Adds a pill for the views badge, shown only on blog posts. */
  trackViews?: boolean;
  /** Adds a pill for the speech-mode Persona control, shown only on blog posts. */
  enableAudio?: boolean;
};

/**
 * Mirrors PostReactions' own group layout — [Views?] [Like, Dislike]
 * [Persona?] [Purl, Share] — including the vertical separators between
 * groups, so there's no layout shift once the real content replaces it.
 */
export function PostReactionsSkeleton({
  className,
  children,
  trackViews = false,
  enableAudio = false,
  ...props
}: PostReactionsSkeletonProps) {
  return (
    <div
      className={cn(
        "sticky bottom-10 z-41 mx-auto w-fit rounded-full border border-border bg-background",
        className,
      )}
      {...props}
    >
      {children}
      <div className="flex items-center justify-center gap-2 px-2.5 py-2">
        {trackViews ? (
          <>
            <Skeleton className="h-7 w-16 rounded-full" />
            <Separator orientation="vertical" />
          </>
        ) : null}
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="size-7 rounded-full" />
        <Separator orientation="vertical" />
        {enableAudio ? (
          <>
            <Skeleton className="size-7 rounded-full" />
            <Separator orientation="vertical" />
          </>
        ) : null}
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="size-7 rounded-full" />
      </div>
    </div>
  );
}
