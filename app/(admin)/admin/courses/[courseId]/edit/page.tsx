import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CourseForm } from '@/components/admin/course-form'
import { ArrowLeft } from 'lucide-react'
import { updateCourse } from '../../actions'

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select('id, title, description, level, thumbnail_url')
    .eq('id', courseId)
    .single()

  if (error || !course) {
    notFound()
  }

  const handleSubmit = async (formData: FormData) => {
    'use server'
    return updateCourse(courseId, formData)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        講座一覧に戻る
      </Link>

      {/* Course Form */}
      <CourseForm mode="edit" initialData={course} onSubmit={handleSubmit} />
    </div>
  )
}
