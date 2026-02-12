# 推奨コマンド

## 開発コマンド

```bash
# 開発サーバー起動 (http://localhost:3000)
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# ESLint 実行
npm run lint
```

## Windowsシステム用コマンド

### ファイル・ディレクトリ操作
```powershell
# ディレクトリ内容の表示
dir
ls  # PowerShellの場合

# ディレクトリ移動
cd <path>

# ファイル内容の表示
type <file>
cat <file>  # PowerShellの場合

# ファイル検索
where <filename>
Get-ChildItem -Recurse -Filter <pattern>  # PowerShell
```

### Git操作
```bash
# 状態確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "message"

# プッシュ
git push

# ブランチ確認
git branch

# ブランチ切り替え
git checkout <branch>
```

## テスト関連
現在、テストフレームワークは未設定。
将来的には Jest + React Testing Library の導入を推奨。

## その他の便利なコマンド

```bash
# 依存関係のインストール
npm install

# 依存関係の更新
npm update

# キャッシュクリア
npm cache clean --force

# Next.js ビルドキャッシュクリア
rmdir /s /q .next  # Windows CMD
Remove-Item -Recurse -Force .next  # PowerShell
```
