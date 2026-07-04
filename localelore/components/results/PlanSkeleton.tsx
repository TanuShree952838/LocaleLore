import { Skeleton } from "@/components/ui/Skeleton";

export function PlanSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <p className="sr-only" role="status" aria-live="polite">
        Unveiling your cultural odyssey, please wait.
      </p>

      <div className="rounded-2xl border border-border bg-surface p-5 glass md:p-7">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-8 w-64" />
        <Skeleton className="mt-3 h-2 w-full rounded-full" />
        <Skeleton className="mt-4 h-4 w-5/6" />
      </div>

      <Skeleton className="h-11 w-full rounded-xl" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface p-5 glass">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-6 w-40" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
