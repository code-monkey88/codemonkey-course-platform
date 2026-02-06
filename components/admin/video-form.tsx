'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { extractYouTubeId } from '@/lib/utils'

type VideoFormProps = {
  mode: 'create' | 'edit'
  courseId: string
  sectionId: string
  initialData?: {
    id: string
    title: string
    description: string | null
    youtube_url: string
    duration: number | null
    is_preview: boolean
  }
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>
}

export function VideoForm({
  mode,
  courseId,
  sectionId,
  initialData,
  onSubmit,
}: VideoFormProps) {
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtube_url || '')
  const [isPreview, setIsPreview] = useState(initialData?.is_preview || false)

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      const result = await onSubmit(formData)
      return result || null
    },
    null
  )

  const youtubeId = extractYouTubeId(youtubeUrl)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? '新規動画追加' : '動画を編集'}
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
              placeholder="動画のタイトルを入力"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">
              YouTube URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              youtube.com/watch?v=xxx または youtu.be/xxx 形式で入力
            </p>
          </div>

          {/* YouTube Preview */}
          {youtubeId && (
            <div className="space-y-2">
              <Label>プレビュー</Label>
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ''}
              placeholder="動画の説明を入力（任意）"
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationSeconds">動画時間（秒）</Label>
            <Input
              id="durationSeconds"
              name="durationSeconds"
              type="number"
              min="0"
              defaultValue={initialData?.duration || ''}
              placeholder="例: 330（5分30秒の場合）"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              動画の長さを秒単位で入力（任意）
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPreview"
              name="isPreview"
              checked={isPreview}
              onCheckedChange={(checked) => setIsPreview(checked === true)}
              disabled={isPending}
            />
            <Label htmlFor="isPreview" className="font-normal">
              プレビューとして公開（未認証でも視聴可能）
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : mode === 'create' ? (
                '追加'
              ) : (
                '更新'
              )}
            </Button>
            <Button type="button" variant="outline" asChild disabled={isPending}>
              <Link href={`/admin/courses/${courseId}/sections/${sectionId}`}>
                キャンセル
              </Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
