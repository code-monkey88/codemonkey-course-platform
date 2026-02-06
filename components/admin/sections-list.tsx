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
import {
  Pencil,
  Trash2,
  GripVertical,
  Loader2,
  PlayCircle,
  FolderOpen,
} from 'lucide-react'
import { toast } from 'sonner'

type Section = {
  id: string
  title: string
  description: string | null
  order_index: number
  videoCount: number
}

type SectionsListProps = {
  courseId: string
  sections: Section[]
  onDelete: (
    sectionId: string,
    courseId: string
  ) => Promise<{ error?: string; success?: boolean }>
  onReorder: (
    courseId: string,
    orderedIds: string[]
  ) => Promise<{ error?: string; success?: boolean }>
}

export function SectionsList({
  courseId,
  sections,
  onDelete,
  onReorder,
}: SectionsListProps) {
  const [items, setItems] = useState(sections)
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!deleteTarget) return

    startTransition(async () => {
      const result = await onDelete(deleteTarget.id, courseId)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('セクションを削除しました')
        setItems(items.filter((s) => s.id !== deleteTarget.id))
      }

      setDeleteTarget(null)
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
        courseId,
        newItems.map((s) => s.id)
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
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            セクションがまだありません
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((section, index) => (
          <Card key={section.id}>
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

              {/* Section number badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 font-semibold text-violet-500">
                {index + 1}
              </div>

              {/* Section info */}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{section.title}</p>
                {section.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {section.description}
                  </p>
                )}
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <PlayCircle className="h-4 w-4" />
                  {section.videoCount} 動画
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/admin/courses/${courseId}/sections/${section.id}`}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    動画管理
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon">
                  <Link
                    href={`/admin/courses/${courseId}/sections/${section.id}/edit`}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">編集</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(section)}
                  disabled={isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">削除</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>セクションを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.title}
              」を削除すると、関連するすべての動画も削除されます。
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
