import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function CourseDetailLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container py-8">
          {/* Breadcrumb */}
          <Skeleton className="mb-6 h-5 w-32" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Course Info */}
            <div className="flex-1">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="mt-4 h-10 w-3/4" />
              <Skeleton className="mt-4 h-6 w-full max-w-2xl" />
              <Skeleton className="mt-2 h-6 w-2/3 max-w-xl" />

              {/* Stats */}
              <div className="mt-6 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>

            {/* Action Card */}
            <Card className="w-full shrink-0 lg:w-80">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
                <Skeleton className="mt-6 h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="container py-8">
        <Skeleton className="mb-6 h-7 w-32" />

        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
