import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/lib/supabase/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LevelBadge } from '@/components/level-badge'
import {
  BookOpen,
  Clock,
  Trophy,
  ArrowRight,
  Sparkles,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

type Level = 'beginner' | 'intermediate' | 'advanced'

export default async function DashboardPage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  const supabase = await createClient()

  // 全講座と動画数を取得
  const { data: courses } = await supabase
    .from('courses')
    .select(
      `
      id,
      title,
      level,
      thumbnail_url,
      order_index,
      sections (
        videos (id, duration)
      )
    `
    )
    .order('order_index')

  // ユーザーの進捗を取得
  const { data: progressData } = await supabase
    .from('user_progress')
    .select(
      `
      video_id,
      completed,
      completed_at,
      videos (
        id,
        title,
        duration,
        sections (
          id,
          title,
          courses (
            id,
            title
          )
        )
      )
    `
    )
    .eq('user_id', profile.id)
    .eq('completed', true)
    .order('completed_at', { ascending: false })

  // 完了した動画IDのセット
  const completedVideoIds = new Set(
    progressData?.map((p) => p.video_id) || []
  )

  // 統計を計算
  type CourseFromDB = NonNullable<typeof courses>[number]
  type SectionFromDB = CourseFromDB['sections'][number]
  type VideoFromDB = SectionFromDB['videos'][number]

  const allVideos =
    courses?.flatMap((c: CourseFromDB) =>
      c.sections?.flatMap((s: SectionFromDB) => s.videos || [])
    ) || []
  const totalVideos = allVideos.length
  const completedVideos = completedVideoIds.size

  // 学習時間（完了した動画の合計秒数）
  const totalStudySeconds =
    progressData?.reduce((sum, p) => {
      const video = p.videos as { duration?: number | null } | null
      return sum + (video?.duration || 0)
    }, 0) || 0
  const studyHours = Math.floor(totalStudySeconds / 3600)
  const studyMinutes = Math.floor((totalStudySeconds % 3600) / 60)

  // 講座別の進捗を計算
  const courseProgress =
    courses?.map((course: CourseFromDB) => {
      const courseVideos = course.sections?.flatMap(
        (s: SectionFromDB) => s.videos || []
      ) || []
      const total = courseVideos.length
      const completed = courseVideos.filter((v: VideoFromDB) =>
        completedVideoIds.has(v.id)
      ).length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      const isComplete = total > 0 && completed === total

      // 最後に完了した動画を見つける（次の動画へのリンク用）
      const lastCompletedIndex = courseVideos.findIndex(
        (v: VideoFromDB) => !completedVideoIds.has(v.id)
      )
      const nextVideo =
        lastCompletedIndex >= 0 ? courseVideos[lastCompletedIndex] : null

      return {
        ...course,
        total,
        completed,
        percentage,
        isComplete,
        nextVideo,
      }
    }) || []

  // 完了した講座数
  const completedCourses = courseProgress.filter((c) => c.isComplete).length

  // 全体の進捗率
  const overallProgress =
    totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0

  // 最近の視聴履歴（最大5件）
  type VideoWithSection = {
    id: string
    title: string
    sections?: {
      id: string
      title: string
      courses?: { id: string; title: string } | null
    } | null
  }

  const recentVideos = (progressData || []).slice(0, 5).map((p) => {
    const video = p.videos as unknown as VideoWithSection | null
    return {
      id: video?.id || '',
      title: video?.title || '',
      sectionTitle: video?.sections?.title || '',
      courseId: video?.sections?.courses?.id || '',
      courseTitle: video?.sections?.courses?.title || '',
      completedAt: p.completed_at,
    }
  })

  const initials = profile.display_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-background shadow-xl">
              <AvatarImage
                src={profile.avatar_url || undefined}
                alt={profile.display_name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-lg text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">おかえりなさい</p>
              <h1 className="text-2xl font-bold">{profile.display_name}さん</h1>
            </div>
          </div>
          <Button asChild className="gap-2">
            <Link href="/">
              学習を続ける
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                完了した動画
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedVideos}</div>
              <p className="text-xs text-muted-foreground">
                / {totalVideos} 本
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-green-500/10" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                完了した講座
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                <Trophy className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                / {courses?.length || 0} 講座
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-violet-500/10" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                学習時間
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                <Clock className="h-4 w-4 text-violet-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {studyHours > 0 ? `${studyHours}h` : `${studyMinutes}m`}
              </div>
              <p className="text-xs text-muted-foreground">
                {studyHours > 0 ? `${studyMinutes}分` : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-amber-500/10" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                進捗率
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Course Progress & Recent Videos */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>講座別の進捗</CardTitle>
              <CardDescription>各講座の学習進捗状況</CardDescription>
            </CardHeader>
            <CardContent>
              {courseProgress.length > 0 ? (
                <div className="space-y-4">
                  {courseProgress.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/courses/${course.id}`}
                              className="truncate font-medium hover:text-blue-600 hover:underline"
                            >
                              {course.title}
                            </Link>
                            <LevelBadge level={course.level as Level} />
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <Progress
                              value={course.percentage}
                              className={`h-2 flex-1 ${course.isComplete ? '[&>div]:bg-green-500' : ''}`}
                            />
                            <span
                              className={`text-sm font-medium ${course.isComplete ? 'text-green-500' : ''}`}
                            >
                              {course.percentage}%
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {course.completed} / {course.total} 本完了
                          </p>
                        </div>
                        {course.nextVideo && !course.isComplete && (
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={`/courses/${course.id}/videos/${course.nextVideo.id}`}
                            >
                              続きを見る
                            </Link>
                          </Button>
                        )}
                        {course.isComplete && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 font-medium">講座がありません</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    講座一覧から学習を始めましょう
                  </p>
                  <Button asChild className="mt-4" variant="outline">
                    <Link href="/">講座一覧を見る</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>最近の学習</CardTitle>
              <CardDescription>最近視聴した動画</CardDescription>
            </CardHeader>
            <CardContent>
              {recentVideos.length > 0 ? (
                <div className="space-y-3">
                  {recentVideos.map((video) => (
                    <Link
                      key={video.id}
                      href={`/courses/${video.courseId}/videos/${video.id}`}
                      className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                        <PlayCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium group-hover:text-blue-600">
                          {video.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {video.courseTitle}
                        </p>
                      </div>
                      {video.completedAt && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(video.completedAt), {
                            addSuffix: true,
                            locale: ja,
                          })}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 font-medium">視聴履歴はありません</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    動画を視聴すると、ここに表示されます
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
