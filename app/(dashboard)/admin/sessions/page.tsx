import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminSessionsPage } from '@/components/dashboard/admin/AdminSessionsPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Gestión de sesiones' }

export default async function AdminSessionsRoute() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const [{ data: bookings }, { data: sessions }] = await Promise.all([
    supabase.from('bookings').select('*, user:profiles(full_name,email,rank)').order('created_at', { ascending: false }),
    supabase.from('sessions').select('*, player:profiles!sessions_player_id_fkey(full_name,email)').order('scheduled_at', { ascending: false }),
  ])
  return <AdminSessionsPage bookings={bookings ?? []} sessions={sessions ?? []} coachId={user.id} />
}
