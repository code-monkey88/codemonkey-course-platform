# AIプログラミング学習プラットフォーム - MVP要件定義書

## 📌 プロジェクト概要

AIプログラミング学習に特化したオンライン講座プラットフォーム。既存のYouTubeコンテンツを活用し、体系的な学習体験を提供する。

### ターゲットユーザー
- AIでプログラム開発したいエンジニア
- AIプログラミングに興味がある非エンジニア

---

## 🛠 技術スタック

### フロントエンド
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (UIコンポーネントライブラリ)

### バックエンド・インフラ
- **Supabase**
  - PostgreSQL データベース
  - Authentication (Google OAuth)
  - Row Level Security (RLS)
- **Vercel** (デプロイ)

### 外部サービス
- **YouTube API** (動画埋め込み)
- **Google Cloud Console** (OAuth認証)

---

## 📊 データベース設計

### ERD概要
```
profiles (ユーザープロフィール)
  ↓
user_progress (学習進捗)
  ↓
videos (動画)
  ↓
sections (セクション)
  ↓
courses (講座)
```

### テーブル定義

#### 1. profiles (プロフィールテーブル)
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  bio text,
  role text NOT NULL DEFAULT 'user', -- 'user' or 'admin'
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

#### 2. courses (講座テーブル)
```sql
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  level text NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  thumbnail_url text,
  order_index int NOT NULL,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

#### 3. sections (セクションテーブル)
```sql
CREATE TABLE sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index int NOT NULL,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

#### 4. videos (動画テーブル)
```sql
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id uuid REFERENCES sections ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  youtube_url text NOT NULL,
  duration int, -- 秒数（オプション）
  order_index int NOT NULL,
  is_preview boolean DEFAULT false, -- 未認証で視聴可能か
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

#### 5. user_progress (進捗テーブル)
```sql
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

### トリガー関数

#### 新規ユーザー作成時にプロフィール自動作成
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Row Level Security (RLS) ポリシー

#### profiles テーブル
```sql
-- 自分のプロフィールは閲覧可能
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 自分のプロフィールは更新可能
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### courses, sections, videos テーブル
```sql
-- 全ユーザーが閲覧可能
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

-- 管理者のみが編集可能
CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### user_progress テーブル
```sql
-- 自分の進捗のみ閲覧・編集可能
CREATE POLICY "Users can manage own progress"
  ON user_progress FOR ALL
  USING (auth.uid() = user_id);
```

---

## 🎯 主要機能

### 1. 認証機能
- **Google OAuth** のみ（Supabase Auth使用）
- 新規ユーザー登録時に自動でプロフィール作成
- 最初の動画（is_preview=true）のみ未認証で視聴可能
- それ以外の動画は認証必須

### 2. 講座管理
- **3講座**: 初級、中級、上級
- 各講座: 最大6セクション
- 各セクション: 最大7動画
- セクションにタイトル・説明付き
- YouTube動画埋め込みプレイヤー
- 動画は自由に選択可能（順番制限なし）

### 3. 学習進捗管理
- 動画完了の手動マーク機能
- ユーザーごとの進捗率計算
- 講座・セクション単位の進捗可視化

### 4. ユーザーダッシュボード
- 学習統計表示
  - 総視聴動画数
  - 講座別進捗率
  - 最近視聴した動画
- プロフィール表示
  - 表示名
  - アバター画像
  - 自己紹介文

### 5. プロフィール機能
- プロフィール表示ページ
- プロフィール編集機能
  - 表示名変更
  - アバター画像アップロード
  - 自己紹介編集

### 6. 管理画面
- ロールベースアクセス制御（admin のみアクセス可）
- 講座・セクション・動画のCRUD機能
  - 作成
  - 編集
  - 削除
  - 並び替え（order_index）

### 7. レスポンシブデザイン
- スマートフォン対応
- タブレット対応
- デスクトップ対応

---

## 📱 ページ構成

### フロントエンド（一般ユーザー）
1. **`/`** - トップページ（講座一覧）
2. **`/courses/[courseId]`** - 講座詳細（セクション・動画一覧）
3. **`/courses/[courseId]/videos/[videoId]`** - 動画視聴ページ
4. **`/dashboard`** - ダッシュボード（進捗・統計）
5. **`/profile`** - プロフィール表示
6. **`/profile/edit`** - プロフィール編集
7. **`/login`** - ログイン（Googleボタン）
8. **`/auth/callback`** - 認証コールバック

### バックエンド（管理者）
9. **`/admin`** - 管理画面トップ（講座一覧）
10. **`/admin/courses/new`** - 新規講座作成
11. **`/admin/courses/[courseId]/edit`** - 講座編集
12. **`/admin/courses/[courseId]/sections`** - セクション管理
13. **`/admin/courses/[courseId]/sections/[sectionId]/videos`** - 動画管理

---

## 🎨 UI/UXガイドライン

### デザイン原則
- **シンプル**: 学習に集中できるクリーンなデザイン
- **直感的**: 初心者でも迷わない導線設計
- **モダン**: shadcn/uiを活用した現代的なUI

### カラースキーム
- **プライマリー**: ブルー系（学習・信頼感）
- **アクセント**: グリーン系（進捗・達成感）
- **ダークモード**: 対応推奨

### コンポーネント設計
- **Button**: shadcn/ui Button
- **Card**: 講座・動画カード
- **Progress Bar**: 進捗表示
- **Avatar**: ユーザーアイコン
- **Dialog/Modal**: 編集・削除確認
- **Toast**: 通知（完了マーク時など）

---

## 🔐 認証・認可フロー

### Google OAuth認証フロー
1. ユーザーが「Googleでログイン」ボタンをクリック
2. Google認証画面へリダイレクト
3. ユーザーがGoogleアカウントで認証
4. `/auth/callback` でセッション確立
5. プロフィールテーブルに自動作成（トリガー）
6. `/dashboard` へリダイレクト

### 未認証ユーザーのアクセス制御
- `/`: アクセス可能
- `/courses/[courseId]`: アクセス可能
- `/courses/[courseId]/videos/[videoId]`: 
  - `is_preview=true` の動画: アクセス可能
  - それ以外: ログインページへリダイレクト
- `/dashboard`, `/profile`: 認証必須

### 管理者のアクセス制御
- `/admin/*`: `role='admin'` のユーザーのみアクセス可能
- それ以外のユーザーは403エラー

---

## 📦 MVP開発の優先順位

### フェーズ1: 基盤構築（1-2日）
- [ ] Next.js + Supabase プロジェクトセットアップ
- [ ] Google OAuth設定（Google Cloud Console + Supabase）
- [ ] データベーステーブル作成（SQL実行）
- [ ] トリガー関数・RLSポリシー設定
- [ ] 環境変数設定（`.env.local`）

### フェーズ2: 認証機能（1日）
- [ ] Google認証実装（ログイン・ログアウト）
- [ ] 認証コールバック処理
- [ ] 認証ガードミドルウェア

### フェーズ3: コア機能（3-4日）
- [ ] トップページ（講座一覧）
- [ ] 講座詳細ページ（セクション・動画一覧）
- [ ] 動画視聴ページ（YouTube埋め込み）
- [ ] 進捗マーク機能（完了ボタン）

### フェーズ4: ユーザー体験（2-3日）
- [ ] ダッシュボード（進捗可視化）
- [ ] プロフィール表示・編集機能
- [ ] レスポンシブデザイン調整

### フェーズ5: 管理機能（2-3日）
- [ ] 管理画面トップ
- [ ] 講座CRUD
- [ ] セクションCRUD
- [ ] 動画CRUD
- [ ] 並び替え機能

### フェーズ6: 最終調整（1-2日）
- [ ] エラーハンドリング
- [ ] ローディング状態
- [ ] バリデーション
- [ ] パフォーマンス最適化
- [ ] Vercelデプロイ

**合計開発期間: 10-15日**

---

## 🚫 MVPスコープ外（後回し）

以下の機能は将来的に実装予定：

- [ ] 検索機能（講座名・動画タイトル）
- [ ] お気に入り/ブックマーク機能
- [ ] 動画へのメモ機能
- [ ] コース修了証明書
- [ ] コメント機能
- [ ] 課金機能（Stripe連携）
- [ ] メール通知機能
- [ ] 動画視聴履歴（自動記録）
- [ ] おすすめ講座機能

---

## 📋 技術的要件

### 必須パッケージ
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}
```

### 環境変数（`.env.local`）
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### ディレクトリ構成
```
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── auth/callback/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   └── profile/
│   ├── (admin)/
│   │   └── admin/
│   ├── courses/
│   │   └── [courseId]/
│   │       ├── page.tsx
│   │       └── videos/[videoId]/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn/ui)
│   ├── course-card.tsx
│   ├── video-player.tsx
│   ├── progress-bar.tsx
│   └── ...
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── types.ts
├── public/
└── ...
```

---

## 🧪 テスト計画

### 手動テスト項目
- [ ] Google認証ログイン・ログアウト
- [ ] 未認証での最初の動画視聴
- [ ] 認証後の動画視聴
- [ ] 進捗マーク機能
- [ ] プロフィール編集
- [ ] 管理画面での講座作成・編集・削除
- [ ] レスポンシブデザイン確認（モバイル・タブレット）

---

## 📝 備考

### 初期データ
- 管理者アカウント: 最初の登録ユーザーをSupabaseダッシュボードから手動で `role='admin'` に変更
- サンプル講座: 管理画面から手動で作成

### パフォーマンス考慮事項
- 動画一覧は適切にページネーション（必要に応じて）
- 画像はNext.js Imageコンポーネントを使用
- Supabaseクエリは必要最小限に

### セキュリティ考慮事項
- RLSポリシーで適切なアクセス制御
- 環境変数は`.env.local`に記載（Gitにコミットしない）
- XSS対策（Next.jsのデフォルト保護を活用）

---

## 🎉 完成イメージ

### ユーザー視点
1. Googleでログイン
2. ダッシュボードで進捗確認
3. 講座を選択
4. 動画を視聴しながら完了マーク
5. プロフィールをカスタマイズ

### 管理者視点
1. 管理画面にアクセス
2. 新規講座作成
3. セクション・動画を追加
4. 並び替えで整理

---

## 📞 サポート・問い合わせ

- **Supabase公式ドキュメント**: https://supabase.com/docs
- **Next.js公式ドキュメント**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com/