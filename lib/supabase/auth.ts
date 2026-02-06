import { createClient } from './server'
import type { Profile } from '@/lib/types'

/**
 * 現在のユーザーを取得
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * 現在のユーザーのプロフィールを取得
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * 現在のユーザーが管理者かどうかを確認
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile()
  return profile?.role === 'admin'
}

/**
 * 認証が必要なページで使用するガード関数
 * 未認証の場合はnullを返す
 */
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    return { user: null, profile: null }
  }

  const profile = await getCurrentProfile()

  return { user, profile }
}

/**
 * 管理者権限が必要なページで使用するガード関数
 */
export async function requireAdmin() {
  const { user, profile } = await requireAuth()

  if (!user || !profile) {
    return { user: null, profile: null, isAdmin: false }
  }

  return {
    user,
    profile,
    isAdmin: profile.role === 'admin',
  }
}
