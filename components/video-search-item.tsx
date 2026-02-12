import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, BookOpen, FolderOpen, Clock, Eye } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

type VideoSearchItemProps = {
  video: {
    id: string
    title: string
    duration: number | null
    is_preview: boolean | null
    order_index: number
    section: {
      id: string
      title: string
      course: {
        id: string
        title: string
      }
    }
  }
}

export function VideoSearchItem({ video }: VideoSearchItemProps) {
  return (
    <Link href={`/courses/${video.section.course.id}/videos/${video.id}`} className="group block">
      <Card className="border-0 bg-background shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5">
        <CardContent className="flex items-center gap-4 p-4">
          {/* Play Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10 transition-colors group-hover:from-blue-500/20 group-hover:to-violet-500/20">
            <PlayCircle className="h-5 w-5 text-blue-500 transition-colors group-hover:text-blue-600" />
          </div>

          {/* Video Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium transition-colors group-hover:text-blue-600">
                {video.title}
              </h3>
              {video.is_preview && (
                <Badge
                  variant="secondary"
                  className="shrink-0 gap-1 bg-blue-500/10 text-blue-600 hover:bg-blue-500/10"
                >
                  <Eye className="h-3 w-3" />
                  プレビュー
                </Badge>
              )}
            </div>

            {/* Course & Section breadcrumb */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {video.section.course.title}
              </span>
              <span className="flex items-center gap-1">
                <FolderOpen className="h-3 w-3" />
                {video.section.title}
              </span>
            </div>
          </div>

          {/* Duration */}
          {video.duration && video.duration > 0 && (
            <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDuration(video.duration)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
