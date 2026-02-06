import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SectionForm } from '@/components/admin/section-form'
import { ArrowLeft } from 'lucide-react'
import { updateSection } from '../../actions'

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string }>
}) {
  const { courseId, sectionId } = await params
  const supabase = await createClient()

  // 講座とセクションを取得
  const [courseResult, sectionResult] = await Promise.all([
    supabase.from('courses').select('id, title').eq('id', courseId).single(),
    supabase
      .from('sections')
      .select('id, title, description')
      .eq('id', sectionId)
      .eq('course_id', courseId)
      .single(),
  ])

  if (
    courseResult.error ||
    !courseResult.data ||
    sectionResult.error ||
    !sectionResult.data
  ) {
    notFound()
  }

  const course = courseResult.data
  const section = sectionResult.data

  const handleSubmit = async (formData: FormData) => {
    'use server'
    return updateSection(sectionId, courseId, formData)
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
        <span className="text-foreground">{section.title}を編集</span>
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
      <SectionForm
        mode="edit"
        courseId={courseId}
        initialData={section}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
