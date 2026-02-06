import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * YouTube URLから動画IDを抽出
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

/**
 * 動画時間（秒）を "mm:ss" 形式にフォーマット
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 進捗率を計算
 */
export function calculateProgress(
  totalVideos: number,
  completedVideos: number
): number {
  if (totalVideos === 0) return 0
  return Math.round((completedVideos / totalVideos) * 100)
}

/**
 * レベルの日本語表示
 */
export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級',
  }
  return labels[level] || level
}
