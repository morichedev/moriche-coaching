'use client'

import { motion } from 'framer-motion'
import { Map, Swords, Trophy, Users, ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatDate, getInitials } from '@/lib/utils'
import type { Playbook, Scrim, TeamMember } from '@/types/database'

interface Props {
  team: object
  playbooks: Playbook[]
  scrims: Scrim[]
  members: TeamMember[]
}

export function TeamDashboardHome({ team, playbooks, scrims, members }: Props) {
  const t = team as { name: string; tag: string; wins: number; losses: number; region: string }
  const winRate = t.wins + t.losses > 0 ? Math.round((t.wins / (t.wins + t.losses)) * 100) : 0
  const nextScrim = scrims.find(s => s.status === 'scheduled')

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-crimson-600/10 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-crimson-700 to-crimson-900 flex items-center justify-center text-xl font-display font-bold">{t.tag}</div>
          <div>
            <h1 className="font-display font-bold text-2xl">{t.name}</h1>
            <p className="text-muted-foreground text-sm">{t.region} · {members.length} jugadores</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Victorias', value: t.wins, color: 'text-emerald-400' },
            { label: 'Derrotas', value: t.losses, color: 'text-red-400' },
            { label: 'Win Rate', value: `${winRate}%`, color: 'text-amber-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Playbooks', value: playbooks.length, icon: <Map className="w-5 h-5" />, href: '/team/playbooks', color: 'text-blue-400' },
          { label: 'Anti-strats', value: playbooks.filter(p => p.type === 'anti_strat').length, icon: <Swords className="w-5 h-5" />, href: '/team/playbooks?type=anti_strat', color: 'text-crimson-400' },
          { label: 'Scrims', value: scrims.length, icon: <Trophy className="w-5 h-5" />, href: '/team/scrims', color: 'text-amber-400' },
          { label: 'Roster', value: members.length, icon: <Users className="w-5 h-5" />, href: '/team/roster', color: 'text-emerald-400' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={card.href} className="glass-card-hover p-5 flex flex-col gap-3 group">
              <div className={`w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center ${card.color}`}>{card.icon}</div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Next scrim */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-crimson-500" />Próximo scrim</h3>
            <Link href="/team/scrims" className="text-xs text-crimson-500">Ver todos <ArrowRight className="w-3 h-3 inline" /></Link>
          </div>
          {nextScrim ? (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="font-semibold">{nextScrim.away_team_name ?? 'Rival TBD'}</p>
              <p className="text-sm text-muted-foreground mt-1">{formatDate(nextScrim.scheduled_at, "d 'de' MMMM 'a las' HH:mm")}</p>
              {nextScrim.maps.length > 0 && <div className="flex gap-2 mt-2">{nextScrim.maps.map(m => <span key={m} className="px-2 py-0.5 rounded bg-white/[0.05] text-xs">{m}</span>)}</div>}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No hay scrims programados.</p>
              <Link href="/team/scrims" className="mt-3 btn-crimson text-xs px-4 py-2 inline-flex items-center gap-1"><Calendar className="w-3 h-3" />Programar scrim</Link>
            </div>
          )}
        </motion.div>

        {/* Roster */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-crimson-500" />Roster</h3>
            <Link href="/team/roster" className="text-xs text-crimson-500">Ver roster</Link>
          </div>
          <div className="space-y-2">
            {members.slice(0, 5).map((member) => {
              const p = member.profile as { full_name?: string; email?: string; rank?: string } | null
              return (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-crimson-700/60 to-crimson-900/60 flex items-center justify-center text-xs font-bold shrink-0">
                    {getInitials(p?.full_name ?? p?.email ?? 'P')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p?.full_name ?? p?.email ?? 'Jugador'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                  </div>
                  {p?.rank && <span className="text-xs text-muted-foreground capitalize">{p.rank}</span>}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
