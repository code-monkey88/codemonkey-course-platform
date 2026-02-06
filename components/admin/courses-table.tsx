'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { LevelBadge } from '@/components/level-badge'
import { Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Level = 'beginner' | 'intermediate' | 'advanced'

type Course = {
  id: string
  title: string
  level: string
  order_index: number
  sectionCount: number
  videoCount: number
}

type CoursesTableProps = {
  courses: Course[]
  onDelete: (courseId: string) => Promise<{ error?: string; success?: boolean }>
  onReorder: (orderedIds: string[]) => Promise<{ error?: string; success?: boolean }>
}

export function CoursesTable({ courses, onDelete, onReorder }: CoursesTableProps) {
  const [items, setItems] = useState(courses)
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!deleteTarget) return

    startTransition(async () => {
      const result = await onDelete(deleteTarget.id)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('講座を削除しました')
        setItems(items.filter((c) => c.id !== deleteTarget.id))
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
      const result = await onReorder(newItems.map((c) => c.id))

      if (result.error) {
        toast.error(result.error)
        setItems(items) // revert
      }
    })
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">順序</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead className="w-24">レベル</TableHead>
              <TableHead className="w-24 text-center">セクション</TableHead>
              <TableHead className="w-24 text-center">動画</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  講座がありません
                </TableCell>
              </TableRow>
            ) : (
              items.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
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
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="font-medium hover:text-blue-600 hover:underline"
                    >
                      {course.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <LevelBadge level={course.level as Level} />
                  </TableCell>
                  <TableCell className="text-center">
                    {course.sectionCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {course.videoCount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">編集</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(course)}
                        disabled={isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>講座を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.title}」を削除すると、関連するすべてのセクションと動画も削除されます。
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>キャンセル</AlertDialogCancel>
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
