'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Home page error:', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 blur-2xl" />

        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/30">
          <AlertTriangle className="h-12 w-12" />
        </div>
      </div>

      <h1 className="mt-8 text-2xl font-bold">エラーが発生しました</h1>

      <p className="mt-3 max-w-md text-center text-muted-foreground">
        ページの読み込み中に問題が発生しました。
        <br />
        しばらくしてから再度お試しください。
      </p>

      <Button onClick={reset} className="mt-8 gap-2">
        <RefreshCw className="h-4 w-4" />
        再読み込み
      </Button>
    </div>
  )
}
