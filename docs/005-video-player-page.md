# 005: 動画視聴ページ

## 概要
YouTube動画を埋め込んで視聴できるページ。進捗マーク機能を提供する。

## 完了条件
- YouTube動画が埋め込みプレイヤーで再生できる
- 動画タイトル・説明が表示される
- 認証済みユーザーは「完了」ボタンで進捗をマークできる
- 前後の動画へのナビゲーションがある
- `is_preview=false` の動画は認証必須

---

## Todo

### アクセス制御
- [x] `is_preview=false` かつ未認証の場合はログインページへリダイレクト
- [x] 存在しない動画は `notFound()` を返す

### ページ実装
- [x] `app/courses/[courseId]/videos/[videoId]/page.tsx` 作成
- [x] 動画データを取得
- [x] 所属講座・セクション情報も取得
- [x] ローディング状態を実装（`loading.tsx`）

### YouTube プレイヤー
- [x] `components/video-player.tsx` 作成
- [x] YouTube URL から動画IDを抽出するユーティリティ
- [x] iframe 埋め込み（レスポンシブ対応）
- [x] アスペクト比 16:9 を維持

### 動画情報表示
- [x] 動画タイトル
- [x] 動画説明
- [x] 所属セクション名
- [x] 所属講座名（リンク付き）

### 進捗マーク機能
- [x] 「完了としてマーク」ボタン（Client Component）
- [x] Server Action で進捗を更新
- [x] 完了済みの場合は「完了済み」表示
- [x] 完了/未完了をトグルできる
- [x] 操作後に Toast 通知

### ナビゲーション
- [x] 前の動画へボタン（最初の動画では非表示）
- [x] 次の動画へボタン（最後の動画では非表示）
- [x] 講座詳細ページへ戻るリンク
- [x] パンくずリスト

### サイドバー（デスクトップ）
- [x] 同一講座内の動画一覧
- [x] 現在視聴中の動画をハイライト
- [x] 完了状態の表示

---

## 画面構成

```
┌─────────────────────────────────────────────────┐
│ ヘッダー                                         │
├─────────────────────────────────────────────────┤
│ パンくず: ホーム > 講座名 > セクション名 > 動画名  │
├───────────────────────────────┬─────────────────┤
│                               │                 │
│  ┌─────────────────────────┐  │  動画一覧        │
│  │                         │  │  ├─ ✓ 動画1     │
│  │    YouTube Player       │  │  ├─ ● 動画2     │
│  │       (16:9)            │  │  ├─ ○ 動画3     │
│  │                         │  │  └─ ○ 動画4     │
│  └─────────────────────────┘  │                 │
│                               │                 │
│  動画タイトル                  │                 │
│  動画の説明文...               │                 │
│                               │                 │
│  [← 前の動画] [完了] [次の動画 →] │                 │
│                               │                 │
└───────────────────────────────┴─────────────────┘

● = 現在視聴中
✓ = 完了済み
○ = 未完了
```

---

## 参考コード

### YouTube動画ID抽出
```typescript
// lib/utils.ts
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}
```

### 進捗マーク Server Action
```typescript
// app/courses/[courseId]/videos/[videoId]/actions.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleVideoProgress(videoId: string, completed: boolean) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  if (completed) {
    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        completed: true,
        completed_at: new Date().toISOString(),
      })
  } else {
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('video_id', videoId)
  }

  revalidatePath(`/courses/[courseId]/videos/${videoId}`)
}
```

### YouTube埋め込みコンポーネント
```typescript
// components/video-player.tsx
import { extractYouTubeId } from '@/lib/utils'

export function VideoPlayer({ youtubeUrl }: { youtubeUrl: string }) {
  const videoId = extractYouTubeId(youtubeUrl)

  if (!videoId) return <div>動画を読み込めません</div>

  return (
    <div className="relative aspect-video">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
```
