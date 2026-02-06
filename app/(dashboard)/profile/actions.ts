'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const displayName = formData.get('displayName') as string
  const bio = formData.get('bio') as string

  // バリデーション
  if (!displayName || displayName.trim().length === 0) {
    return { error: '表示名を入力してください' }
  }

  if (displayName.length > 50) {
    return { error: '表示名は50文字以内で入力してください' }
  }

  if (bio && bio.length > 500) {
    return { error: '自己紹介は500文字以内で入力してください' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName.trim(),
      bio: bio?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: '更新に失敗しました' }
  }

  revalidatePath('/profile')
  redirect('/profile')
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) {
    return { error: 'ファイルが選択されていません' }
  }

  // ファイル形式チェック
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { error: 'JPEG、PNG、WebP形式のみ対応しています' }
  }

  // ファイルサイズチェック (2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: 'ファイルサイズは2MB以下にしてください' }
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${user.id}/avatar.${fileExt}`

  // アップロード
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { error: 'アップロードに失敗しました' }
  }

  // 公開URLを取得
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath)

  // プロフィール更新
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      avatar_url: `${publicUrl}?t=${Date.now()}`, // キャッシュ回避
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) {
    return { error: 'プロフィールの更新に失敗しました' }
  }

  revalidatePath('/profile')
  return { success: true, url: publicUrl }
}
