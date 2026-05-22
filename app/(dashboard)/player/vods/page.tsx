import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PlayerVodsPage } from '@/components/dashboard/player/PlayerVodsPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'VOD Review' }

export default async function VodsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: vods } = await supabase.from('vod_reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  return <PlayerVodsPage vods={vods ?? []} userId={user.id} />
}
