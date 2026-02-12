# プロジェクト概要

## プロジェクトの目的
AIプログラミング学習プラットフォーム - YouTube動画を活用したオンライン講座サービス。

ユーザーが初級/中級/上級の講座を通じて、YouTube動画で学習し、進捗を管理できるプラットフォーム。
管理者は講座・セクション・動画の CRUD 操作が可能。

## 技術スタック

### フロントエンド
- **Next.js 16.1.6** (App Router)
- **React 19.2.3** + React DOM 19.2.3
- **TypeScript 5**
- **Tailwind CSS 4** + PostCSS
- **shadcn/ui** (Radix UI ベース)
- **lucide-react** (アイコン)
- **next-themes** (ダークモード)
- **sonner** (トースト通知)

### バックエンド・認証
- **Supabase** (PostgreSQL, Auth, RLS)
  - `@supabase/supabase-js 2.94.0`
  - `@supabase/ssr 0.8.0`
- **Google OAuth** (Supabase Auth 経由)

### ユーティリティ
- **clsx** + **tailwind-merge** (クラス名管理)
- **class-variance-authority** (バリアントスタイル)
- **date-fns 4.1.0** (日付操作)

### 開発ツール
- **ESLint 9** (eslint-config-next)
- **TypeScript** (strict モード有効)

## デプロイ
- **Vercel** (推奨ホスティング先)

## システム情報
- **開発環境**: Windows
- **パッケージマネージャー**: npm
