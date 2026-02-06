'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  ExternalLink,
  Code2,
} from 'lucide-react'

const navItems = [
  {
    title: 'ダッシュボード',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '講座管理',
    href: '/admin/courses',
    icon: BookOpen,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="font-semibold">管理画面</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-500/10 text-blue-600'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            サイトへ戻る
          </Link>
        </div>
      </div>
    </aside>
  )
}
