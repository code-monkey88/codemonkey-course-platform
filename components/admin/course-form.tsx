'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

type CourseFormProps = {
  mode: 'create' | 'edit'
  initialData?: {
    id: string
    title: string
    description: string | null
    level: string
    thumbnail_url: string | null
  }
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>
}

export function CourseForm({ mode, initialData, onSubmit }: CourseFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      const result = await onSubmit(formData)
      return result || null
    },
    null
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? '新規講座作成' : '講座を編集'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">
              タイトル <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title || ''}
              placeholder="講座のタイトルを入力"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ''}
              placeholder="講座の説明を入力（任意）"
              rows={4}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">
              レベル <span className="text-destructive">*</span>
            </Label>
            <Select
              name="level"
              defaultValue={initialData?.level || 'beginner'}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="レベルを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">初級</SelectItem>
                <SelectItem value="intermediate">中級</SelectItem>
                <SelectItem value="advanced">上級</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">サムネイルURL</Label>
            <Input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              defaultValue={initialData?.thumbnail_url || ''}
              placeholder="https://example.com/image.jpg"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              講座一覧に表示されるサムネイル画像のURL
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : mode === 'create' ? (
                '作成'
              ) : (
                '更新'
              )}
            </Button>
            <Button type="button" variant="outline" asChild disabled={isPending}>
              <Link href="/admin/courses">キャンセル</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
