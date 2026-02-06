import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentProfile } from '@/lib/supabase/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarUpload } from '@/components/avatar-upload'
import { ProfileEditForm } from '@/components/profile-edit-form'
import { ArrowLeft } from 'lucide-react'
import { updateProfile, uploadAvatar } from '../actions'

export default async function ProfileEditPage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="container max-w-2xl py-8">
        {/* Back link */}
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          プロフィールに戻る
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>プロフィール編集</CardTitle>
            <CardDescription>
              あなたのプロフィール情報を更新します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center border-b pb-8">
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                displayName={profile.display_name}
                onUpload={uploadAvatar}
              />
            </div>

            {/* Profile Form */}
            <ProfileEditForm
              initialDisplayName={profile.display_name}
              initialBio={profile.bio}
              onSubmit={updateProfile}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
