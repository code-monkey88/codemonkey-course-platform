'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type ProgressButtonProps = {
  videoId: string
  isCompleted: boolean
  onToggle: (videoId: string, completed: boolean) => Promise<void>
}

export function ProgressButton({
  videoId,
  isCompleted: initialIsCompleted,
  onToggle,
}: ProgressButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      try {
        await onToggle(videoId, !isCompleted)
        setIsCompleted(!isCompleted)
        toast.success(
          isCompleted ? '完了を取り消しました' : '完了としてマークしました'
        )
      } catch {
        toast.error('エラーが発生しました')
      }
    })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={isCompleted ? 'default' : 'outline'}
      className={cn(
        'gap-2 transition-all',
        isCompleted &&
          'bg-green-500 hover:bg-green-600 text-white border-green-500'
      )}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {isCompleted ? '完了済み' : '完了としてマーク'}
    </Button>
  )
}
