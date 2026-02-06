# 004: 講座詳細ページ

## 概要
講座詳細ページにセクション一覧と動画一覧を表示する。未認証ユーザーも閲覧可能。

## 完了条件
- 講座の詳細情報が表示される
- セクションがアコーディオン形式で表示される
- 各セクション内に動画一覧が表示される
- 認証済みユーザーには進捗状況が表示される
- 動画をクリックすると動画視聴ページへ遷移する

---

## Todo

### ページ実装
- [x] `app/courses/[courseId]/page.tsx` 作成
- [x] 講座データを取得（セクション・動画を含む）
- [x] 存在しない講座は `notFound()` を返す
- [x] ローディング状態を実装（`loading.tsx`）
- [x] エラー状態を実装（`error.tsx`）

### 講座ヘッダー
- [x] 講座タイトル表示
- [x] 講座説明表示
- [x] レベルバッジ表示
- [x] 総動画数表示
- [x] 認証済み: 進捗率表示

### セクションアコーディオン
- [x] `components/section-accordion.tsx` 作成
- [x] shadcn/ui の Accordion を使用
- [x] セクションタイトル表示
- [x] セクション説明表示
- [x] セクション内の動画数表示
- [x] 認証済み: セクション別進捗表示

### 動画リストアイテム
- [x] `components/video-list-item.tsx` 作成
- [x] 動画タイトル表示
- [x] 動画時間表示（オプション）
- [x] プレビューバッジ（`is_preview=true` の場合）
- [x] 認証済み: 完了チェックマーク表示
- [x] 動画視聴ページへのリンク
- [x] ホバーエフェクト

### 進捗表示コンポーネント
- [x] `components/course-progress.tsx` 作成
- [x] 進捗バー表示
- [x] 完了数 / 総数 表示
- [x] パーセンテージ表示

### データ取得
- [x] 講座詳細を取得（セクション・動画をネストして取得）
- [x] 認証済みユーザーの進捗データを取得
- [x] 進捗率を計算するユーティリティ関数作成

---

## 画面構成

```
┌─────────────────────────────────────┐
│           ヘッダー                    │
├─────────────────────────────────────┤
│                                     │
│  講座タイトル              [初級]     │
│  講座の説明文がここに表示される...     │
│                                     │
│  動画数: 12本  進捗: ████░░ 67%     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ▼ セクション1: はじめに (3/4完了)    │
│  ├─ ✓ 動画1: イントロダクション       │
│  ├─ ✓ 動画2: 環境構築               │
│  ├─ ✓ 動画3: 基本操作               │
│  └─ ○ 動画4: まとめ                 │
│                                     │
│  ▶ セクション2: 基礎編 (0/5完了)      │
│                                     │
│  ▶ セクション3: 応用編 (0/3完了)      │
│                                     │
└─────────────────────────────────────┘
```

---

## 参考コード

### 講座詳細取得（セクション・動画含む）
```typescript
// app/courses/[courseId]/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string }
}) {
  const supabase = await createServerClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      sections (
        *,
        videos (*)
      )
    `)
    .eq('id', params.courseId)
    .order('order_index', { referencedTable: 'sections' })
    .order('order_index', { referencedTable: 'sections.videos' })
    .single()

  if (error || !course) {
    notFound()
  }

  // 認証済みの場合は進捗も取得
  const { data: { user } } = await supabase.auth.getUser()

  let progress = []
  if (user) {
    const { data } = await supabase
      .from('user_progress')
      .select('video_id, completed')
      .eq('user_id', user.id)

    progress = data ?? []
  }

  return (
    <main>
      {/* 講座詳細表示 */}
    </main>
  )
}
```
