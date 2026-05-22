'use client'

import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Target, BookOpen, Video, Bell, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate, RANK_COLORS, RANK_LABELS, cn } from '@/lib/utils'
import type { Profile, Session, PlayerRoutine, Analytics, Goal, Notification } from '@/types/database'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  profile: Profile | null
  sessions: Session[]
  routines: PlayerRoutine[]
  analytics: Analytics[]
  goals: Goal[]
  notifications: Notification[]
}

export function PlayerDashboardHome({ profile, sessions, routines, analytics, goals, notifications }: Props) {
  const nextSession = sessions.find(s => s.status === 'scheduled')
  const chartData = analytics.slice().reverse().slice(-14).map(a => ({
    date: a.recorded_at,
    rr: a.rr,
    acs: a.acs ?? 0,
    kd: a.kd_ratio ?? 0,
  }))

  const stats = [
    { label: 'Sesiones totales', value: profile?.total_sessions ?? 0, icon: <Calendar className="w-5 h-5" />, href: '/player/sessions', color: 'text-crimson-500' },
    { label: 'Horas totales', value: `${profile?.total_hours ?? 0}h`, icon: <TrendingUp className="w-5 h-5" />, href: '/player/metrics', color: 'text-blue-400' },
    { label: 'Rutinas activas', value: routines.filter(r => !r.completed).length, icon: <BookOpen className="w-5 h-5" />, href: '/player/routines', color: 'text-emerald-400' },
    { label: 'Objetivos activos', value: goals.length, icon: <Target className="w-5 h-5" />, href: '/player/goals', color: 'text-amber-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="font-display font-bold text-2xl sm:text-3xl">
            Hola, {profile?.display_name ?? profile?.full_name?.split(' ')[0] ?? 'jugador'} 👋
          </motion.h1>
          <p className="text-muted-foreground text-sm mt-1">
            {nextSession ? `Tu próxima sesión es el ${formatDate(nextSession.scheduled_at, "d 'de' MMMM 'a las' HH:mm")}` : 'No tienes sesiones próximas. ¡Reserva una!'}
          </p>
        </div>
        {profile?.rank && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={cn('rank-badge text-sm', RANK_COLORS[profile.rank])}>
            {RANK_LABELS[profile.rank]}
          </motion.div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={stat.href} className="glass-card-hover p-5 flex flex-col gap-3 group">
              <div className={cn('w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center', stat.color)}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts + sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* RR Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Progreso de rank (14 días)</h3>
            <Link href="/player/metrics" className="text-xs text-crimson-500 flex items-center gap-1 hover:text-crimson-400">Ver todo <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v} RR`]}
                />
                <Area type="monotone" dataKey="rr" stroke="#dc2626" strokeWidth={2} fill="url(#rrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
              Sin datos todavía. <Link href="/player/metrics" className="ml-1 text-crimson-500 underline">Añadir stats</Link>
            </div>
          )}
        </motion.div>

        {/* Notifications / Goals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Objetivos</h3>
            <Link href="/player/goals" className="text-xs text-crimson-500">Ver todos</Link>
          </div>
          {goals.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tienes objetivos activos.</p>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate pr-2">{goal.title}</span>
                    <span className="text-muted-foreground shrink-0">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-crimson-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Upcoming session + routines */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Next session */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-crimson-500" />Próximas sesiones</h3>
            <Link href="/player/sessions" className="text-xs text-crimson-500">Ver todas</Link>
          </div>
          {sessions.filter(s => s.status === 'scheduled').slice(0, 3).length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">No tienes sesiones programadas</p>
              <Link href="/player/sessions?book=true" className="btn-crimson text-xs px-4 py-2 inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Reservar sesión
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.filter(s => s.status === 'scheduled').slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="w-10 h-10 rounded-lg bg-crimson-950/50 border border-crimson-800/30 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-crimson-400 font-bold">{new Date(s.scheduled_at).toLocaleString('es', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-sm font-bold leading-none">{new Date(s.scheduled_at).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.scheduled_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })} · {s.duration_min} min</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Active routines */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4 text-crimson-500" />Mis rutinas</h3>
            <Link href="/player/routines" className="text-xs text-crimson-500">Ver todas</Link>
          </div>
          {routines.slice(0, 4).length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No tienes rutinas asignadas todavía.</p>
          ) : (
            <div className="space-y-3">
              {routines.slice(0, 4).map((pr) => (
                <div key={pr.id} className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', pr.completed ? 'bg-emerald-500' : 'bg-crimson-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pr.routine?.title ?? 'Rutina'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-crimson-600 rounded-full" style={{ width: `${pr.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{pr.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
