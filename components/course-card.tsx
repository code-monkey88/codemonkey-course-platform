import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { LevelBadge } from '@/components/level-badge'
import { BookOpen, Clock, PlayCircle } from 'lucide-react'

type Level = 'beginner' | 'intermediate' | 'advanced'

type CourseCardProps = {
  course: {
    id: string
    title: string
    description: string | null
    level: Level
    thumbnail_url: string | null
  }
  videoCount?: number
  totalDuration?: number
}

export function CourseCard({ course, videoCount = 0, totalDuration = 0 }: CourseCardProps) {
  const formattedDuration = totalDuration > 0
    ? `${Math.floor(totalDuration / 60)}時間${totalDuration % 60}分`
    : null

  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <Card className="h-full overflow-hidden border-0 bg-background shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-purple-500/10">
              <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <PlayCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Level badge */}
          <div className="absolute left-3 top-3">
            <LevelBadge level={course.level} />
          </div>
        </div>

        <CardContent className="p-5">
          {/* Title */}
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-blue-600">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {course.description}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            {videoCount > 0 && (
              <div className="flex items-center gap-1">
                <PlayCircle className="h-3.5 w-3.5" />
                <span>{videoCount}本の動画</span>
              </div>
            )}
            {formattedDuration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{formattedDuration}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
