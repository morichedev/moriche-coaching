import { createServerSupabaseClient } from '@/lib/supabase/server'
import { TeamScrimsPage } from '@/components/dashboard/team/TeamScrimsPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Scrims' }

export default async function ScrimsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: member } = await supabase.from('team_members').select('team_id').eq('user_id', user.id).single()
  if (!member) return null
  const { data: scrims } = await supabase.from('scrims').select('*').eq('home_team_id', member.team_id).order('scheduled_at', { ascending: false })
  return <TeamScrimsPage scrims={scrims ?? []} teamId={member.team_id} userId={user.id} />
}
