import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { CourseCard } from '@/components/course-card'
import { VideoSearchItem } from '@/components/video-search-item'
import { SearchBar } from '@/components/search-bar'
import { Search, GraduationCap, PlayCircle, SearchX } from 'lucide-react'

type Level = 'beginner' | 'intermediate' | 'advanced'

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  if (!query) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)]">
        <div className="container px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
              <Search className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="mt-6 text-2xl font-bold">講座・動画を検索</h1>
            <p className="mt-2 text-muted-foreground">
              キーワードを入力して講座や動画を検索できます
            </p>
            <div className="mt-8 w-full max-w-md">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // 講座を検索
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      level,
      thumbnail_url,
      order_index,
      sections (
        videos (
          id,
          duration
        )
      )
    `)
    .ilike('title', `%${query}%`)
    .order('order_index')
    .limit(20)

  // 動画を検索（セクション→講座のリレーションを join）
  const { data: videos } = await supabase
    .from('videos')
    .select(`
      id,
      title,
      duration,
      is_preview,
      order_index,
      section:sections (
        id,
        title,
        course:courses (
          id,
          title
        )
      )
    `)
    .ilike('title', `%${query}%`)
    .order('order_index')
    .limit(20)

  // 講座の動画数・合計時間を計算
  const coursesWithStats = courses?.map((course) => {
    const allVideos = course.sections?.flatMap((s) => s.videos) || []
    const videoCount = allVideos.length
    const totalDuration = allVideos.reduce((sum, v) => sum + (v.duration || 0), 0)
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level as Level,
      thumbnail_url: course.thumbnail_url,
      videoCount,
      totalDuration: Math.floor(totalDuration / 60),
    }
  }) || []

  // 動画検索結果をフラット化（Supabaseのリレーション結果を整形）
  const videoResults = videos?.filter((v) => v.section && !Array.isArray(v.section)).map((v) => {
    const section = v.section as unknown as { id: string; title: string; course: { id: string; title: string } }
    return {
      id: v.id,
      title: v.title,
      duration: v.duration,
      is_preview: v.is_preview,
      order_index: v.order_index,
      section: {
        id: section.id,
        title: section.title,
        course: {
          id: section.course.id,
          title: section.course.title,
        },
      },
    }
  }) || []

  const totalResults = coursesWithStats.length + videoResults.length
  const hasResults = totalResults > 0

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Search Header */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 py-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            検索結果
          </h1>
          <p className="mt-2 text-muted-foreground">
            「<span className="font-medium text-foreground">{query}</span>」の検索結果
            {hasResults && (
              <span className="ml-1">({totalResults}件)</span>
            )}
          </p>
        </div>
      </div>

      <div className="container px-4 py-8">
        {!hasResults ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">
              検索結果が見つかりませんでした
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              「{query}」に一致する講座や動画はありませんでした。別のキーワードで検索してみてください。
            </p>
            <div className="mt-8 w-full max-w-md">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Courses Section */}
            {coursesWithStats.length > 0 && (
              <section>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-md shadow-blue-500/20">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">講座</h2>
                    <p className="text-sm text-muted-foreground">
                      {coursesWithStats.length}件の講座が見つかりました
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {coursesWithStats.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      videoCount={course.videoCount}
                      totalDuration={course.totalDuration}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Videos Section */}
            {videoResults.length > 0 && (
              <section>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/20">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">動画</h2>
                    <p className="text-sm text-muted-foreground">
                      {videoResults.length}件の動画が見つかりました
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {videoResults.map((video) => (
                    <VideoSearchItem key={video.id} video={video} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
