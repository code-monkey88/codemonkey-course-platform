import { notFound } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import { LevelBadge } from '@/components/level-badge'
import { CourseProgress } from '@/components/course-progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, BookOpen, Clock, PlayCircle } from 'lucide-react'

// 遅延読み込みコンポーネント
const SectionAccordion = dynamic(
  () => import('@/components/section-accordion').then((mod) => mod.SectionAccordion),
  {
    loading: () => (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  }
)

type Level = 'beginner' | 'intermediate' | 'advanced'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createClient()

  // 講座詳細を取得（セクション・動画を含む）
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      level,
      thumbnail_url,
      sections (
        id,
        title,
        description,
        order_index,
        videos (
          id,
          title,
          duration,
          is_preview,
          order_index
        )
      )
    `)
    .eq('id', courseId)
    .single()

  if (error || !course) {
    notFound()
  }

  // セクションと動画をorder_indexでソート
  type SectionFromDB = (typeof course.sections)[number]
  type VideoFromDB = SectionFromDB['videos'][number]

  type SortedSection = SectionFromDB & {
    videos: VideoFromDB[]
  }

  const sortedSections: SortedSection[] = [...(course.sections || [])]
    .sort((a: SectionFromDB, b: SectionFromDB) => a.order_index - b.order_index)
    .map((section: SectionFromDB) => ({
      ...section,
      videos: [...(section.videos || [])].sort((a: VideoFromDB, b: VideoFromDB) => a.order_index - b.order_index),
    }))

  // 認証済みユーザーの進捗を取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let completedVideoIds = new Set<string>()

  if (user) {
    const videoIds = sortedSections.flatMap((s: SortedSection) => s.videos.map((v: VideoFromDB) => v.id))

    if (videoIds.length > 0) {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('video_id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .in('video_id', videoIds)

      if (progressData) {
        completedVideoIds = new Set(progressData.map((p) => p.video_id))
      }
    }
  }

  // 統計を計算
  const totalVideos = sortedSections.reduce(
    (sum: number, s: SortedSection) => sum + s.videos.length,
    0
  )
  const totalDurationSeconds = sortedSections.reduce(
    (sum: number, s: SortedSection) =>
      sum + s.videos.reduce((vSum: number, v: VideoFromDB) => vSum + (v.duration || 0), 0),
    0
  )
  const totalHours = Math.floor(totalDurationSeconds / 3600)
  const totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60)
  const completedVideos = completedVideoIds.size

  // 最初の未完了動画を見つける
  let firstIncompleteVideo: { sectionId: string; videoId: string } | null = null
  for (const section of sortedSections) {
    for (const video of section.videos) {
      if (!completedVideoIds.has(video.id)) {
        firstIncompleteVideo = { sectionId: section.id, videoId: video.id }
        break
      }
    }
    if (firstIncompleteVideo) break
  }

  // 最初の動画を見つける（開始用）
  const firstVideo =
    sortedSections[0]?.videos[0] || null

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              講座一覧に戻る
            </Link>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <LevelBadge level={course.level as Level} />
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                {course.title}
              </h1>

              {course.description && (
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                  {course.description}
                </p>
              )}

              {/* Stats */}
              <div className="mt-6 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <PlayCircle className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {totalVideos}
                    </span>{' '}
                    本の動画
                  </span>
                </div>

                {totalDurationSeconds > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                      <Clock className="h-4 w-4 text-violet-500" />
                    </div>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {totalHours > 0 ? `${totalHours}時間` : ''}
                        {totalMinutes}分
                      </span>
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {sortedSections.length}
                    </span>{' '}
                    セクション
                  </span>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <Card className="w-full shrink-0 lg:w-80">
              <CardContent className="p-6">
                {user && totalVideos > 0 && (
                  <div className="mb-6">
                    <CourseProgress
                      completed={completedVideos}
                      total={totalVideos}
                      size="lg"
                    />
                  </div>
                )}

                {firstVideo ? (
                  <Button asChild className="w-full gap-2" size="lg">
                    <Link
                      href={`/courses/${courseId}/videos/${
                        firstIncompleteVideo?.videoId || firstVideo.id
                      }`}
                    >
                      <PlayCircle className="h-5 w-5" />
                      {user && completedVideos > 0
                        ? '学習を続ける'
                        : '学習を始める'}
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full gap-2" size="lg">
                    <PlayCircle className="h-5 w-5" />
                    準備中
                  </Button>
                )}

                {!user && (
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    ログインすると進捗を保存できます
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="container py-8">
        <h2 className="mb-6 text-xl font-semibold">カリキュラム</h2>

        {sortedSections.length > 0 ? (
          <SectionAccordion
            sections={sortedSections}
            courseId={courseId}
            completedVideoIds={completedVideoIds}
            isAuthenticated={!!user}
            defaultOpenSectionId={firstIncompleteVideo?.sectionId}
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">コンテンツは準備中です</p>
              <p className="mt-1 text-sm text-muted-foreground">
                もうしばらくお待ちください
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
