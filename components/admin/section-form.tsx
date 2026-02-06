'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

type SectionFormProps = {
  mode: 'create' | 'edit'
  courseId: string
  initialData?: {
    id: string
    title: string
    description: string | null
  }
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>
}

export function SectionForm({
  mode,
  courseId,
  initialData,
  onSubmit,
}: SectionFormProps) {
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
          {mode === 'create' ? '新規セクション作成' : 'セクションを編集'}
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
              placeholder="セクションのタイトルを入力"
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
              placeholder="セクションの説明を入力（任意）"
              rows={3}
              disabled={isPending}
            />
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
              <Link href={`/admin/courses/${courseId}`}>キャンセル</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
