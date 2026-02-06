import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-7 w-40" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-16" />
                <Skeleton className="mt-1 h-4 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Progress & Recent Videos */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-1 h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <Skeleton className="mt-2 h-2 w-full" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
              <Skeleton className="mt-1 h-4 w-36" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="mt-1 h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
