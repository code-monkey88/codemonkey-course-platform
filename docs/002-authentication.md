# 002: 認証機能

## 概要
Google OAuth認証を実装し、ログイン・ログアウト機能を提供する。

## 完了条件
- Googleアカウントでログインできる
- ログアウトできる
- 認証状態に応じてページアクセスが制御される
- 新規ユーザー登録時にプロフィールが自動作成される

---

## Todo

### Google OAuth 設定
- [x] Google Cloud Console でプロジェクト作成
- [x] OAuth 2.0 クライアントIDを作成
- [x] 承認済みリダイレクトURIを設定
- [x] Supabase で Google Provider を有効化
- [x] Client ID / Client Secret を Supabase に設定

> **Note**: 上記はGoogle Cloud ConsoleとSupabaseダッシュボードで手動設定が必要です。

### ログインページ
- [x] `app/(auth)/login/page.tsx` 作成
- [x] Googleログインボタンを実装
- [x] ログイン処理（`supabase.auth.signInWithOAuth`）
- [x] 認証済みユーザーはダッシュボードへリダイレクト

### 認証コールバック
- [x] `app/(auth)/auth/callback/route.ts` 作成
- [x] コールバック処理（code → session 交換）
- [x] 成功時は `/dashboard` へリダイレクト
- [x] 失敗時は `/login` へリダイレクト（エラーメッセージ付き）

### ログアウト機能
- [x] ログアウトボタンコンポーネント作成
- [x] ログアウト処理（`supabase.auth.signOut`）
- [x] ログアウト後は `/` へリダイレクト

### 認証ガード
- [x] Middleware で認証チェック実装
- [x] 保護ルートの定義
  - [x] `/dashboard` - 認証必須
  - [x] `/profile` - 認証必須
  - [x] `/admin/*` - admin ロール必須
- [x] 未認証アクセス時は `/login` へリダイレクト
- [x] 権限不足時は 403 ページ表示

### 認証状態管理
- [x] 認証状態を取得するヘルパー関数作成
- [x] 現在のユーザー情報を取得する関数作成
- [x] ユーザーのロールを取得する関数作成

### ヘッダーコンポーネント
- [x] 共通ヘッダーコンポーネント作成
- [x] 未認証時: ログインボタン表示
- [x] 認証時: ユーザーアバター + ドロップダウンメニュー
  - [x] ダッシュボードリンク
  - [x] プロフィールリンク
  - [x] 管理画面リンク（admin のみ）
  - [x] ログアウトボタン

---

## 認証フロー図

```
1. ユーザーが「Googleでログイン」クリック
   ↓
2. supabase.auth.signInWithOAuth({ provider: 'google' })
   ↓
3. Google認証画面へリダイレクト
   ↓
4. ユーザーがGoogleアカウントで認証
   ↓
5. /auth/callback へリダイレクト（認証コード付き）
   ↓
6. コールバックでセッション確立
   ↓
7. トリガーで profiles テーブルに自動作成
   ↓
8. /dashboard へリダイレクト
```

---

## 作成されたファイル

- `app/(auth)/login/page.tsx` - ログインページ
- `app/(auth)/login/login-button.tsx` - Googleログインボタン
- `app/(auth)/auth/callback/route.ts` - 認証コールバック
- `app/forbidden/page.tsx` - 403ページ
- `app/(dashboard)/dashboard/page.tsx` - ダッシュボード（仮）
- `app/(dashboard)/profile/page.tsx` - プロフィール（仮）
- `lib/supabase/auth.ts` - 認証ヘルパー関数
- `components/layout/header.tsx` - ヘッダーコンポーネント
- `components/layout/user-menu.tsx` - ユーザーメニュー
