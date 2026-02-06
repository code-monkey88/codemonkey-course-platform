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
import { Badge } from '@/components/ui/badge'
import { LogOut, User, LayoutDashboard, Settings, Shield, ChevronDown } from 'lucide-react'
type UserMenuProfile = {
  id: string
  display_name: string
  avatar_url: string | null
  role: string
  email: string
}

type UserMenuProps = {
  profile: UserMenuProfile
}

export function UserMenu({ profile }: UserMenuProps) {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 rounded-full p-0.5 pr-2 transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2">
          <Avatar className="h-8 w-8 ring-2 ring-background shadow-md">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-medium text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-xl">
        <DropdownMenuLabel className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-medium text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{profile.display_name}</p>
                {profile.role === 'admin' && (
                  <Badge className="h-5 gap-0.5 bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 text-[10px]">
                    <Shield className="h-2.5 w-2.5" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <LayoutDashboard className="h-4 w-4 text-blue-500" />
            </div>
            <span className="font-medium">ダッシュボード</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5">
          <Link href="/profile" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <User className="h-4 w-4 text-violet-500" />
            </div>
            <span className="font-medium">プロフィール</span>
          </Link>
        </DropdownMenuItem>
        {profile.role === 'admin' && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Settings className="h-4 w-4 text-amber-500" />
                </div>
                <span className="font-medium">管理画面</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-lg py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-medium">ログアウト</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
