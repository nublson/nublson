import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type PostReactionsSkeletonProps = ComponentProps<"div"> & {
  /** Adds a pill for the views badge, shown only on blog posts. */
  trackViews?: boolean;
  /** Adds a pill for the speech-mode Persona control, shown only on blog posts. */
  enableAudio?: boolean;
};

export function PostReactionsSkeleton({
  className,
  children,
  trackViews = false,
  enableAudio = false,
  ...props
}: PostReactionsSkeletonProps) {
  // Like, Dislike, Purl, Share are always present; Views and the audio
  // control are conditional, matching PostReactions' own layout.
  const pillCount = 4 + (trackViews ? 1 : 0) + (enableAudio ? 1 : 0);

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
        {Array.from({ length: pillCount }).map((_, i) => (
          <Skeleton key={i} className="size-7 rounded-full" />
        ))}
      </div>
    </div>
  );
}
