import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, FolderOpen, PlayCircle, Plus, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // 統計を取得
  const [coursesResult, sectionsResult, videosResult] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('sections').select('id', { count: 'exact', head: true }),
    supabase.from('videos').select('id', { count: 'exact', head: true }),
  ])

  const courseCount = coursesResult.count || 0
  const sectionCount = sectionsResult.count || 0
  const videoCount = videosResult.count || 0

  // 最近追加された動画を取得
  const { data: recentVideos } = await supabase
    .from('videos')
    .select(`
      id,
      title,
      created_at,
      sections (
        title,
        courses (
          id,
          title
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
          <p className="text-muted-foreground">
            コンテンツの概要と最近の更新
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            新規講座
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              講座数
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courseCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              セクション数
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <FolderOpen className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sectionCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              動画数
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <PlayCircle className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{videoCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Videos */}
        <Card>
          <CardHeader>
            <CardTitle>最近追加された動画</CardTitle>
            <CardDescription>最新5件の動画</CardDescription>
          </CardHeader>
          <CardContent>
            {recentVideos && recentVideos.length > 0 ? (
              <div className="space-y-3">
                {recentVideos.map((video) => {
                  const section = video.sections as unknown as {
                    title: string
                    courses: { id: string; title: string } | null
                  } | null

                  return (
                    <div
                      key={video.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <PlayCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{video.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {section?.courses?.title} / {section?.title}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {video.created_at &&
                          formatDistanceToNow(new Date(video.created_at), {
                            addSuffix: true,
                            locale: ja,
                          })}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <PlayCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  動画がまだありません
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>よく使う操作</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/courses/new">
                <Plus className="mr-2 h-4 w-4 text-blue-500" />
                新しい講座を作成
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/courses">
                <BookOpen className="mr-2 h-4 w-4 text-violet-500" />
                講座一覧を見る
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/" target="_blank">
                <ArrowRight className="mr-2 h-4 w-4 text-emerald-500" />
                サイトをプレビュー
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
