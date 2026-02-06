'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleVideoProgress(videoId: string, completed: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (completed) {
    // Mark as completed
    const { error } = await supabase.from('user_progress').upsert(
      {
        user_id: user.id,
        video_id: videoId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,video_id',
      }
    )

    if (error) {
      throw new Error('Failed to update progress')
    }
  } else {
    // Mark as not completed
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('video_id', videoId)

    if (error) {
      throw new Error('Failed to update progress')
    }
  }

  // Revalidate the page cache
  revalidatePath(`/courses/[courseId]/videos/${videoId}`)
}
