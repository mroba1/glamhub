import { SkeletonStats, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <SkeletonStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-5 space-y-4">
          <Skeleton className="h-6 w-40" />
          {[1,2,3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-[hsl(0,0%,13%)] bg-[hsl(0,0%,7%)] p-5 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
