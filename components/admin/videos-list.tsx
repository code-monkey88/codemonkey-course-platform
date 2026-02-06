'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Pencil,
  Trash2,
  GripVertical,
  Loader2,
  PlayCircle,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDuration, extractYouTubeId } from '@/lib/utils'

type Video = {
  id: string
  title: string
  description: string | null
  youtube_url: string
  duration: number | null
  is_preview: boolean
  order_index: number
}

type VideosListProps = {
  courseId: string
  sectionId: string
  videos: Video[]
  onDelete: (
    videoId: string,
    sectionId: string,
    courseId: string
  ) => Promise<{ error?: string; success?: boolean }>
  onReorder: (
    sectionId: string,
    courseId: string,
    orderedIds: string[]
  ) => Promise<{ error?: string; success?: boolean }>
  onTogglePreview: (
    videoId: string,
    sectionId: string,
    courseId: string,
    isPreview: boolean
  ) => Promise<{ error?: string; success?: boolean }>
}

export function VideosList({
  courseId,
  sectionId,
  videos,
  onDelete,
  onReorder,
  onTogglePreview,
}: VideosListProps) {
  const [items, setItems] = useState(videos)
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!deleteTarget) return

    startTransition(async () => {
      const result = await onDelete(deleteTarget.id, sectionId, courseId)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('動画を削除しました')
        setItems(items.filter((v) => v.id !== deleteTarget.id))
      }

      setDeleteTarget(null)
    })
  }

  const handleTogglePreview = async (video: Video) => {
    const newPreviewState = !video.is_preview

    // Optimistic update
    setItems(
      items.map((v) =>
        v.id === video.id ? { ...v, is_preview: newPreviewState } : v
      )
    )

    startTransition(async () => {
      const result = await onTogglePreview(
        video.id,
        sectionId,
        courseId,
        newPreviewState
      )

      if (result.error) {
        toast.error(result.error)
        // Revert
        setItems(
          items.map((v) =>
            v.id === video.id ? { ...v, is_preview: video.is_preview } : v
          )
        )
      }
    })
  }

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return

    const newItems = [...items]
    const [removed] = newItems.splice(index, 1)
    newItems.splice(newIndex, 0, removed)

    setItems(newItems)

    startTransition(async () => {
      const result = await onReorder(
        sectionId,
        courseId,
        newItems.map((v) => v.id)
      )

      if (result.error) {
        toast.error(result.error)
        setItems(items) // revert
      }
    })
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <PlayCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            動画がまだありません
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((video, index) => {
          const youtubeId = extractYouTubeId(video.youtube_url)
          return (
            <Card key={video.id}>
              <CardContent className="flex items-start gap-4 p-4">
                {/* Drag handle and reorder buttons */}
                <div className="flex items-center gap-1">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0 || isPending}
                    >
                      <span className="text-xs">▲</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1 || isPending}
                    >
                      <span className="text-xs">▼</span>
                    </Button>
                  </div>
                </div>

                {/* Video number badge */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 font-semibold text-blue-500">
                  {index + 1}
                </div>

                {/* Video info */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{video.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {video.duration && (
                      <span>{formatDuration(video.duration)}</span>
                    )}
                    {youtubeId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        YouTube
                      </a>
                    )}
                  </div>
                  {video.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {video.description}
                    </p>
                  )}
                </div>

                {/* Preview toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    プレビュー
                  </span>
                  <Switch
                    checked={video.is_preview}
                    onCheckedChange={() => handleTogglePreview(video)}
                    disabled={isPending}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="icon">
                    <Link
                      href={`/admin/courses/${courseId}/sections/${sectionId}/videos/${video.id}/edit`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">編集</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(video)}
                    disabled={isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">削除</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>動画を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.title}
              」を削除すると、関連する視聴進捗データも削除されます。
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                '削除'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
