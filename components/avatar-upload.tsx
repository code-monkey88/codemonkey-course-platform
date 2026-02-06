'use client'

import { useRef, useState, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type AvatarUploadProps = {
  currentAvatarUrl?: string | null
  displayName: string
  onUpload: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
}

export function AvatarUpload({
  currentAvatarUrl,
  displayName,
  onUpload,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // プレビュー表示
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // アップロード
    startTransition(async () => {
      const formData = new FormData()
      formData.append('avatar', file)

      const result = await onUpload(formData)

      if (result.error) {
        toast.error(result.error)
        setPreview(null)
      } else {
        toast.success('アバターを更新しました')
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
          <AvatarImage
            src={preview || currentAvatarUrl || undefined}
            alt={displayName}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-2xl text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100',
            isPending && 'opacity-100'
          )}
        >
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isPending}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            アップロード中...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            画像を変更
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        JPEG、PNG、WebP形式（最大2MB）
      </p>
    </div>
  )
}
