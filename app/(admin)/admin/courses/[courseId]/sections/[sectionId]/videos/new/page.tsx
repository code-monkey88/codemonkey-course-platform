import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { VideoForm } from '@/components/admin/video-form'
import { ArrowLeft } from 'lucide-react'
import { createVideo } from '../actions'

export default async function NewVideoPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string }>
}) {
  const { courseId, sectionId } = await params
  const supabase = await createClient()

  // 講座とセクションを取得
  const { data: section, error } = await supabase
    .from('sections')
    .select(`
      id,
      title,
      course:courses (id, title)
    `)
    .eq('id', sectionId)
    .eq('course_id', courseId)
    .single()

  if (error || !section) {
    notFound()
  }

  const sectionData = section as unknown as {
    id: string
    title: string
    course: { id: string; title: string } | null
  }

  const handleSubmit = async (formData: FormData) => {
    'use server'
    return createVideo(sectionId, courseId, formData)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
          {sectionData.course?.title}
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}/sections/${sectionId}`}
          className="transition-colors hover:text-foreground"
        >
          {sectionData.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">新規動画</span>
      </div>

      {/* Back link */}
      <Link
        href={`/admin/courses/${courseId}/sections/${sectionId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        戻る
      </Link>

      {/* Video Form */}
      <VideoForm
        mode="create"
        courseId={courseId}
        sectionId={sectionId}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
