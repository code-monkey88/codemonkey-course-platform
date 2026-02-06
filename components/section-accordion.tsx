'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { VideoListItem } from '@/components/video-list-item'
import { CourseProgress } from '@/components/course-progress'
import { FolderOpen, PlayCircle } from 'lucide-react'

type Video = {
  id: string
  title: string
  duration: number | null
  is_preview: boolean
  order_index: number
}

type Section = {
  id: string
  title: string
  description: string | null
  order_index: number
  videos: Video[]
}

type SectionAccordionProps = {
  sections: Section[]
  courseId: string
  completedVideoIds?: Set<string>
  isAuthenticated?: boolean
  defaultOpenSectionId?: string
}

export function SectionAccordion({
  sections,
  courseId,
  completedVideoIds = new Set(),
  isAuthenticated = false,
  defaultOpenSectionId,
}: SectionAccordionProps) {
  // デフォルトで開くセクションを決定
  const defaultValue = defaultOpenSectionId
    ? [defaultOpenSectionId]
    : sections.length > 0
      ? [sections[0].id]
      : []

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultValue}
      className="space-y-3"
    >
      {sections.map((section) => {
        const completedCount = section.videos.filter((v) =>
          completedVideoIds.has(v.id)
        ).length
        const totalCount = section.videos.length
        const isComplete = completedCount === totalCount && totalCount > 0

        return (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline [&[data-state=open]]:border-b">
              <div className="flex flex-1 items-center gap-4">
                {/* Section Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    isComplete
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}
                >
                  <FolderOpen className="h-5 w-5" />
                </div>

                {/* Section Info */}
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left">
                  <span className="font-semibold">
                    {section.order_index}. {section.title}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3 w-3" />
                      {totalCount}本の動画
                    </span>
                    {isAuthenticated && totalCount > 0 && (
                      <span
                        className={
                          isComplete ? 'text-green-500' : 'text-muted-foreground'
                        }
                      >
                        {completedCount}/{totalCount} 完了
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-5 pt-3">
              {/* Section Description */}
              {section.description && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}

              {/* Progress Bar (authenticated only) */}
              {isAuthenticated && totalCount > 0 && (
                <div className="mb-4">
                  <CourseProgress
                    completed={completedCount}
                    total={totalCount}
                    size="sm"
                    showLabel={false}
                  />
                </div>
              )}

              {/* Video List */}
              {section.videos.length > 0 ? (
                <div className="space-y-2">
                  {section.videos.map((video) => (
                    <VideoListItem
                      key={video.id}
                      video={video}
                      courseId={courseId}
                      isCompleted={completedVideoIds.has(video.id)}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <PlayCircle className="h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    動画は準備中です
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
