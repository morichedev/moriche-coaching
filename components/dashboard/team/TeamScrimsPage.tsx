'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Plus, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { formatDate, VALORANT_MAPS, cn } from '@/lib/utils'
import type { Scrim } from '@/types/database'

export function TeamScrimsPage({ scrims: initial, teamId, userId }: { scrims: Scrim[], teamId: string, userId: string }) {
  const [scrims, setScrims] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ away_team_name: '', scheduled_at: '', maps: [] as string[], notes: '' })
  const supabase = createClient()

  const handleCreate = async () => {
    if (!form.away_team_name || !form.scheduled_at) return
    const { data, error } = await supabase.from('scrims').insert({ home_team_id: teamId, created_by: userId, ...form, maps: form.maps, status: 'scheduled' }).select().single()
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    setScrims(s => [data, ...s])
    toast({ title: 'Scrim programado' }); setShowForm(false)
    setForm({ away_team_name: '', scheduled_at: '', maps: [], notes: '' })
  }

  const statusIcon = (s: string) => s === 'completed' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : s === 'cancelled' ? <XCircle className="w-4 h-4 text-red-400" /> : <Clock className="w-4 h-4 text-blue-400" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Scrims</h1>
          <p className="text-muted-foreground text-sm mt-1">{scrims.filter(s => s.status === 'scheduled').length} scrim{scrims.filter(s => s.status === 'scheduled').length !== 1 ? 's' : ''} próximo{scrims.filter(s => s.status === 'scheduled').length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-crimson flex items-center gap-2"><Plus className="w-4 h-4" />Programar scrim</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium mb-1">Rival</label>
                <input value={form.away_team_name} onChange={e => setForm(f => ({...f, away_team_name: e.target.value}))} placeholder="Nombre del equipo rival"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" /></div>
              <div><label className="block text-xs font-medium mb-1">Fecha y hora</label>
                <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({...f, scheduled_at: e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" /></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium mb-2">Mapas</label>
                <div className="flex flex-wrap gap-2">{VALORANT_MAPS.map(m => (
                  <button key={m} onClick={() => setForm(f => ({...f, maps: f.maps.includes(m) ? f.maps.filter(x => x !== m) : [...f.maps, m]}))}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', form.maps.includes(m) ? 'bg-crimson-600/20 border-crimson-600/40 text-crimson-400' : 'bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:border-white/20')}>{m}</button>
                ))}</div></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1">Notas</label>
                <input value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Server, condiciones, etc."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" /></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
              <button onClick={handleCreate} className="btn-crimson text-sm px-4 py-2">Programar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {scrims.length === 0 ? (
        <div className="glass-card p-16 text-center"><Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No hay scrims programados.</p></div>
      ) : (
        <div className="space-y-3">
          {scrims.map((scrim, i) => (
            <motion.div key={scrim.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 shrink-0">{statusIcon(scrim.status)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">vs {scrim.away_team_name ?? 'TBD'}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />{formatDate(scrim.scheduled_at, "d 'de' MMMM, HH:mm")}
                  </p>
                  {scrim.maps.length > 0 && <div className="flex gap-1.5 mt-2">{scrim.maps.map(m => <span key={m} className="px-2 py-0.5 rounded bg-white/[0.05] text-xs">{m}</span>)}</div>}
                </div>
                {scrim.result && (
                  <div className="text-center shrink-0">
                    <p className="text-lg font-bold">{scrim.result.home} <span className="text-muted-foreground">-</span> {scrim.result.away}</p>
                    <p className={`text-xs font-semibold ${scrim.result.home > scrim.result.away ? 'text-emerald-400' : 'text-red-400'}`}>{scrim.result.home > scrim.result.away ? 'Victoria' : 'Derrota'}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
