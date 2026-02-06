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

export async function createCourse(formData: FormData) {
  const { supabase } = await requireAdminAuth()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const level = formData.get('level') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string

  // バリデーション
  if (!title || title.trim().length === 0) {
    return { error: 'タイトルは必須です' }
  }

  if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
    return { error: '無効なレベルです' }
  }

  // 現在の最大order_indexを取得
  const { data: maxOrderData } = await supabase
    .from('courses')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const orderIndex = (maxOrderData?.order_index ?? 0) + 1

  const { error } = await supabase.from('courses').insert({
    title: title.trim(),
    description: description?.trim() || null,
    level,
    thumbnail_url: thumbnailUrl?.trim() || null,
    order_index: orderIndex,
  })

  if (error) {
    console.error('Create course error:', error)
    return { error: '講座の作成に失敗しました' }
  }

  revalidatePath('/admin/courses')
  revalidatePath('/')
  redirect('/admin/courses')
}

export async function updateCourse(courseId: string, formData: FormData) {
  const { supabase } = await requireAdminAuth()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const level = formData.get('level') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string

  // バリデーション
  if (!title || title.trim().length === 0) {
    return { error: 'タイトルは必須です' }
  }

  if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
    return { error: '無効なレベルです' }
  }

  const { error } = await supabase
    .from('courses')
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      level,
      thumbnail_url: thumbnailUrl?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', courseId)

  if (error) {
    console.error('Update course error:', error)
    return { error: '講座の更新に失敗しました' }
  }

  revalidatePath('/admin/courses')
  revalidatePath('/')
  revalidatePath(`/courses/${courseId}`)
  redirect('/admin/courses')
}

export async function deleteCourse(courseId: string) {
  const { supabase } = await requireAdminAuth()

  const { error } = await supabase.from('courses').delete().eq('id', courseId)

  if (error) {
    console.error('Delete course error:', error)
    return { error: '講座の削除に失敗しました' }
  }

  revalidatePath('/admin/courses')
  revalidatePath('/')
  return { success: true }
}

export async function reorderCourses(orderedIds: string[]) {
  const { supabase } = await requireAdminAuth()

  // 一括更新
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from('courses')
      .update({ order_index: i + 1 })
      .eq('id', orderedIds[i])

    if (error) {
      console.error('Reorder error:', error)
      return { error: '並び替えに失敗しました' }
    }
  }

  revalidatePath('/admin/courses')
  revalidatePath('/')
  return { success: true }
}
