'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Level = 'beginner' | 'intermediate' | 'advanced'

type LevelBadgeProps = {
  level: Level
  className?: string
}

const levelConfig: Record<Level, { label: string; className: string }> = {
  beginner: {
    label: '初級',
    className: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-md shadow-emerald-500/20',
  },
  intermediate: {
    label: '中級',
    className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-md shadow-blue-500/20',
  },
  advanced: {
    label: '上級',
    className: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 shadow-md shadow-violet-500/20',
  },
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const config = levelConfig[level]

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
