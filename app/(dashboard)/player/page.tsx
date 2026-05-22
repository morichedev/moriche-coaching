import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PlayerDashboardHome } from '@/components/dashboard/player/PlayerDashboardHome'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mi Dashboard' }

export default async function PlayerPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [
    { data: profile },
    { data: sessions },
    { data: routines },
    { data: analytics },
    { data: goals },
    { data: notifications },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('sessions').select('*').eq('player_id', user.id).order('scheduled_at', { ascending: false }).limit(5),
    supabase.from('player_routines').select('*, routine:routines(*)').eq('user_id', user.id).limit(5),
    supabase.from('analytics').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(30),
    supabase.from('goals').select('*').eq('user_id', user.id).eq('completed', false).limit(4),
    supabase.from('notifications').select('*').eq('user_id', user.id).eq('is_read', false).limit(5),
  ])

  return (
    <PlayerDashboardHome
      profile={profile}
      sessions={sessions ?? []}
      routines={routines ?? []}
      analytics={analytics ?? []}
      goals={goals ?? []}
      notifications={notifications ?? []}
    />
  )
}
