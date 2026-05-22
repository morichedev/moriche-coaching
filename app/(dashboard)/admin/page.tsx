import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminDashboardHome } from '@/components/dashboard/admin/AdminDashboardHome'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Admin Panel' }

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const [
    { count: usersCount },
    { count: sessionsCount },
    { count: bookingsCount },
    { data: payments },
    { data: recentUsers },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('sessions').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('payments').select('amount_cents,created_at').eq('status', 'succeeded').order('created_at'),
    supabase.from('profiles').select('id,email,full_name,role,subscription_tier,created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('bookings').select('*, user:profiles(full_name,email)').order('created_at', { ascending: false }).limit(8),
  ])

  const totalRevenue = payments?.reduce((sum, p) => sum + p.amount_cents, 0) ?? 0

  return (
    <AdminDashboardHome
      usersCount={usersCount ?? 0}
      sessionsCount={sessionsCount ?? 0}
      pendingBookings={bookingsCount ?? 0}
      totalRevenue={totalRevenue}
      recentUsers={recentUsers ?? []}
      recentBookings={recentBookings ?? []}
      payments={payments ?? []}
    />
  )
}
