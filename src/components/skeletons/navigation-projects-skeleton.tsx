import { Skeleton } from "@/components/ui/skeleton";

export function NavigationProjectsSkeleton() {
  return (
    <div aria-hidden className="w-full flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Skeleton className="size-4 rounded-sm" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="size-4 rounded-sm" />
      </div>
    </div>
  );
}
