import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function PostReactionsSkeleton({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "sticky bottom-10 z-41 mx-auto w-fit rounded-full border border-border bg-background",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2 px-2.5 py-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="size-7 rounded-full" />
        ))}
      </div>
    </div>
  );
}
