import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import { VideoPlayer } from '@/components/video-player'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Home,
  BookOpen,
  FolderOpen,
} from 'lucide-react'
import { toggleVideoProgress } from './actions'

// 遅延読み込みコンポーネント
const VideoSidebar = dynamic(
  () => import('@/components/video-sidebar').then((mod) => mod.VideoSidebar),
  {
    loading: () => (
      <div className="flex h-full flex-col rounded-xl border bg-card">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    ),
  }
)

const ProgressButton = dynamic(
  () => import('@/components/progress-button').then((mod) => mod.ProgressButton),
  {
    loading: () => <Skeleton className="h-10 w-32" />,
  }
)

export default async function VideoPlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; videoId: string }>
}) {
  const { courseId, videoId } = await params
  const supabase = await createClient()

  // 動画データを取得
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .select(
      `
      id,
      title,
      description,
      youtube_url,
      duration,
      is_preview,
      order_index,
      section_id,
      section:sections (
        id,
        title,
        order_index,
        course_id,
        course:courses (
          id,
          title
        )
      )
    `
    )
    .eq('id', videoId)
    .single()

  if (videoError || !video) {
    notFound()
  }

  // 型キャスト（Supabaseは配列として推論するため）
  const section = video.section as unknown as {
    id: string
    title: string
    order_index: number
    course_id: string
    course: { id: string; title: string } | null
  } | null

  // 講座IDの整合性チェック
  if (section?.course?.id !== courseId) {
    notFound()
  }

  // 認証チェック
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // プレビュー動画でなく、未認証の場合はログインページへ
  if (!video.is_preview && !user) {
    redirect(`/login?next=/courses/${courseId}/videos/${videoId}`)
  }

  // 講座の全セクションと動画を取得（サイドバー用）
  const { data: sections } = await supabase
    .from('sections')
    .select(
      `
      id,
      title,
      order_index,
      videos (
        id,
        title,
        duration,
        order_index
      )
    `
    )
    .eq('course_id', courseId)
    .order('order_index')

  // セクションと動画をソート
  type SectionFromDB = NonNullable<typeof sections>[number]
  type VideoFromDB = SectionFromDB['videos'][number]

  const sortedSections = (sections || [])
    .sort((a: SectionFromDB, b: SectionFromDB) => a.order_index - b.order_index)
    .map((section: SectionFromDB) => ({
      ...section,
      videos: [...(section.videos || [])].sort(
        (a: VideoFromDB, b: VideoFromDB) => a.order_index - b.order_index
      ),
    }))

  // 全動画リスト（フラット）
  const allVideos = sortedSections.flatMap((s) => s.videos)

  // 現在の動画のインデックス
  const currentIndex = allVideos.findIndex((v) => v.id === videoId)
  const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null
  const nextVideo =
    currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null

  // ユーザーの進捗を取得
  let completedVideoIds = new Set<string>()
  let isCurrentVideoCompleted = false

  if (user) {
    const videoIds = allVideos.map((v) => v.id)
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('video_id')
      .eq('user_id', user.id)
      .eq('completed', true)
      .in('video_id', videoIds)

    if (progressData) {
      completedVideoIds = new Set(progressData.map((p) => p.video_id))
      isCurrentVideoCompleted = completedVideoIds.has(videoId)
    }
  }

  const course = section?.course

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="container py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span>ホーム</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-1 hover:text-foreground"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="max-w-[150px] truncate">{course?.title}</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="flex items-center gap-1">
            <FolderOpen className="h-3.5 w-3.5" />
            <span className="max-w-[150px] truncate">{section?.title}</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="max-w-[200px] truncate font-medium text-foreground">
            {video.title}
          </span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Video Player */}
            <VideoPlayer youtubeUrl={video.youtube_url} title={video.title} />

            {/* Video Info */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold">{video.title}</h1>

                {video.description && (
                  <p className="mt-4 whitespace-pre-wrap text-muted-foreground">
                    {video.description}
                  </p>
                )}

                {/* Navigation & Progress */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
                  <div className="flex items-center gap-2">
                    {prevVideo ? (
                      <Button asChild variant="outline" className="gap-2">
                        <Link
                          href={`/courses/${courseId}/videos/${prevVideo.id}`}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">前の動画</span>
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">前の動画</span>
                      </Button>
                    )}

                    {nextVideo ? (
                      <Button asChild variant="outline" className="gap-2">
                        <Link
                          href={`/courses/${courseId}/videos/${nextVideo.id}`}
                        >
                          <span className="hidden sm:inline">次の動画</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="gap-2">
                        <span className="hidden sm:inline">次の動画</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {user && (
                    <ProgressButton
                      videoId={videoId}
                      isCompleted={isCurrentVideoCompleted}
                      onToggle={toggleVideoProgress}
                    />
                  )}
                </div>

                {!user && (
                  <div className="mt-4 rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                    <Link
                      href={`/login?next=/courses/${courseId}/videos/${videoId}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      ログイン
                    </Link>
                    すると進捗を保存できます
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Back to course */}
            <Button asChild variant="ghost" className="gap-2">
              <Link href={`/courses/${courseId}`}>
                <ArrowLeft className="h-4 w-4" />
                講座詳細に戻る
              </Link>
            </Button>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20 h-[calc(100vh-8rem)]">
              <VideoSidebar
                sections={sortedSections}
                courseId={courseId}
                currentVideoId={videoId}
                completedVideoIds={completedVideoIds}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
