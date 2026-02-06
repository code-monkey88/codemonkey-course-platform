'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { extractYouTubeId } from '@/lib/utils'

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

export async function createVideo(
  sectionId: string,
  courseId: string,
  formData: FormData
) {
  const { supabase } = await requireAdminAuth()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const youtubeUrl = formData.get('youtubeUrl') as string
  const durationSeconds = formData.get('durationSeconds') as string
  const isPreview = formData.get('isPreview') === 'on'

  // バリデーション
  if (!title) {
    return { error: 'タイトルは必須です' }
  }
  if (!youtubeUrl) {
    return { error: 'YouTube URLは必須です' }
  }

  const youtubeId = extractYouTubeId(youtubeUrl)
  if (!youtubeId) {
    return { error: '無効なYouTube URLです' }
  }

  // 現在の最大order_indexを取得
  const { data: maxOrder } = await supabase
    .from('videos')
    .select('order_index')
    .eq('section_id', sectionId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const orderIndex = (maxOrder?.order_index ?? 0) + 1

  const { error } = await supabase.from('videos').insert({
    section_id: sectionId,
    title,
    description: description || null,
    youtube_url: youtubeUrl,
    duration: durationSeconds ? parseInt(durationSeconds, 10) : null,
    is_preview: isPreview,
    order_index: orderIndex,
  })

  if (error) {
    return { error: '動画の作成に失敗しました' }
  }

  revalidatePath(`/admin/courses/${courseId}/sections/${sectionId}`)
  redirect(`/admin/courses/${courseId}/sections/${sectionId}`)
}

export async function updateVideo(
  videoId: string,
  sectionId: string,
  courseId: string,
  formData: FormData
) {
  const { supabase } = await requireAdminAuth()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const youtubeUrl = formData.get('youtubeUrl') as string
  const durationSeconds = formData.get('durationSeconds') as string
  const isPreview = formData.get('isPreview') === 'on'

  // バリデーション
  if (!title) {
    return { error: 'タイトルは必須です' }
  }
  if (!youtubeUrl) {
    return { error: 'YouTube URLは必須です' }
  }

  const youtubeId = extractYouTubeId(youtubeUrl)
  if (!youtubeId) {
    return { error: '無効なYouTube URLです' }
  }

  const { error } = await supabase
    .from('videos')
    .update({
      title,
      description: description || null,
      youtube_url: youtubeUrl,
      duration: durationSeconds ? parseInt(durationSeconds, 10) : null,
      is_preview: isPreview,
      updated_at: new Date().toISOString(),
    })
    .eq('id', videoId)

  if (error) {
    return { error: '動画の更新に失敗しました' }
  }

  revalidatePath(`/admin/courses/${courseId}/sections/${sectionId}`)
  redirect(`/admin/courses/${courseId}/sections/${sectionId}`)
}

export async function deleteVideo(
  videoId: string,
  sectionId: string,
  courseId: string
) {
  const { supabase } = await requireAdminAuth()

  const { error } = await supabase.from('videos').delete().eq('id', videoId)

  if (error) {
    return { error: '動画の削除に失敗しました' }
  }

  revalidatePath(`/admin/courses/${courseId}/sections/${sectionId}`)
  return { success: true }
}

export async function togglePreview(
  videoId: string,
  sectionId: string,
  courseId: string,
  isPreview: boolean
) {
  const { supabase } = await requireAdminAuth()

  const { error } = await supabase
    .from('videos')
    .update({ is_preview: isPreview })
    .eq('id', videoId)

  if (error) {
    return { error: 'プレビュー設定の更新に失敗しました' }
  }

  revalidatePath(`/admin/courses/${courseId}/sections/${sectionId}`)
  return { success: true }
}

export async function reorderVideos(
  sectionId: string,
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
      .from('videos')
      .update({ order_index: update.order_index })
      .eq('id', update.id)

    if (error) {
      return { error: '並び替えに失敗しました' }
    }
  }

  revalidatePath(`/admin/courses/${courseId}/sections/${sectionId}`)
  return { success: true }
}
