import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PlayerMetricsPage } from '@/components/dashboard/player/PlayerMetricsPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Mis Métricas' }

export default async function MetricsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: analytics } = await supabase.from('analytics').select('*').eq('user_id', user.id).order('recorded_at', { ascending: true })
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return <PlayerMetricsPage analytics={analytics ?? []} profile={profile} userId={user.id} />
}
