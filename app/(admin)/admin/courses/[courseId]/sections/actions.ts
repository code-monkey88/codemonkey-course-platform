'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdminAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden')
  }

  return { supabase, user }
}

export async function createSection(courseId: string, formData: FormData) {
  const { supabase } = await requireAdminAuth()

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  // バリデーション
  if (!title) {
    return { error: 'タイトルは必須です' }
  }

  // 現在の最大order_indexを取得
  const { data: maxOrder } = await supabase
    .from('sections')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const orderIndex = (maxOrder?.order_index ?? 0) + 1

  const { error } = await supabase.from('sections').insert({
    course_id: courseId,
    title,
    description: description || null,
    order_index: orderIndex,
  })

  if (error) {
    return { error: 'セクションの作成に失敗しました' }
  }

  revalidatePath(`/admin/courses/${courseId}`)
  redirect(`/admin/courses/${courseId}`)
}

export async function updateSection(
  sectionId: string,
  courseId: string,
  formData: FormData
) {
  const { supabase } = await requireAdminAuth()

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  // バリデーション
  if (!title) {
    return { error: 'タイトルは必須です' }
  }

  const { error } = await supabase
    .from('sections')
    .update({
      title,
      description: description || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sectionId)

  if (error) {
    return { error: 'セクションの更新に失敗しました' }
  }

  revalidatePath(`/admin/courses/${courseId}`)
  redirect(`/admin/courses/${courseId}`)
}

export async function deleteSection(sectionId: string, courseId: string) {
  const { supabase } = await requireAdminAuth()

  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', sectionId)

  if (error) {
    return { error: 'セクションの削除に失敗しました' }
  }

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function reorderSections(
  courseId: string,
  orderedIds: string[]
) {
  const { supabase } = await requireAdminAuth()

  const updates = orderedIds.map((id, index) => ({
    id,
    order_index: index + 1,
  }))

  for (const update of updates) {
    const { error } = await supabase
      .from('sections')
      .update({ order_index: update.order_index })
      .eq('id', update.id)

    if (error) {
      return { error: '並び替えに失敗しました' }
    }
  }

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}
