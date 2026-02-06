import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SectionForm } from '@/components/admin/section-form'
import { ArrowLeft } from 'lucide-react'
import { createSection } from '../actions'

export default async function NewSectionPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createClient()

  // 講座が存在するか確認
  const { data: course, error } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', courseId)
    .single()

  if (error || !course) {
    notFound()
  }

  const handleSubmit = async (formData: FormData) => {
    'use server'
    return createSection(courseId, formData)
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
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">新規セクション</span>
      </div>

      {/* Back link */}
      <Link
        href={`/admin/courses/${courseId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        戻る
      </Link>

      {/* Section Form */}
      <SectionForm mode="create" courseId={courseId} onSubmit={handleSubmit} />
    </div>
  )
}
