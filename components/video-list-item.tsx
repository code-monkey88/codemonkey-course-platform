import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, PlayCircle, Clock, Eye } from 'lucide-react'
import { cn, formatDuration } from '@/lib/utils'

type VideoListItemProps = {
  video: {
    id: string
    title: string
    duration: number | null
    is_preview: boolean
    order_index: number
  }
  courseId: string
  isCompleted?: boolean
  isAuthenticated?: boolean
}

export function VideoListItem({
  video,
  courseId,
  isCompleted = false,
  isAuthenticated = false,
}: VideoListItemProps) {
  const canAccess = isAuthenticated || video.is_preview

  const content = (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg border p-3 transition-all',
        canAccess
          ? 'cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 hover:shadow-sm'
          : 'cursor-not-allowed opacity-60'
      )}
    >
      {/* Status Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : canAccess ? (
          <PlayCircle
            className={cn(
              'h-5 w-5 transition-colors',
              canAccess
                ? 'text-muted-foreground group-hover:text-blue-500'
                : 'text-muted-foreground/50'
            )}
          />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/50" />
        )}
      </div>

      {/* Video Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'truncate font-medium',
              isCompleted && 'text-muted-foreground'
            )}
          >
            {video.order_index}. {video.title}
          </span>
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
      </div>

      {/* Duration */}
      {video.duration && video.duration > 0 && (
        <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDuration(video.duration)}</span>
        </div>
      )}
    </div>
  )

  if (canAccess) {
    return (
      <Link href={`/courses/${courseId}/videos/${video.id}`}>{content}</Link>
    )
  }

  return content
}
