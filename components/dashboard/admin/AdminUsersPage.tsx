'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Shield, User, Trash2, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { formatDate, RANK_COLORS, RANK_LABELS, cn } from '@/lib/utils'
import type { Profile } from '@/types/database'

export function AdminUsersPage({ users: initial }: { users: Profile[] }) {
  const [users, setUsers] = useState(initial)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const supabase = createClient()

  const filtered = users.filter(u =>
    (!search || u.email.includes(search) || (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter)
  )

  const changeRole = async (id: string, role: 'admin' | 'player' | 'team') => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (error) { toast({ title: 'Error', variant: 'destructive' }); return }
    setUsers(u => u.map(user => user.id === id ? { ...user, role } : user))
    toast({ title: 'Rol actualizado' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Usuarios</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} usuarios registrados</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none bg-charcoal-800">
          <option value="">Todos los roles</option>
          <option value="player">Player</option><option value="team">Team</option><option value="admin">Admin</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Usuario', 'Email', 'Rol', 'Plan', 'Rank', 'Sesiones', 'Registro', 'Acciones'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 font-medium whitespace-nowrap">{user.full_name ?? user.username ?? '—'}</td>
                <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">{user.email}</td>
                <td className="py-3 px-4">
                  <select value={user.role} onChange={e => changeRole(user.id, e.target.value as 'admin'|'player'|'team')}
                    className={cn('px-2 py-1 rounded text-xs font-semibold border-0 bg-transparent cursor-pointer focus:outline-none',
                      user.role === 'admin' ? 'text-crimson-400' : user.role === 'team' ? 'text-blue-400' : 'text-muted-foreground')}>
                    <option value="player">Player</option><option value="team">Team</option><option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs bg-white/[0.05] capitalize">{user.subscription_tier}</span></td>
                <td className="py-3 px-4">{user.rank ? <span className={cn('rank-badge text-[10px]', RANK_COLORS[user.rank])}>{RANK_LABELS[user.rank]}</span> : '—'}</td>
                <td className="py-3 px-4 text-muted-foreground">{user.total_sessions}</td>
                <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{formatDate(user.created_at, 'd MMM yy')}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">No se encontraron usuarios</div>
        )}
      </div>
    </div>
  )
}
