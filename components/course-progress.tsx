import { Progress } from '@/components/ui/progress'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type CourseProgressProps = {
  completed: number
  total: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CourseProgress({
  completed,
  total,
  className,
  showLabel = true,
  size = 'md',
}: CourseProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const isComplete = completed === total && total > 0

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : null}
            <span className="text-muted-foreground">
              {completed} / {total} 完了
            </span>
          </div>
          <span
            className={cn(
              'font-medium',
              isComplete ? 'text-green-500' : 'text-foreground'
            )}
          >
            {percentage}%
          </span>
        </div>
      )}
      <Progress
        value={percentage}
        className={cn(
          sizeClasses[size],
          isComplete && '[&>div]:bg-green-500'
        )}
      />
    </div>
  )
}
