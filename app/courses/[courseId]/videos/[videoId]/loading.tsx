import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function VideoPlayerLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Video Player */}
            <Skeleton className="aspect-video w-full rounded-xl" />

            {/* Video Info */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between border-t pt-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                  <Skeleton className="h-10 w-40" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="rounded-xl border bg-card p-4">
              <Skeleton className="mb-4 h-5 w-24" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="mb-2 h-4 w-32" />
                    <div className="space-y-1">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="h-10 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
