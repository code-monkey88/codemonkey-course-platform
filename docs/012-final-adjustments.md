# 012: 最終調整・デプロイ

## 概要
エラーハンドリング、ローディング状態、バリデーション、パフォーマンス最適化を行い、Vercelにデプロイする。

## 完了条件
- 全ページでエラー状態が適切に処理される
- ローディング状態が表示される
- 入力バリデーションが機能する
- パフォーマンスが最適化されている
- Vercelにデプロイされ、本番環境で動作する

---

## Todo

### エラーハンドリング
- [x] `app/error.tsx` - グローバルエラーページ
- [x] `app/not-found.tsx` - 404ページ
- [x] `app/courses/[courseId]/error.tsx` - 講座エラーページ
- [x] API エラーの適切な表示
- [x] ネットワークエラーの処理
- [x] トースト通知でのエラー表示（sonner）

### ローディング状態
- [x] `app/loading.tsx` - グローバルローディング
- [x] 各主要ページに `loading.tsx` を配置
  - [x] `/courses/[courseId]/loading.tsx`
  - [x] `/courses/[courseId]/videos/[videoId]/loading.tsx`
  - [x] `/dashboard/loading.tsx`
  - [x] `/admin/loading.tsx`
  - [x] `/admin/courses/loading.tsx`
  - [x] `/admin/courses/[courseId]/loading.tsx`
- [x] スケルトンUIコンポーネント（Skeleton）
- [x] ボタンのローディング状態（disabled + spinner）
- [x] フォーム送信中のローディング表示（useActionState）

### バリデーション
- [x] フォームバリデーションの統一（Server Actions）
- [x] サーバーサイドバリデーション
- [x] エラーメッセージの日本語化
- [x] 必須フィールドの明示（*マーク）

### パフォーマンス最適化
- [x] 画像の最適化（next/image の適切な使用）
- [x] Supabase クエリの最適化（必要なフィールドのみ select）
- [x] メタデータの設定（SEO）

### アクセシビリティ
- [x] キーボードナビゲーション対応（shadcn/ui）
- [x] フォーカス管理
- [x] ARIA ラベルの追加（sr-only）

### レスポンシブデザイン最終確認
- [x] モバイル表示の確認・調整
- [x] タブレット表示の確認・調整
- [x] デスクトップ表示の確認・調整
- [x] ヘッダーメニューのモバイル対応（Sheet）

### セキュリティ確認
- [x] RLS ポリシーの動作確認
- [x] 認証ガードの動作確認（middleware）
- [x] 管理者権限の動作確認（layout.tsx）
- [x] 環境変数の確認

### デプロイ準備
- [x] 環境変数の整理
- [x] ビルドエラーの解消（`npm run build`）
- [x] Lint エラーの解消（`npm run lint`）
- [x] TypeScript エラーの解消

### Vercel デプロイ
- [x] Vercel プロジェクト作成
- [x] GitHub リポジトリ連携
- [ ] 環境変数設定
  - [x] `NEXT_PUBLIC_SUPABASE_URL`
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] デプロイ実行
- [ ] 本番環境での動作確認

### Supabase 本番設定
- [ ] Supabase で本番 URL を許可リストに追加
- [ ] Google OAuth のリダイレクト URI に本番 URL を追加
- [ ] RLS ポリシーの本番環境での確認

### 最終テスト
- [ ] Google 認証ログイン・ログアウト
- [ ] 講座一覧・詳細の表示
- [ ] 動画視聴（プレビュー・認証後）
- [ ] 進捗マーク機能
- [ ] ダッシュボードの進捗表示
- [ ] プロフィール編集
- [ ] 管理画面の全機能
- [ ] モバイルでの全機能確認

---

## エラーページテンプレート

### グローバルエラーページ
```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">エラーが発生しました</h1>
      <p className="mt-2 text-gray-600">
        申し訳ありませんが、問題が発生しました。
      </p>
      <Button onClick={reset} className="mt-4">
        もう一度試す
      </Button>
    </div>
  )
}
```

### 404ページ
```typescript
// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-2 text-xl text-gray-600">
        ページが見つかりませんでした
      </p>
      <Button asChild className="mt-4">
        <Link href="/">トップページへ戻る</Link>
      </Button>
    </div>
  )
}
```

### ローディングスケルトン
```typescript
// components/skeleton-card.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="mt-4 h-6 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </div>
  )
}
```

---

## デプロイチェックリスト

```
□ npm run build が成功する
□ npm run lint がエラーなし
□ 全ての TypeScript エラーが解消
□ 環境変数が Vercel に設定済み
□ Supabase の URL 許可リストに本番 URL を追加
□ Google OAuth に本番 URL を追加
□ 本番環境で認証が動作する
□ 本番環境で全機能が動作する
```
