import { notFound } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Pencil, Plus } from 'lucide-react'
import {
  deleteVideo,
  reorderVideos,
  togglePreview,
} from './videos/actions'

// 遅延読み込みコンポーネント
const VideosList = dynamic(
  () => import('@/components/admin/videos-list').then((mod) => mod.VideosList),
  {
    loading: () => (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    ),
  }
)

export default async function SectionDetailPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string }>
}) {
  const { courseId, sectionId } = await params
  const supabase = await createClient()

  // セクションと動画を取得
  const { data: section, error } = await supabase
    .from('sections')
    .select(`
      id,
      title,
      description,
      course:courses (id, title),
      videos (
        id,
        title,
        description,
        youtube_url,
        duration,
        is_preview,
        order_index
      )
    `)
    .eq('id', sectionId)
    .eq('course_id', courseId)
    .single()

  if (error || !section) {
    notFound()
  }

  // courseの型キャスト（Supabaseは配列として推論するため）
  const course = section.course as unknown as { id: string; title: string } | null

  // 動画をソート
  const sortedVideos = [...(section.videos || [])].sort(
    (a, b) => a.order_index - b.order_index
  )

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/admin/courses"
          className="transition-colors hover:text-foreground"
        >
          講座一覧
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}`}
          className="transition-colors hover:text-foreground"
        >
          {course?.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">{section.title}</span>
      </div>

      {/* Back link */}
      <Link
        href={`/admin/courses/${courseId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        講座に戻る
      </Link>

      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{section.title}</h1>
          {section.description && (
            <p className="mt-2 text-muted-foreground">{section.description}</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {sortedVideos.length} 動画
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/courses/${courseId}/sections/${sectionId}/videos/new`}>
              <Plus className="mr-2 h-4 w-4" />
              動画追加
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/courses/${courseId}/sections/${sectionId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              セクション編集
            </Link>
          </Button>
        </div>
      </div>

      {/* Videos List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">動画一覧</h2>
        <VideosList
          courseId={courseId}
          sectionId={sectionId}
          videos={sortedVideos}
          onDelete={deleteVideo}
          onReorder={reorderVideos}
          onTogglePreview={togglePreview}
        />
      </div>
    </div>
  )
}
