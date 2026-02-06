import Link from 'next/link'
import { CourseForm } from '@/components/admin/course-form'
import { ArrowLeft } from 'lucide-react'
import { createCourse } from '../actions'

export default function NewCoursePage() {
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
      <CourseForm mode="create" onSubmit={createCourse} />
    </div>
  )
}
