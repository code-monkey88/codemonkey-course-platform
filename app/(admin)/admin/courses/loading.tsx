import { Skeleton } from '@/components/ui/skeleton'

export default function CoursesLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          {/* Table header */}
          <div className="flex items-center gap-4 border-b pb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Table rows */}
          <div className="space-y-4 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
