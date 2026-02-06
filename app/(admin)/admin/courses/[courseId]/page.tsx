import { notFound } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LevelBadge } from '@/components/level-badge'
import { ArrowLeft, Pencil, FolderOpen, PlayCircle, Plus } from 'lucide-react'
import { deleteSection, reorderSections } from './sections/actions'

// 遅延読み込みコンポーネント
const SectionsList = dynamic(
  () => import('@/components/admin/sections-list').then((mod) => mod.SectionsList),
  {
    loading: () => (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    ),
  }
)

type Level = 'beginner' | 'intermediate' | 'advanced'

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      level,
      sections (
        id,
        title,
        description,
        order_index,
        videos (id)
      )
    `)
    .eq('id', courseId)
    .single()

  if (error || !course) {
    notFound()
  }

  // セクションをソートして動画数を計算
  const sortedSections = [...(course.sections || [])]
    .sort((a, b) => a.order_index - b.order_index)
    .map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      order_index: section.order_index,
      videoCount: section.videos?.length || 0,
    }))

  const totalVideos = sortedSections.reduce(
    (sum, s) => sum + s.videoCount,
    0
  )

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        講座一覧に戻る
      </Link>

      {/* Course Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
            <LevelBadge level={course.level as Level} />
          </div>
          {course.description && (
            <p className="mt-2 text-muted-foreground">{course.description}</p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" />
              {sortedSections.length} セクション
            </span>
            <span className="flex items-center gap-1">
              <PlayCircle className="h-4 w-4" />
              {totalVideos} 動画
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/courses/${courseId}/sections/new`}>
              <Plus className="mr-2 h-4 w-4" />
              セクション追加
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/courses/${courseId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              講座編集
            </Link>
          </Button>
        </div>
      </div>

      {/* Sections List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">セクション一覧</h2>
        <SectionsList
          courseId={courseId}
          sections={sortedSections}
          onDelete={deleteSection}
          onReorder={reorderSections}
        />
      </div>
    </div>
  )
}
