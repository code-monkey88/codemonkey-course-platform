# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

AIプログラミング学習プラットフォーム - YouTube動画を活用したオンライン講座サービス。

詳細な要件定義は [REQUIREMENTS.md](./REQUIREMENTS.md) を参照。

## 開発コマンド

```bash
npm run dev     # 開発サーバー起動
npm run build   # プロダクションビルド
npm start       # プロダクションサーバー起動
npm run lint    # ESLint実行
```

## 技術スタック

- **フレームワーク**: Next.js 14+ (App Router) + TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **バックエンド**: Supabase (PostgreSQL, Auth, RLS)
- **認証**: Google OAuth (Supabase Auth経由)
- **デプロイ**: Vercel

## Next.js App Router ベストプラクティス

### コンポーネント設計
- **Server Components をデフォルトで使用** - データフェッチ、DB アクセス、機密情報を扱う処理
- **Client Components は必要最小限** - `'use client'` は以下の場合のみ:
  - `useState`, `useEffect` 等の React hooks 使用時
  - ブラウザ API（`window`, `localStorage`）アクセス時
  - イベントハンドラ（`onClick`, `onChange`）使用時
- **Client Components は葉に配置** - ツリーの末端に配置し、Server Components でラップ

### データフェッチング
- **Server Components 内で直接 fetch/DB アクセス** - API Route 経由は不要
- **Supabase クライアント**: 用途に応じて適切なクライアントを使用（後述の「Supabase クライアント設計」参照）

### ファイル規約
- `page.tsx` - ルートのUIコンポーネント
- `layout.tsx` - 共有レイアウト（再レンダリングされない）
- `loading.tsx` - Suspense フォールバック UI
- `error.tsx` - エラーバウンダリ（`'use client'` 必須）
- `not-found.tsx` - 404 ページ

### パフォーマンス最適化
- **`next/image`** - 画像は必ず Image コンポーネントを使用
- **`next/font`** - フォントはビルド時に最適化
- **動的インポート** - 重いコンポーネントは `dynamic()` で遅延読み込み
- **Metadata API** - SEO 用メタデータは `generateMetadata` または `metadata` export

### Server Actions
- フォーム送信や データ更新は Server Actions を優先
- `'use server'` ディレクティブで定義
- `revalidatePath()` / `revalidateTag()` でキャッシュ無効化

### ルーティング
- **ルートグループ `(folder)`** - URL に影響せずレイアウトを共有
- **動的ルート `[param]`** - パラメータ付きルート
- **並列ルート `@folder`** - 同一レイアウト内で複数ページを表示（必要な場合）

## Supabase クライアント設計

`@supabase/ssr` パッケージを使用してクライアントを作成する。

### パッケージ
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### クライアントの使い分け

| 用途 | ファイル | 関数 |
|------|----------|------|
| Client Component | `lib/supabase/client.ts` | `createBrowserClient` |
| Server Component | `lib/supabase/server.ts` | `createServerClient` + cookies() |
| Server Actions | `lib/supabase/server.ts` | `createServerClient` + cookies() |
| Route Handler | `lib/supabase/server.ts` | `createServerClient` + cookies() |
| Middleware | `lib/supabase/middleware.ts` | `createServerClient` + request/response |

### 重要なルール
- **Server Components は Cookie を書き込めない** → Middleware でトークンリフレッシュを処理
- **Middleware は必須** - 認証トークンの自動リフレッシュと Cookie 更新を担当
- **クライアントは毎回新規作成** - リクエストごとに新しいインスタンスを作成（シングルトン不可）

### Middleware 設定 (`middleware.ts`)
```typescript
// matcher で静的ファイルを除外
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## ディレクトリ構成

```
app/
├── (auth)/
│   ├── login/              # ログインページ
│   └── auth/callback/      # OAuth コールバック
├── (dashboard)/
│   ├── dashboard/          # ユーザーダッシュボード
│   └── profile/            # プロフィール表示・編集
├── (admin)/
│   └── admin/              # 管理画面 (role='admin'のみ)
├── courses/
│   └── [courseId]/
│       ├── page.tsx        # 講座詳細
│       └── videos/[videoId]/  # 動画視聴
├── layout.tsx
└── page.tsx                # トップページ（講座一覧）

components/
├── ui/                     # shadcn/ui コンポーネント
└── ...                     # 共通コンポーネント

lib/
├── supabase/
│   ├── client.ts           # Client Component 用
│   ├── server.ts           # Server Component 用
│   └── middleware.ts       # Middleware 用
├── utils.ts                # ユーティリティ関数
└── types.ts                # TypeScript型定義
```

## データベース設計

```
profiles ─┬─ user_progress ─── videos ─── sections ─── courses
          │
          └─ role: 'user' | 'admin'
```

### テーブル
- **profiles**: ユーザープロフィール (auth.usersと1:1)
- **courses**: 講座 (初級/中級/上級)
- **sections**: セクション (講座ごとに最大6つ)
- **videos**: 動画 (セクションごとに最大7つ、YouTube埋め込み)
- **user_progress**: 視聴進捗 (user_id + video_id で一意)

### RLSポリシー
- profiles: 自分のみ閲覧・更新可
- courses/sections/videos: 全員閲覧可、admin のみ編集可
- user_progress: 自分のみ操作可

## 認証・認可

### アクセス制御
| パス | 未認証 | 認証済み | admin |
|------|--------|----------|-------|
| `/` | ○ | ○ | ○ |
| `/courses/[id]` | ○ | ○ | ○ |
| `/courses/[id]/videos/[id]` | △ (is_preview=trueのみ) | ○ | ○ |
| `/dashboard`, `/profile` | × | ○ | ○ |
| `/admin/*` | × | × | ○ |

### 認証フロー
1. Googleでログイン → Supabase Auth
2. `/auth/callback` でセッション確立
3. トリガーで profiles テーブルに自動作成
4. `/dashboard` へリダイレクト

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## パス エイリアス

- `@/*` → プロジェクトルート (tsconfig.json)

## UI/UXガイドライン

- shadcn/ui コンポーネントを使用
- カラー: プライマリー（ブルー系）、アクセント（グリーン系）
- ダークモード対応推奨
- レスポンシブデザイン必須（モバイル/タブレット/デスクトップ）
