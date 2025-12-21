import { Skeleton } from '@/components/ui/skeleton'

export function AttendanceTrackerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Period Selector Skeleton */}
      <Skeleton className="h-9 w-64" />

      {/* Rate Card Skeleton */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-3 w-48" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <Skeleton className="mb-3 h-3 w-20" />
            <Skeleton className="mb-2 h-9 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Employee Lists Skeleton */}
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-6"
          >
            <Skeleton className="mb-4 h-5 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
