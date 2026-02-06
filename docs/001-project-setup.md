# 001: プロジェクト基盤構築

## 概要
Next.js + Supabase プロジェクトの初期セットアップを行う。

## 完了条件
- 必要なパッケージがインストールされている
- Supabaseプロジェクトが作成され、接続できる
- データベーステーブルとRLSポリシーが設定されている
- 開発サーバーが正常に起動する

---

## Todo

### パッケージセットアップ
- [x] 不要なボイラープレートコードを削除
- [x] 必要なパッケージをインストール
  - [x] `@supabase/supabase-js`
  - [x] `@supabase/ssr`
  - [x] `class-variance-authority`
  - [x] `clsx`
  - [x] `tailwind-merge`
  - [x] `lucide-react`
- [x] shadcn/ui を初期化
- [x] 基本的なUIコンポーネントを追加（Button, Card, Avatar, Progress, Dialog, Sonner, Accordion, Select, Input, Label, Badge, DropdownMenu, Separator, Skeleton, Switch）

### Supabase セットアップ
- [x] Supabaseプロジェクトを作成
- [x] 環境変数を設定（`.env.local`）
  - [x] `NEXT_PUBLIC_SUPABASE_URL`
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `.env.local` を `.gitignore` に追加確認

### Supabase クライアント作成
- [x] `lib/supabase/client.ts` - Client Component用クライアント
- [x] `lib/supabase/server.ts` - Server Component用クライアント
- [x] `lib/supabase/middleware.ts` - Middleware用クライアント
- [x] `middleware.ts` - ルートにMiddleware設定

### データベース構築
- [x] `profiles` テーブル作成
- [x] `courses` テーブル作成
- [x] `sections` テーブル作成
- [x] `videos` テーブル作成
- [x] `user_progress` テーブル作成
- [x] `handle_new_user()` トリガー関数作成
- [x] `on_auth_user_created` トリガー作成

### RLSポリシー設定
- [x] `profiles` テーブルのRLS有効化とポリシー設定
- [x] `courses` テーブルのRLS有効化とポリシー設定
- [x] `sections` テーブルのRLS有効化とポリシー設定
- [x] `videos` テーブルのRLS有効化とポリシー設定
- [x] `user_progress` テーブルのRLS有効化とポリシー設定

### 型定義
- [x] `lib/types.ts` - データベース型定義を作成

### ユーティリティ
- [x] `lib/utils.ts` - cn関数などのユーティリティ作成

---

## 参考SQL

```sql
-- profiles テーブル
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  bio text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- courses テーブル
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  level text NOT NULL,
  thumbnail_url text,
  order_index int NOT NULL,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- sections テーブル
CREATE TABLE sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index int NOT NULL,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- videos テーブル
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id uuid REFERENCES sections ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  youtube_url text NOT NULL,
  duration int,
  order_index int NOT NULL,
  is_preview boolean DEFAULT false,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- user_progress テーブル
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  video_id uuid REFERENCES videos ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamp,
  created_at timestamp DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);
```
