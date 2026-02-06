# 008: 管理画面レイアウト

## 概要
管理者専用の画面レイアウトとアクセス制御を実装する。

## 完了条件
- admin ロールのユーザーのみアクセスできる
- 管理画面専用のレイアウトが適用される
- サイドバーナビゲーションがある
- 非管理者は403エラーページが表示される

---

## Todo

### アクセス制御
- [x] `app/(admin)/layout.tsx` で管理者チェック
- [x] 未認証の場合はログインページへリダイレクト
- [x] 認証済みだが admin でない場合は 403 ページ表示（/forbiddenへリダイレクト）
- [x] 403ページは既存の`app/forbidden/page.tsx`を使用

### 管理画面レイアウト
- [x] `app/(admin)/layout.tsx` 作成
- [x] サイドバー + メインコンテンツの2カラムレイアウト
- [x] レスポンシブ対応（モバイルはハンバーガーメニュー）

### サイドバーナビゲーション
- [x] `components/admin/sidebar.tsx` 作成
- [x] ロゴ / サービス名
- [x] ナビゲーションリンク
  - [x] ダッシュボード（`/admin`）
  - [x] 講座管理（`/admin/courses`）
- [x] 現在のページをハイライト
- [x] サイトへ戻るリンク

### 管理画面ヘッダー
- [x] `components/admin/header.tsx` 作成
- [x] ページタイトル表示
- [x] ユーザー情報表示
- [x] ログアウトボタン

### 管理画面トップ
- [x] `app/(admin)/admin/page.tsx` 作成
- [x] 講座数、セクション数、動画数の統計表示
- [x] 最近追加された動画一覧
- [x] クイックアクションリンク

---

## 画面構成

```
┌─────────────────────────────────────────────────┐
│ 管理画面                          [ユーザー] [▼]│
├─────────────┬───────────────────────────────────┤
│             │                                   │
│  管理メニュー│   メインコンテンツ                 │
│             │                                   │
│  ■ 概要     │   統計                            │
│  □ 講座管理 │   ┌───────┐ ┌───────┐ ┌───────┐  │
│             │   │講座: 3│ │ｾｸｼｮﾝ:12│ │動画:42│  │
│             │   └───────┘ └───────┘ └───────┘  │
│             │                                   │
│  ──────────│   最近の動画                       │
│  サイトへ戻る│   • 動画A - 2時間前                │
│             │   • 動画B - 昨日                   │
│             │                                   │
└─────────────┴───────────────────────────────────┘
```

---

## 参考コード

### 管理者チェック レイアウト
```typescript
// app/(admin)/layout.tsx
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/admin/forbidden')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

### 403 ページ
```typescript
// app/(admin)/forbidden/page.tsx
import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">403</h1>
      <p className="mt-2 text-gray-600">
        このページにアクセスする権限がありません
      </p>
      <Link href="/" className="mt-4 text-blue-600 hover:underline">
        トップページへ戻る
      </Link>
    </div>
  )
}
```
