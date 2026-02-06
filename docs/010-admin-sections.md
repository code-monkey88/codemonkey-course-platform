# 010: セクション管理（CRUD）

## 概要
管理画面で講座内のセクションの作成・編集・削除・並び替えを行う機能。

## 完了条件
- 講座内のセクション一覧が表示される
- 新規セクションを作成できる
- 既存セクションを編集できる
- セクションを削除できる（確認ダイアログ付き）
- セクションの並び順を変更できる

---

## Todo

### セクション一覧ページ
- [x] `app/(admin)/admin/courses/[courseId]/page.tsx` でセクション一覧を表示（講座詳細ページに統合）
- [x] 講座情報をヘッダーに表示
- [x] セクション一覧をカード形式で表示
- [x] 各セクションに編集・削除・動画管理ボタン
- [x] 新規セクション作成ボタン
- [x] 並び替えUI（上下ボタン）

### セクション一覧コンポーネント
- [x] `components/admin/sections-list.tsx` 作成
- [x] カラム: 順序、タイトル、説明、動画数、操作
- [x] order_index順でソート

### 新規セクション作成
- [x] `app/(admin)/admin/courses/[courseId]/sections/new/page.tsx` 作成
- [x] 入力項目:
  - [x] タイトル（必須）
  - [x] 説明
- [x] バリデーション
- [x] 作成後にリストを更新

### セクション編集
- [x] `app/(admin)/admin/courses/[courseId]/sections/[sectionId]/edit/page.tsx` 作成
- [x] 既存データを初期表示
- [x] 更新処理

### セクション削除
- [x] 削除確認ダイアログ（AlertDialog）
- [x] 関連する動画も削除される旨を警告
- [x] 削除処理

### 並び替え機能
- [x] 上下ボタンで並び替え
- [x] 並び替え後に order_index を一括更新

### Server Actions
- [x] `app/(admin)/admin/courses/[courseId]/sections/actions.ts` 作成
- [x] `createSection` - セクション作成
- [x] `updateSection` - セクション更新
- [x] `deleteSection` - セクション削除
- [x] `reorderSections` - 並び替え

### フォームコンポーネント
- [x] `components/admin/section-form.tsx` 作成
- [x] 作成・編集ページで使用

### ナビゲーション
- [x] パンくずリスト（講座一覧 > 講座名 > セクション名）
- [x] 講座一覧へ戻るリンク
- [x] 各セクションから動画管理ページへのリンク

---

## 画面構成

```
┌─────────────────────────────────────────────────┐
│ 講座一覧 > 初級講座 > セクション管理              │
├─────────────────────────────────────────────────┤
│                                                 │
│  初級講座のセクション              [+ 新規作成]  │
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ ≡ 1. はじめに                               ││
│  │   AIプログラミングの基礎を学ぶ               ││
│  │   動画: 4本                                 ││
│  │   [動画管理] [編集] [削除]                   ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ ≡ 2. 環境構築                               ││
│  │   開発環境を整えます                         ││
│  │   動画: 3本                                 ││
│  │   [動画管理] [編集] [削除]                   ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ ≡ 3. 実践編                                 ││
│  │   実際にコードを書いてみましょう             ││
│  │   動画: 5本                                 ││
│  │   [動画管理] [編集] [削除]                   ││
│  └─────────────────────────────────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘

≡ = ドラッグハンドル
```

---

## 参考コード

### セクション作成 Server Action
```typescript
// app/(admin)/admin/courses/[courseId]/sections/actions.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSection(courseId: string, formData: FormData) {
  const supabase = await createServerClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!title) throw new Error('タイトルは必須です')

  // 現在の最大order_indexを取得
  const { data: maxOrder } = await supabase
    .from('sections')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const orderIndex = (maxOrder?.order_index ?? 0) + 1

  const { error } = await supabase
    .from('sections')
    .insert({
      course_id: courseId,
      title,
      description: description || null,
      order_index: orderIndex,
    })

  if (error) throw error

  revalidatePath(`/admin/courses/${courseId}/sections`)
}

export async function updateSection(
  sectionId: string,
  courseId: string,
  formData: FormData
) {
  const supabase = await createServerClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (!title) throw new Error('タイトルは必須です')

  const { error } = await supabase
    .from('sections')
    .update({
      title,
      description: description || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sectionId)

  if (error) throw error

  revalidatePath(`/admin/courses/${courseId}/sections`)
}

export async function deleteSection(sectionId: string, courseId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', sectionId)

  if (error) throw error

  revalidatePath(`/admin/courses/${courseId}/sections`)
}
```
