import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PlayerSessionsPage } from '@/components/dashboard/player/PlayerSessionsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mis Sesiones' }

export default async function SessionsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: sessions }, { data: bookings }] = await Promise.all([
    supabase.from('sessions').select('*').eq('player_id', user.id).order('scheduled_at', { ascending: false }),
    supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return <PlayerSessionsPage sessions={sessions ?? []} bookings={bookings ?? []} userId={user.id} />
}
