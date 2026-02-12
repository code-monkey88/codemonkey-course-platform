import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { UserMenu } from './user-menu'
import { SearchBar } from '@/components/search-bar'
import { Code2, BookOpen, Sparkles } from 'lucide-react'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, role, email')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/30">
            <Code2 className="h-4.5 w-4.5" />
          </div>
          <span className="hidden bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text font-bold text-transparent sm:inline-block">
            Vibe Coding Platform
          </span>
        </Link>

        {/* Navigation */}
        <nav className="ml-8 hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <BookOpen className="h-4 w-4 text-blue-500 opacity-70 transition-opacity group-hover:opacity-100" />
            講座一覧
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <Sparkles className="h-4 w-4 text-violet-500 opacity-70 transition-opacity group-hover:opacity-100" />
              マイページ
            </Link>
          )}
        </nav>

        {/* Search + Auth Section */}
        <div className="ml-auto flex items-center gap-3">
          {/* Search Bar */}
          <Suspense fallback={null}>
            <SearchBar className="hidden md:flex" />
          </Suspense>

          {user && profile ? (
            <UserMenu profile={profile} />
          ) : (
            <Button
              asChild
              size="sm"
              className="gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              <Link href="/login">ログイン</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="container border-t border-border/40 px-4 py-2 md:hidden">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
    </header>
  )
}
