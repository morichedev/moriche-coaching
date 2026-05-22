import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PlayerGoalsPage } from '@/components/dashboard/player/PlayerGoalsPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Mis Objetivos' }

export default async function GoalsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: goals } = await supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  return <PlayerGoalsPage goals={goals ?? []} userId={user.id} />
}
