import { Skeleton } from '@/components/ui/skeleton'

export default function CourseDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Back link skeleton */}
      <Skeleton className="h-4 w-32" />

      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-96" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Section header skeleton */}
      <Skeleton className="h-6 w-32" />

      {/* Sections list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
