'use client'

import { motion } from 'framer-motion'
import { Users, Calendar, CreditCard, TrendingUp, AlertCircle, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

interface Props {
  usersCount: number
  sessionsCount: number
  pendingBookings: number
  totalRevenue: number
  recentUsers: object[]
  recentBookings: object[]
  payments: { amount_cents: number; created_at: string }[]
}

export function AdminDashboardHome({ usersCount, sessionsCount, pendingBookings, totalRevenue, recentUsers, recentBookings, payments }: Props) {
  const revenueChart = payments.reduce<{ date: string; revenue: number }[]>((acc, p) => {
    const d = p.created_at.slice(0, 10)
    const existing = acc.find(a => a.date === d)
    if (existing) existing.revenue += p.amount_cents / 100
    else acc.push({ date: d, revenue: p.amount_cents / 100 })
    return acc
  }, []).slice(-14)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl">Admin Panel</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestión completa de Moriche Coaching</p>
      </div>

      {pendingBookings > 0 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 p-4 rounded-xl bg-amber-950/20 border border-amber-700/30 text-amber-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm"><span className="font-semibold">{pendingBookings} reserva{pendingBookings > 1 ? 's' : ''}</span> pendiente{pendingBookings > 1 ? 's' : ''} de confirmación.</p>
          <Link href="/admin/sessions" className="ml-auto text-xs font-semibold hover:underline flex items-center gap-1">Ver <ArrowRight className="w-3 h-3" /></Link>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total usuarios', value: usersCount, icon: <Users className="w-5 h-5" />, href: '/admin/users', color: 'text-blue-400' },
          { label: 'Sesiones totales', value: sessionsCount, icon: <Calendar className="w-5 h-5" />, href: '/admin/sessions', color: 'text-crimson-400' },
          { label: 'Reservas pendientes', value: pendingBookings, icon: <Clock className="w-5 h-5" />, href: '/admin/sessions', color: 'text-amber-400' },
          { label: 'Ingresos totales', value: formatCurrency(totalRevenue), icon: <CreditCard className="w-5 h-5" />, href: '/admin/payments', color: 'text-emerald-400' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={kpi.href} className="glass-card-hover p-5 flex flex-col gap-3">
              <div className={cn('w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center', kpi.color)}>{kpi.icon}</div>
              <div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-crimson-500" />Ingresos (14 días)</h3>
            <Link href="/admin/payments" className="text-xs text-crimson-500">Ver pagos</Link>
          </div>
          {revenueChart.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}€`]} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revG)" name="Ingresos" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm text-center py-16">Sin datos de ingresos todavía</p>}
        </motion.div>

        {/* Recent bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Reservas recientes</h3>
            <Link href="/admin/sessions" className="text-xs text-crimson-500">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {recentBookings.slice(0, 5).map((booking: object) => {
              const b = booking as { id: string; scheduled_at: string; status: string; is_free_trial: boolean; user: { full_name?: string; email?: string } | null }
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-crimson-950/40 border border-crimson-800/20 flex items-center justify-center text-xs font-bold shrink-0">
                    {new Date(b.scheduled_at).getDate()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{b.user?.full_name ?? b.user?.email ?? 'Usuario'}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(b.scheduled_at, 'd MMM, HH:mm')}</p>
                  </div>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-semibold',
                    b.status === 'confirmed' ? 'bg-emerald-950/40 text-emerald-400' :
                    b.status === 'pending' ? 'bg-amber-950/40 text-amber-400' : 'bg-red-950/40 text-red-400')}>
                    {b.is_free_trial ? 'Free' : b.status}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent users */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Usuarios recientes</h3>
          <Link href="/admin/users" className="text-xs text-crimson-500">Ver todos</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {['Usuario', 'Email', 'Rol', 'Plan', 'Registro'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user: object) => {
                const u = user as { id: string; email: string; full_name?: string; role: string; subscription_tier: string; created_at: string }
                return (
                  <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium">{u.full_name ?? '—'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-4"><span className={cn('px-2 py-0.5 rounded text-xs font-semibold', u.role === 'admin' ? 'bg-crimson-950/40 text-crimson-400' : 'bg-white/[0.05] text-muted-foreground')}>{u.role}</span></td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs bg-white/[0.05] text-muted-foreground capitalize">{u.subscription_tier}</span></td>
                    <td className="py-3 px-4 text-muted-foreground">{formatDate(u.created_at, 'd MMM yyyy')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
