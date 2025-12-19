import { Skeleton } from '@/components/ui/skeleton'

export function EmployeesPageSkeleton() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        {/* Table Header */}
        <div className="flex items-center gap-4 border-b bg-muted/50 px-4 py-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Avatar + Name */}
            <div className="flex w-64 items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            {/* Department */}
            <Skeleton className="h-5 w-20 rounded-full" />
            {/* Position */}
            <Skeleton className="h-4 w-32" />
            {/* Status */}
            <Skeleton className="h-5 w-16 rounded-full" />
            {/* Hire Date */}
            <Skeleton className="h-4 w-24" />
            {/* Salary */}
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  )
}
