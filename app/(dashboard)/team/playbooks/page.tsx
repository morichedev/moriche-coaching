import { createServerSupabaseClient } from '@/lib/supabase/server'
import { TeamPlaybooksPage } from '@/components/dashboard/team/TeamPlaybooksPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Playbooks' }

export default async function PlaybooksPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: member } = await supabase.from('team_members').select('team_id').eq('user_id', user.id).single()
  if (!member) return null
  const { data: playbooks } = await supabase.from('playbooks').select('*').eq('team_id', member.team_id).order('created_at', { ascending: false })
  return <TeamPlaybooksPage playbooks={playbooks ?? []} teamId={member.team_id} userId={user.id} />
}
