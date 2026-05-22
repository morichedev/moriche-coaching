import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminUsersPage } from '@/components/dashboard/admin/AdminUsersPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Gestión de usuarios' }

export default async function AdminUsersPageRoute() {
  const supabase = await createServerSupabaseClient()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  return <AdminUsersPage users={users ?? []} />
}
