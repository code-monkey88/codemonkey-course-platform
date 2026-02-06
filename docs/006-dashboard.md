# 006: ダッシュボード

## 概要
ユーザーの学習進捗を可視化するダッシュボードページ。認証必須。

## 完了条件
- 総視聴動画数が表示される
- 講座別の進捗率が表示される
- 最近視聴した動画一覧が表示される
- 各講座への導線がある

---

## Todo

### ページ実装
- [x] `app/(dashboard)/dashboard/page.tsx` 作成
- [x] 認証チェック（未認証はログインページへ）
- [x] ユーザーの進捗データを取得
- [x] ローディング状態を実装（`loading.tsx`）

### 統計カード
- [x] `components/stats-card.tsx` 作成（ページ内で直接実装）
- [x] 総視聴動画数
- [x] 完了した講座数
- [x] 総学習時間（オプション）

### 講座別進捗
- [x] `components/course-progress-card.tsx` 作成（ページ内で直接実装）
- [x] 各講座のタイトル表示
- [x] 進捗バー表示
- [x] 完了数 / 総数 表示
- [x] 講座詳細ページへのリンク
- [x] 「続きを見る」ボタン（最後に視聴した動画へ）

### 最近の視聴履歴
- [x] `components/recent-videos.tsx` 作成（ページ内で直接実装）
- [x] 最近完了した動画一覧（最大5件）
- [x] 動画タイトル
- [x] 所属講座名
- [x] 完了日時
- [x] 動画ページへのリンク

### ウェルカムメッセージ
- [x] ユーザー名を表示した挨拶
- [x] 学習を始める導線（進捗がない場合）

---

## 画面構成

```
┌─────────────────────────────────────┐
│           ヘッダー                    │
├─────────────────────────────────────┤
│                                     │
│  こんにちは、〇〇さん！                │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ 視聴済み │ │ 完了講座 │ │ 学習時間 │ │
│  │   12本  │ │   1講座  │ │  5.2h   │ │
│  └─────────┘ └─────────┘ └─────────┘ │
│                                     │
├─────────────────────────────────────┤
│  講座別進捗                          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 初級講座           ████████░░ 80%││
│  │ 8/10本完了         [続きを見る]  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 中級講座           ████░░░░░░ 40%││
│  │ 4/10本完了         [続きを見る]  ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  最近視聴した動画                     │
│                                     │
│  • 環境構築の方法 (初級講座) - 1時間前 │
│  • 基本操作 (初級講座) - 昨日          │
│  • 応用テクニック (中級講座) - 3日前   │
│                                     │
└─────────────────────────────────────┘
```

---

## 参考コード

### ダッシュボードデータ取得
```typescript
// app/(dashboard)/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // プロフィール取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 進捗データ取得
  const { data: progress } = await supabase
    .from('user_progress')
    .select(`
      *,
      videos (
        *,
        sections (
          *,
          courses (*)
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('completed_at', { ascending: false })

  // 全講座取得（進捗計算用）
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      sections (
        videos (id)
      )
    `)
    .order('order_index')

  return (
    <main>
      {/* ダッシュボード表示 */}
    </main>
  )
}
```

### 進捗率計算ユーティリティ
```typescript
// lib/utils.ts
export function calculateProgress(
  totalVideos: number,
  completedVideos: number
): number {
  if (totalVideos === 0) return 0
  return Math.round((completedVideos / totalVideos) * 100)
}
```
