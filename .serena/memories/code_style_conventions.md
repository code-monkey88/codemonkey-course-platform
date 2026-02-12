# コードスタイルと規約

## TypeScript設定

### コンパイラオプション
- **target**: ES2017
- **strict**: 有効（厳格な型チェック）
- **jsx**: react-jsx
- **moduleResolution**: bundler
- **パスエイリアス**: `@/*` → プロジェクトルート

### 型定義
- 型は `lib/types.ts` に集約
- `strict: true` により、すべての厳格チェックが有効
- 明示的な型アノテーションを推奨

## Next.js App Router 規約

### コンポーネント設計
- **Server Components がデフォルト** - 可能な限り Server Components を使用
- **Client Components は最小限** - 以下の場合のみ `'use client'` を追加:
  - React hooks (`useState`, `useEffect` など) 使用時
  - ブラウザ API アクセス時
  - イベントハンドラ使用時
- **Client Components はツリーの葉に配置** - Server Components でラップ

### ファイル命名規約
- **page.tsx** - ルートのUIコンポーネント
- **layout.tsx** - 共有レイアウト
- **loading.tsx** - ローディングUI
- **error.tsx** - エラーハンドリング（Client Component）
- **not-found.tsx** - 404ページ
- **route.ts** - API Route Handler
- **actions.ts** - Server Actions

### コンポーネント命名
- コンポーネント名は **PascalCase**
- ファイル名はコンポーネント名と一致（例: `UserMenu.tsx` → `export default function UserMenu()`）
- ただし、Next.js の特殊ファイル（page.tsx, layout.tsx など）は小文字

### 関数・変数命名
- 関数・変数名は **camelCase**
- 定数は **UPPER_SNAKE_CASE**（例: `MAX_UPLOAD_SIZE`）
- プライベート関数には `_` プレフィックスは不要

## Supabase 規約

### クライアントの使い分け
- **Client Component**: `lib/supabase/client.ts` (`createBrowserClient`)
- **Server Component / Server Actions**: `lib/supabase/server.ts` (`createServerClient`)
- **Middleware**: `lib/supabase/middleware.ts`

### 重要ルール
- クライアントは毎回新規作成（シングルトン不可）
- Server Components では Cookie 書き込み不可
- Middleware で認証トークンのリフレッシュを処理

## スタイリング規約

### Tailwind CSS
- **ユーティリティクラスを優先** - カスタムCSSは最小限に
- **clsx + tailwind-merge** で条件付きクラス名を管理
- **class-variance-authority** でバリアントスタイルを定義

### レスポンシブデザイン
- モバイルファースト (デフォルトがモバイル)
- ブレークポイント: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## ESLint規約
- **eslint-config-next** を使用（Core Web Vitals + TypeScript）
- 自動フォーマット設定なし（将来的にPrettierの導入を推奨）

## コミットメッセージ
- 日本語または英語で記述
- プレフィックス推奨: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `test:`, `chore:`

## その他の規約
- **絶対パスインポート**: `@/` プレフィックスを使用（例: `@/lib/utils`）
- **エッジケースのハンドリング**: エラーバウンダリ、loading状態、not-found を適切に実装
- **アクセシビリティ**: aria属性、キーボード操作、セマンティックHTMLを意識
