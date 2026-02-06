'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

type ProfileEditFormProps = {
  initialDisplayName: string
  initialBio: string | null
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>
}

export function ProfileEditForm({
  initialDisplayName,
  initialBio,
  onSubmit,
}: ProfileEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      const result = await onSubmit(formData)
      return result || null
    },
    null
  )

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="displayName">
          表示名 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={initialDisplayName}
          placeholder="表示名を入力"
          maxLength={50}
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">1〜50文字</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">自己紹介</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={initialBio || ''}
          placeholder="自己紹介を入力（任意）"
          maxLength={500}
          rows={5}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">最大500文字</p>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            '保存'
          )}
        </Button>
        <Button type="button" variant="outline" asChild disabled={isPending}>
          <Link href="/profile">キャンセル</Link>
        </Button>
      </div>
    </form>
  )
}
