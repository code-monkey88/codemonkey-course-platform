# 003: トップページ（講座一覧）

## 概要
トップページに講座一覧を表示する。未認証ユーザーも閲覧可能。

## 完了条件
- 全講座がカード形式で表示される
- 講座のサムネイル、タイトル、説明、レベルが表示される
- 講座カードをクリックすると講座詳細ページへ遷移する
- レスポンシブデザインで表示される

---

## Todo

### ページ実装
- [x] `app/page.tsx` をトップページとして実装
- [x] 講座データをServer Componentで取得
- [x] ローディング状態を実装（`loading.tsx`）
- [x] エラー状態を実装（`error.tsx`）

### 講座カードコンポーネント
- [x] `components/course-card.tsx` 作成
- [x] サムネイル画像表示（`next/image`使用）
- [x] 講座タイトル表示
- [x] 講座説明（truncate）
- [x] レベルバッジ表示（初級/中級/上級）
- [x] ホバーエフェクト
- [x] 講座詳細ページへのリンク

### レベルバッジコンポーネント
- [x] `components/level-badge.tsx` 作成
- [x] レベルに応じた色分け
  - [x] 初級（beginner）: グリーン系
  - [x] 中級（intermediate）: ブルー系
  - [x] 上級（advanced）: パープル系

### レイアウト
- [x] ヒーローセクション（サービス紹介）
- [x] 講座一覧グリッドレイアウト
- [x] モバイル: 1列
- [x] タブレット: 2列
- [x] デスクトップ: 3列

### データ取得
- [x] 講座一覧を取得するクエリ作成
- [x] `order_index` 順でソート
- [x] 必要なフィールドのみ選択

---

## 画面構成

```
┌─────────────────────────────────────┐
│           ヘッダー                    │
├─────────────────────────────────────┤
│                                     │
│     ヒーローセクション                 │
│     「AIプログラミングを学ぼう」        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ 講座1   │ │ 講座2   │ │ 講座3   │ │
│  │ [初級]  │ │ [中級]  │ │ [上級]  │ │
│  └─────────┘ └─────────┘ └─────────┘ │
│                                     │
├─────────────────────────────────────┤
│           フッター                    │
└─────────────────────────────────────┘
```

---

## 参考コード

### 講座一覧取得
```typescript
// app/page.tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createServerClient()

  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, description, level, thumbnail_url, order_index')
    .order('order_index')

  if (error) throw error

  return (
    <main>
      {/* ヒーローセクション */}
      {/* 講座一覧 */}
    </main>
  )
}
```
