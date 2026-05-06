import { Skeleton } from "@/components/ui/skeleton";

interface ContentSectionSkeletonProps {
  blocks?: number;
}

export function ContentSectionSkeleton({ blocks = 8 }: ContentSectionSkeletonProps) {
  return (
    <section
      aria-hidden
      className="flex w-full flex-col items-start justify-start space-y-5"
      id="content"
    >
      {Array.from({ length: blocks }).map((_, i) => (
        <BlockLineSkeleton key={i} variant={i % 4} />
      ))}
    </section>
  );
}

function BlockLineSkeleton({ variant }: { variant: number }) {
  if (variant === 0) {
    return <Skeleton className="h-8 w-[min(100%,340px)] rounded-lg" />;
  }
  if (variant === 1) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-5 w-full max-w-none rounded-md" />
        <Skeleton className="h-5 w-full max-w-2xl rounded-md" />
        <Skeleton className="h-5 w-[72%] max-w-xl rounded-md" />
      </div>
    );
  }
  return <Skeleton className="h-4 w-[min(100%,280px)] rounded-md" />;
}
