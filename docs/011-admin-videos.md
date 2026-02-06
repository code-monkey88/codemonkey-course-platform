# 011: 動画管理（CRUD）

## 概要
管理画面でセクション内の動画の作成・編集・削除・並び替えを行う機能。

## 完了条件
- セクション内の動画一覧が表示される
- 新規動画を作成できる
- 既存動画を編集できる
- 動画を削除できる
- 動画の並び順を変更できる
- プレビュー設定（is_preview）を変更できる

---

## Todo

### 動画一覧ページ
- [x] `app/(admin)/admin/courses/[courseId]/sections/[sectionId]/page.tsx` で動画一覧を表示（セクション詳細ページに統合）
- [x] 講座・セクション情報をヘッダーに表示
- [x] 動画一覧をカード形式で表示
- [x] 各動画に編集・削除ボタン
- [x] 新規動画作成ボタン
- [x] 並び替えUI（上下ボタン）

### 動画一覧コンポーネント
- [x] `components/admin/videos-list.tsx` 作成
- [x] カラム: 順序、タイトル、YouTube URL、時間、プレビュー、操作
- [x] プレビューバッジ表示
- [x] order_index順でソート

### 新規動画作成
- [x] `app/(admin)/admin/courses/[courseId]/sections/[sectionId]/videos/new/page.tsx` 作成
- [x] 入力項目:
  - [x] タイトル（必須）
  - [x] 説明
  - [x] YouTube URL（必須）
  - [x] 動画時間（秒、オプション）
  - [x] プレビュー設定（チェックボックス）
- [x] YouTube URLのバリデーション
- [x] 作成後にリストを更新

### 動画編集
- [x] `app/(admin)/admin/courses/[courseId]/sections/[sectionId]/videos/[videoId]/edit/page.tsx` 作成
- [x] 既存データを初期表示
- [x] 更新処理

### 動画削除
- [x] 削除確認ダイアログ（AlertDialog）
- [x] 削除処理

### プレビュー設定
- [x] トグルスイッチで即時変更
- [x] 未認証ユーザーが視聴可能かどうかを制御

### 並び替え機能
- [x] 上下ボタンで並び替え
- [x] 並び替え後に order_index を一括更新

### Server Actions
- [x] `app/(admin)/admin/courses/[courseId]/sections/[sectionId]/videos/actions.ts` 作成
- [x] `createVideo` - 動画作成
- [x] `updateVideo` - 動画更新
- [x] `deleteVideo` - 動画削除
- [x] `togglePreview` - プレビュー設定変更
- [x] `reorderVideos` - 並び替え

### フォームコンポーネント
- [x] `components/admin/video-form.tsx` 作成
- [x] YouTube URLのプレビュー表示機能

### ナビゲーション
- [x] パンくずリスト（講座一覧 > 講座名 > セクション名）
- [x] 講座へ戻るリンク

---

## 画面構成

```
┌─────────────────────────────────────────────────┐
│ ... > 初級講座 > はじめに > 動画管理             │
├─────────────────────────────────────────────────┤
│                                                 │
│  「はじめに」の動画               [+ 新規作成]   │
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ ≡ 1. イントロダクション                      ││
│  │   https://youtu.be/xxxxx                    ││
│  │   5:30  [プレビュー ✓]                      ││
│  │   [編集] [削除]                              ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ ≡ 2. 環境構築の説明                          ││
│  │   https://youtu.be/yyyyy                    ││
│  │   12:45  [プレビュー ○]                     ││
│  │   [編集] [削除]                              ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ ≡ 3. 実際にインストール                      ││
│  │   https://youtu.be/zzzzz                    ││
│  │   8:20  [プレビュー ○]                      ││
│  │   [編集] [削除]                              ││
│  └─────────────────────────────────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘

✓ = プレビュー有効（未認証視聴可）
○ = プレビュー無効（認証必須）
```

### 動画作成/編集フォーム
```
┌─────────────────────────────────────────────────┐
│ 新規動画追加                              [×]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  タイトル *                                      │
│  ┌───────────────────────────────────────────┐  │
│  │ イントロダクション                         │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  YouTube URL *                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ https://www.youtube.com/watch?v=xxxxx     │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │         [YouTube プレビュー]              │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  説明                                           │
│  ┌───────────────────────────────────────────┐  │
│  │ この動画では...                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  動画時間（秒）                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ 330                                       │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ☑ プレビューとして公開（未認証でも視聴可能）    │
│                                                 │
│  [キャンセル]                        [保存]      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 参考コード

### 動画作成 Server Action
```typescript
// app/(admin)/admin/courses/[courseId]/sections/[sectionId]/videos/actions.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { extractYouTubeId } from '@/lib/utils'

export async function createVideo(
  sectionId: string,
  courseId: string,
  formData: FormData
) {
  const supabase = await createServerClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const youtubeUrl = formData.get('youtubeUrl') as string
  const duration = formData.get('duration') as string
  const isPreview = formData.get('isPreview') === 'on'

  // バリデーション
  if (!title) throw new Error('タイトルは必須です')
  if (!youtubeUrl) throw new Error('YouTube URLは必須です')

  const youtubeId = extractYouTubeId(youtubeUrl)
  if (!youtubeId) throw new Error('無効なYouTube URLです')

  // 現在の最大order_indexを取得
  const { data: maxOrder } = await supabase
    .from('videos')
    .select('order_index')
    .eq('section_id', sectionId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const orderIndex = (maxOrder?.order_index ?? 0) + 1

  const { error } = await supabase
    .from('videos')
    .insert({
      section_id: sectionId,
      title,
      description: description || null,
      youtube_url: youtubeUrl,
      duration: duration ? parseInt(duration, 10) : null,
      is_preview: isPreview,
      order_index: orderIndex,
    })

  if (error) throw error

  revalidatePath(`/admin/courses/${courseId}/sections/${sectionId}/videos`)
}

export async function togglePreview(
  videoId: string,
  courseId: string,
  sectionId: string,
  isPreview: boolean
) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('videos')
    .update({ is_preview: isPreview })
    .eq('id', videoId)

  if (error) throw error

  revalidatePath(`/admin/courses/${courseId}/sections/${sectionId}/videos`)
}
```

### 動画時間フォーマット
```typescript
// lib/utils.ts
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function parseDuration(formatted: string): number {
  const parts = formatted.split(':')
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
  }
  return parseInt(formatted, 10)
}
```
