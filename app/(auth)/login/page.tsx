import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginButton } from './login-button'
import { Code2 } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const params = await searchParams
  const error = params.error
  const next = params.next

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">AI Programming</span>
        </div>

        <div className="space-y-6">
          <blockquote className="text-2xl font-medium leading-relaxed text-white/90">
            &ldquo;AIプログラミングの世界へようこそ。
            <br />
            一緒に学び、成長しましょう。&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm" />
            <div className="text-white/80">
              <p className="font-medium text-white">講師チーム</p>
              <p className="text-sm">AIプログラミング学習プラットフォーム</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full ${i === 0 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              <Code2 className="h-7 w-7" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              おかえりなさい
            </h1>
            <p className="mt-3 text-muted-foreground">
              Googleアカウントでログインして学習を始めましょう
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm text-destructive">
              ログインに失敗しました。もう一度お試しください。
            </div>
          )}

          <div className="space-y-4">
            <LoginButton next={next} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground">
                  または
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              アカウントをお持ちでない方も
              <br />
              Googleでログインするだけで自動的に登録されます
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            ログインすることで、
            <a href="#" className="underline underline-offset-4 hover:text-foreground">
              利用規約
            </a>
            と
            <a href="#" className="underline underline-offset-4 hover:text-foreground">
              プライバシーポリシー
            </a>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  )
}
