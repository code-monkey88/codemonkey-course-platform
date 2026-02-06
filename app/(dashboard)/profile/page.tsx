import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentProfile } from '@/lib/supabase/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, Calendar, Edit, Shield } from 'lucide-react'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  const initials = profile.display_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-'

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="container max-w-4xl py-8">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600" />

          <CardContent className="relative pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-3xl text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end pt-4">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/profile/edit">
                  <Edit className="h-4 w-4" />
                  プロフィールを編集
                </Link>
              </Button>
            </div>

            {/* Profile Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{profile.display_name}</h1>
                {profile.role === 'admin' && (
                  <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500">
                    <Shield className="h-3 w-3" />
                    管理者
                  </Badge>
                )}
              </div>

              {profile.bio && (
                <p className="max-w-2xl text-muted-foreground">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {joinDate}から利用
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">アカウント情報</CardTitle>
              <CardDescription>ログイン情報とアカウント設定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">メールアドレス</span>
                <span className="text-sm font-medium">{profile.email}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ログイン方法</span>
                <Badge variant="secondary">Google</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">アカウント種別</span>
                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                  {profile.role === 'admin' ? '管理者' : '一般ユーザー'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">学習統計</CardTitle>
              <CardDescription>あなたの学習の記録</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">完了した動画</span>
                <span className="text-sm font-medium">0 本</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">完了した講座</span>
                <span className="text-sm font-medium">0 講座</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">総学習時間</span>
                <span className="text-sm font-medium">0 時間</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">クイックリンク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Button asChild variant="outline" className="h-auto py-4">
                <Link href="/dashboard" className="flex flex-col items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span>ダッシュボード</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4">
                <Link href="/" className="flex flex-col items-center gap-2">
                  <span className="text-lg">📚</span>
                  <span>講座一覧</span>
                </Link>
              </Button>
              {profile.role === 'admin' && (
                <Button asChild variant="outline" className="h-auto py-4">
                  <Link href="/admin" className="flex flex-col items-center gap-2">
                    <span className="text-lg">⚙️</span>
                    <span>管理画面</span>
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
