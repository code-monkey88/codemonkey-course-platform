import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 認証が必要なルート
const protectedRoutes = ['/dashboard', '/profile']

// 管理者権限が必要なルート
const adminRoutes = ['/admin']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 重要: createServerClient と supabase.auth.getUser() の間で
  // ロジックを挟まないこと。単純なミスでも、ユーザーが予期せず
  // ログアウトしてしまう問題をデバッグするのが非常に困難になる。

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 保護ルートのチェック
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 未認証で保護ルートにアクセスした場合
  if (!user && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 管理者ルートのチェック
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      // 403ページへリダイレクト
      return NextResponse.redirect(new URL('/forbidden', request.url))
    }
  }

  return supabaseResponse
}
