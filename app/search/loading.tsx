import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function SearchLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Search Header Skeleton */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 py-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-5 w-64" />
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="space-y-12">
          {/* Courses Section Skeleton */}
          <section>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="mt-1 h-4 w-40" />
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-5">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-full" />
                    <Skeleton className="mt-1 h-4 w-2/3" />
                    <div className="mt-4 flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Videos Section Skeleton */}
          <section>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="mt-1 h-4 w-40" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-5 w-2/3" />
                      <div className="mt-1.5 flex gap-3">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3.5 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-12 shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
