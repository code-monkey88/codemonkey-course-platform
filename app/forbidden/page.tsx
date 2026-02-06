import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 blur-2xl" />

        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-xl shadow-red-500/30">
          <ShieldX className="h-12 w-12" />
        </div>
      </div>

      <h1 className="mt-8 text-7xl font-bold tracking-tight text-foreground/10">403</h1>

      <h2 className="mt-4 text-2xl font-semibold">アクセスが拒否されました</h2>

      <p className="mt-3 max-w-md text-center text-muted-foreground">
        このページにアクセスする権限がありません。
        <br />
        管理者にお問い合わせください。
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
            トップページへ
          </Link>
        </Button>
      </div>
    </div>
  )
}
