import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { VideoForm } from '@/components/admin/video-form'
import { ArrowLeft } from 'lucide-react'
import { updateVideo } from '../../actions'

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string; videoId: string }>
}) {
  const { courseId, sectionId, videoId } = await params
  const supabase = await createClient()

  // セクションと動画を取得
  const [sectionResult, videoResult] = await Promise.all([
    supabase
      .from('sections')
      .select(`
        id,
        title,
        course:courses (id, title)
      `)
      .eq('id', sectionId)
      .eq('course_id', courseId)
      .single(),
    supabase
      .from('videos')
      .select('id, title, description, youtube_url, duration, is_preview')
      .eq('id', videoId)
      .eq('section_id', sectionId)
      .single(),
  ])

  if (
    sectionResult.error ||
    !sectionResult.data ||
    videoResult.error ||
    !videoResult.data
  ) {
    notFound()
  }

  const section = sectionResult.data as unknown as {
    id: string
    title: string
    course: { id: string; title: string } | null
  }
  const video = videoResult.data

  const handleSubmit = async (formData: FormData) => {
    'use server'
    return updateVideo(videoId, sectionId, courseId, formData)
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
          {section.course?.title}
        </Link>
        <span>/</span>
        <Link
          href={`/admin/courses/${courseId}/sections/${sectionId}`}
          className="transition-colors hover:text-foreground"
        >
          {section.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">{video.title}を編集</span>
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
        mode="edit"
        courseId={courseId}
        sectionId={sectionId}
        initialData={video}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
