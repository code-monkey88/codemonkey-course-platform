import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/forbidden')
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar - desktop only */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <AdminHeader
          profile={{
            display_name: profile.display_name,
            email: profile.email,
            avatar_url: profile.avatar_url,
          }}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
