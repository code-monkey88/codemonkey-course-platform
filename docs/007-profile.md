# 007: プロフィール機能

## 概要
ユーザープロフィールの表示・編集機能。認証必須。

## 完了条件
- プロフィール情報が表示される
- 表示名を編集できる
- アバター画像をアップロードできる
- 自己紹介を編集できる
- 変更が保存される

---

## Todo

### プロフィール表示ページ
- [x] `app/(dashboard)/profile/page.tsx` 作成
- [x] 認証チェック
- [x] プロフィールデータ取得
- [x] アバター画像表示
- [x] 表示名表示
- [x] メールアドレス表示
- [x] 自己紹介表示
- [x] 編集ページへのリンク

### プロフィール編集ページ
- [x] `app/(dashboard)/profile/edit/page.tsx` 作成
- [x] 編集フォーム（Client Component）
- [x] 現在の値をフォームに初期表示
- [x] 保存ボタン
- [x] キャンセルボタン（プロフィールページへ戻る）

### 編集フォームコンポーネント
- [x] `components/profile-edit-form.tsx` 作成
- [x] 表示名入力フィールド
- [x] 自己紹介テキストエリア
- [x] バリデーション
  - [x] 表示名: 必須、1-50文字
  - [x] 自己紹介: 任意、最大500文字
- [x] エラー表示

### アバターアップロード
- [x] `components/avatar-upload.tsx` 作成
- [x] 現在のアバター表示
- [x] ファイル選択ボタン
- [x] プレビュー表示
- [x] Supabase Storage へアップロード
- [x] 対応形式: JPEG, PNG, WebP
- [x] 最大サイズ: 2MB
- [x] アップロード中のローディング表示

### Server Actions
- [x] `app/(dashboard)/profile/actions.ts` 作成
- [x] `updateProfile` - プロフィール更新
- [x] `uploadAvatar` - アバターアップロード

### Supabase Storage 設定
- [x] `avatars` バケット作成
- [ ] バケットポリシー設定（認証ユーザーのみアップロード可）※ダッシュボードから設定が必要
- [x] 古いアバターの削除処理（upsertで上書き）

### フィードバック
- [x] 保存成功時の Toast 通知
- [x] 保存失敗時のエラー表示
- [x] 保存後にプロフィールページへリダイレクト

---

## 画面構成

### プロフィール表示ページ
```
┌─────────────────────────────────────┐
│           ヘッダー                    │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────┐                  │
│        │ Avatar  │                  │
│        │  (96px) │                  │
│        └─────────┘                  │
│                                     │
│        山田 太郎                      │
│        yamada@example.com           │
│                                     │
│        ──────────────               │
│        自己紹介文がここに             │
│        表示されます...                │
│        ──────────────               │
│                                     │
│        [プロフィールを編集]           │
│                                     │
└─────────────────────────────────────┘
```

### プロフィール編集ページ
```
┌─────────────────────────────────────┐
│           ヘッダー                    │
├─────────────────────────────────────┤
│                                     │
│  プロフィール編集                     │
│                                     │
│        ┌─────────┐                  │
│        │ Avatar  │ [変更]           │
│        └─────────┘                  │
│                                     │
│  表示名 *                            │
│  ┌─────────────────────────────┐    │
│  │ 山田 太郎                    │    │
│  └─────────────────────────────┘    │
│                                     │
│  自己紹介                            │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│  0/500文字                          │
│                                     │
│  [キャンセル]  [保存]                │
│                                     │
└─────────────────────────────────────┘
```

---

## 参考コード

### プロフィール更新 Server Action
```typescript
// app/(dashboard)/profile/actions.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const displayName = formData.get('displayName') as string
  const bio = formData.get('bio') as string

  // バリデーション
  if (!displayName || displayName.length > 50) {
    throw new Error('表示名は1-50文字で入力してください')
  }

  if (bio && bio.length > 500) {
    throw new Error('自己紹介は500文字以内で入力してください')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      bio: bio || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) throw error

  revalidatePath('/profile')
  redirect('/profile')
}
```

### アバターアップロード
```typescript
export async function uploadAvatar(formData: FormData) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('avatar') as File
  if (!file) throw new Error('ファイルが選択されていません')

  // ファイルサイズチェック (2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('ファイルサイズは2MB以下にしてください')
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/avatar.${fileExt}`

  // アップロード
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError

  // 公開URLを取得
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  // プロフィール更新
  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  revalidatePath('/profile')
}
```
