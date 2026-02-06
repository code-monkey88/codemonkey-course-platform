import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VideoOff, ArrowLeft, Home } from 'lucide-react'

export default function VideoNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-purple-500/20 blur-2xl" />

        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-xl shadow-blue-500/30">
          <VideoOff className="h-12 w-12" />
        </div>
      </div>

      <h1 className="mt-8 text-7xl font-bold tracking-tight text-foreground/10">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold">動画が見つかりません</h2>

      <p className="mt-3 max-w-md text-center text-muted-foreground">
        お探しの動画は存在しないか、削除された可能性があります。
        <br />
        URLをご確認ください。
      </p>

      <div className="mt-8 flex gap-4">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Link>
        </Button>
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            講座一覧へ
          </Link>
        </Button>
      </div>
    </div>
  )
}
