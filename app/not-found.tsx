import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-gray-500/20 via-slate-500/20 to-zinc-500/20 blur-2xl" />

        <div className="text-center">
          <span className="text-8xl font-bold text-gradient bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            404
          </span>
        </div>
      </div>

      <h1 className="mt-8 text-2xl font-bold">ページが見つかりません</h1>

      <p className="mt-3 max-w-md text-center text-muted-foreground">
        お探しのページは存在しないか、移動した可能性があります。
        <br />
        URLが正しいかご確認ください。
      </p>

      <div className="mt-8 flex gap-4">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/courses">
            <Search className="h-4 w-4" />
            講座を探す
          </Link>
        </Button>
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            トップページへ
          </Link>
        </Button>
      </div>
    </div>
  )
}
