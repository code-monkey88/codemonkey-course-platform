'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, User, ExternalLink, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AdminSidebar } from './sidebar'

type AdminHeaderProps = {
  profile: {
    display_name: string
    email: string
    avatar_url: string | null
  }
}

export function AdminHeader({ profile }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = profile.display_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={profile.avatar_url || undefined}
                alt={profile.display_name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-xs text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">
              {profile.display_name}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{profile.display_name}</p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              プロフィール
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/" className="cursor-pointer">
              <ExternalLink className="mr-2 h-4 w-4" />
              サイトへ戻る
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
