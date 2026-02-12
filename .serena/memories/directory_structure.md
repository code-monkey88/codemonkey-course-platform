# ディレクトリ構造

## プロジェクトルート
```
codemonkey-course-platform/
├── .claude/              # Claude Code 設定
├── .serena/              # Serena メモリ・キャッシュ
├── app/                  # Next.js App Router
├── components/           # Reactコンポーネント
├── docs/                 # プロジェクトドキュメント
├── lib/                  # ユーティリティ・ライブラリ
├── public/               # 静的ファイル
├── CLAUDE.md             # Claude Code向けプロジェクト指示
├── REQUIREMENTS.md       # 要件定義書
├── package.json          # npm設定
├── tsconfig.json         # TypeScript設定
├── eslint.config.mjs     # ESLint設定
├── next.config.ts        # Next.js設定
└── middleware.ts         # Next.js Middleware (認証トークンリフレッシュ)
```

## app/ ディレクトリ（Next.js App Router）

### ルートグループと主要ルート
```
app/
├── (auth)/               # 認証関連（レイアウトグループ）
│   ├── login/            # ログインページ
│   │   ├── page.tsx
│   │   └── login-button.tsx
│   └── auth/
│       └── callback/     # OAuth コールバック
│           └── route.ts
│
├── (dashboard)/          # ユーザーダッシュボード（認証必須）
│   ├── dashboard/        # ダッシュボードトップ
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── profile/          # プロフィール
│       ├── page.tsx
│       ├── actions.ts    # Server Actions
│       └── edit/
│           └── page.tsx
│
├── (admin)/              # 管理画面（admin roleのみ）
│   ├── layout.tsx        # 管理画面共通レイアウト
│   └── admin/
│       ├── page.tsx      # 管理トップ
│       ├── loading.tsx
│       └── courses/      # 講座管理（CRUD）
│           ├── page.tsx
│           ├── actions.ts
│           ├── new/      # 新規作成
│           └── [courseId]/
│               ├── page.tsx
│               ├── edit/ # 編集
│               └── sections/  # セクション管理
│                   ├── actions.ts
│                   ├── new/
│                   └── [sectionId]/
│                       ├── page.tsx
│                       ├── edit/
│                       └── videos/  # 動画管理
│                           ├── actions.ts
│                           ├── new/
│                           └── [videoId]/
│                               └── edit/
│
├── courses/              # 講座閲覧（公開）
│   └── [courseId]/
│       ├── page.tsx      # 講座詳細
│       ├── loading.tsx
│       ├── error.tsx
│       ├── not-found.tsx
│       └── videos/
│           └── [videoId]/  # 動画視聴
│               ├── page.tsx
│               ├── actions.ts
│               ├── loading.tsx
│               └── not-found.tsx
│
├── forbidden/            # 403 Forbidden
│   └── page.tsx
│
├── layout.tsx            # ルートレイアウト
├── page.tsx              # トップページ（講座一覧）
├── loading.tsx           # グローバルローディング
├── error.tsx             # グローバルエラー
├── not-found.tsx         # グローバル404
└── globals.css           # グローバルスタイル
```

## components/ ディレクトリ

```
components/
├── ui/                   # shadcn/ui コンポーネント
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── progress.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx        # トースト通知
│   ├── table.tsx
│   └── ...               # その他UIコンポーネント
│
├── admin/                # 管理画面専用コンポーネント
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── course-form.tsx
│   ├── courses-table.tsx
│   ├── section-form.tsx
│   ├── sections-list.tsx
│   ├── video-form.tsx
│   └── videos-list.tsx
│
├── layout/               # レイアウトコンポーネント
│   ├── header.tsx        # ヘッダー
│   └── user-menu.tsx     # ユーザーメニュー
│
├── avatar-upload.tsx     # アバターアップロード
├── course-card.tsx       # 講座カード
├── course-progress.tsx   # 講座進捗表示
├── level-badge.tsx       # レベルバッジ
├── profile-edit-form.tsx # プロフィール編集フォーム
├── progress-button.tsx   # 進捗ボタン
├── section-accordion.tsx # セクションアコーディオン
├── video-list-item.tsx   # 動画リストアイテム
├── video-player.tsx      # 動画プレイヤー（YouTube埋め込み）
└── video-sidebar.tsx     # 動画サイドバー
```

## lib/ ディレクトリ

```
lib/
├── supabase/             # Supabase関連
│   ├── auth.ts           # 認証ヘルパー関数
│   ├── client.ts         # Client Component用クライアント
│   ├── server.ts         # Server Component用クライアント
│   └── middleware.ts     # Middleware用クライアント
│
├── types.ts              # TypeScript型定義
└── utils.ts              # ユーティリティ関数（clsx, cn）
```

## 命名規約とパターン

### ファイル配置ルール
- **page.tsx** - ルートのUIコンポーネント（必須）
- **layout.tsx** - 共有レイアウト
- **loading.tsx** - Suspense フォールバックUI
- **error.tsx** - エラーバウンダリ（'use client' 必須）
- **not-found.tsx** - 404ページ
- **route.ts** - API Route Handler
- **actions.ts** - Server Actions

### ルートグループ
- **(auth)** - 認証関連ページ（URLに影響しない）
- **(dashboard)** - ユーザーダッシュボード（認証必須）
- **(admin)** - 管理画面（admin roleのみ）

### 動的ルート
- **[courseId]** - 講座ID
- **[sectionId]** - セクションID
- **[videoId]** - 動画ID
