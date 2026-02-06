import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        <div className="container flex flex-col items-center justify-center px-4 py-24 text-center md:py-32 lg:py-40">
          <Skeleton className="h-8 w-64 rounded-full" />
          <Skeleton className="mt-8 h-16 w-full max-w-2xl" />
          <Skeleton className="mt-4 h-16 w-full max-w-xl" />
          <Skeleton className="mt-6 h-6 w-full max-w-lg" />
          <Skeleton className="mt-2 h-6 w-full max-w-md" />
          <div className="mt-10 flex gap-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="border-t bg-muted/30 py-20 md:py-28">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="mt-4 h-6 w-64" />
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border bg-background p-8">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="mt-6 h-7 w-48" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section Skeleton */}
      <section className="border-t py-20 md:py-28">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="mt-6 h-10 w-48" />
            <Skeleton className="mt-4 h-6 w-96" />
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border bg-background shadow-md">
                <Skeleton className="aspect-video w-full" />
                <div className="p-5">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-2/3" />
                  <div className="mt-4 flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
