'use client'

import Link from 'next/link'
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import { cn, formatDuration } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

type Video = {
  id: string
  title: string
  duration: number | null
  order_index: number
}

type Section = {
  id: string
  title: string
  order_index: number
  videos: Video[]
}

type VideoSidebarProps = {
  sections: Section[]
  courseId: string
  currentVideoId: string
  completedVideoIds: Set<string>
}

export function VideoSidebar({
  sections,
  courseId,
  currentVideoId,
  completedVideoIds,
}: VideoSidebarProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">コンテンツ</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sections.map((section) => (
            <div key={section.id} className="mb-4">
              <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.order_index}. {section.title}
              </div>
              <div className="space-y-0.5">
                {section.videos.map((video) => {
                  const isCurrent = video.id === currentVideoId
                  const isCompleted = completedVideoIds.has(video.id)

                  return (
                    <Link
                      key={video.id}
                      href={`/courses/${courseId}/videos/${video.id}`}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                        isCurrent
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'hover:bg-muted'
                      )}
                    >
                      {/* Status Icon */}
                      <div className="shrink-0">
                        {isCurrent ? (
                          <PlayCircle className="h-4 w-4 text-blue-500" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'truncate',
                            isCurrent && 'font-medium',
                            isCompleted && !isCurrent && 'text-muted-foreground'
                          )}
                        >
                          {video.order_index}. {video.title}
                        </p>
                      </div>

                      {/* Duration */}
                      {video.duration && video.duration > 0 && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDuration(video.duration)}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
