import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { deleteCourse, reorderCourses } from './actions'

// 遅延読み込みコンポーネント
const CoursesTable = dynamic(
  () => import('@/components/admin/courses-table').then((mod) => mod.CoursesTable),
  {
    loading: () => (
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <Skeleton className="h-8 w-full" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b p-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    ),
  }
)

export default async function AdminCoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      level,
      order_index,
      sections (
        id,
        videos (id)
      )
    `)
    .order('order_index')

  // セクション数と動画数を計算
  const coursesWithCounts = (courses || []).map((course) => {
    const sections = course.sections || []
    const sectionCount = sections.length
    const videoCount = sections.reduce(
      (sum, s) => sum + (s.videos?.length || 0),
      0
    )
    return {
      id: course.id,
      title: course.title,
      level: course.level,
      order_index: course.order_index,
      sectionCount,
      videoCount,
    }
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">講座管理</h1>
          <p className="text-muted-foreground">
            講座の作成・編集・削除・並び替えを行います
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            新規講座
          </Link>
        </Button>
      </div>

      {/* Courses Table */}
      <CoursesTable
        courses={coursesWithCounts}
        onDelete={deleteCourse}
        onReorder={reorderCourses}
      />
    </div>
  )
}
