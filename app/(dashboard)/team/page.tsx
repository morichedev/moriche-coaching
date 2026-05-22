import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeamDashboardHome } from '@/components/dashboard/team/TeamDashboardHome'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Team Dashboard' }

export default async function TeamPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase.from('team_members').select('*, team:teams(*)').eq('user_id', user.id).single()
  if (!member?.team) redirect('/player')

  const teamId = (member.team as { id: string }).id
  const [{ data: playbooks }, { data: scrims }, { data: members }] = await Promise.all([
    supabase.from('playbooks').select('*').eq('team_id', teamId).limit(5),
    supabase.from('scrims').select('*').eq('home_team_id', teamId).order('scheduled_at', { ascending: true }).limit(5),
    supabase.from('team_members').select('*, profile:profiles(*)').eq('team_id', teamId),
  ])

  return <TeamDashboardHome team={member.team as object} playbooks={playbooks ?? []} scrims={scrims ?? []} members={members ?? []} />
}
