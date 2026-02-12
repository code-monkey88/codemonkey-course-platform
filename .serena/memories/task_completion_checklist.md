# タスク完了時のチェックリスト

## コード品質チェック

### 1. ESLint実行
```bash
npm run lint
```
- エラーがないことを確認
- 警告がある場合は可能な限り修正

### 2. TypeScript型チェック
```bash
npx tsc --noEmit
```
- 型エラーがないことを確認
- `any` 型の使用は最小限に

### 3. ビルドテスト
```bash
npm run build
```
- ビルドが成功することを確認
- ビルドエラー・警告をチェック

## コード品質レビュー

### Next.js App Router ベストプラクティス
- [ ] Server Components をデフォルトで使用
- [ ] Client Components は必要最小限（'use client'の配置が適切）
- [ ] データフェッチングは Server Components 内で直接実行
- [ ] 適切な loading.tsx / error.tsx / not-found.tsx の実装

### Supabase
- [ ] 適切なクライアント（client/server/middleware）を使用
- [ ] RLSポリシーが正しく動作
- [ ] クライアントをシングルトンにしていない

### パフォーマンス
- [ ] 画像は `next/image` コンポーネントを使用
- [ ] 重いコンポーネントは動的インポート (`dynamic()`) で遅延読み込み
- [ ] 不要な Client Components を Server Components に変換

### スタイリング
- [ ] レスポンシブデザイン（モバイル/タブレット/デスクトップ）
- [ ] Tailwind CSS クラスの使用
- [ ] shadcn/ui コンポーネントの適切な使用

### セキュリティ
- [ ] XSS対策（ユーザー入力のサニタイズ）
- [ ] 認証・認可の実装（Middleware、RLS）
- [ ] 環境変数の適切な管理（`.env.local`、`NEXT_PUBLIC_` プレフィックス）

### アクセシビリティ
- [ ] セマンティックHTML
- [ ] キーボード操作対応
- [ ] aria属性の適切な使用

## Git操作

### コミット前
```bash
# 変更内容を確認
git status
git diff

# ステージング
git add .

# コミット
git commit -m "適切なコミットメッセージ"
```

### プッシュ前
- [ ] コミットメッセージが適切
- [ ] 不要なファイルがコミットされていない（`.env.local`、`node_modules`など）
- [ ] mainブランチへの直接プッシュを避ける（ブランチ戦略に従う）

## テスト（今後実装予定）
- [ ] ユニットテスト実行
- [ ] 統合テスト実行
- [ ] E2Eテスト実行

## デプロイ前チェック
- [ ] 環境変数がVercelに設定されている
- [ ] ビルドが成功
- [ ] プレビューデプロイで動作確認
