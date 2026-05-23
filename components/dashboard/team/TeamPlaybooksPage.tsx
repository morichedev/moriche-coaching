'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Plus, Eye, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { VALORANT_MAPS, cn } from '@/lib/utils'
import type { Playbook } from '@/types/database'

const typeColors = {
  strategy: 'text-blue-400 bg-blue-950/30 border-blue-800/30',
  anti_strat: 'text-crimson-400 bg-crimson-950/30 border-crimson-800/30',
  default: 'text-gray-400 bg-gray-900/30 border-gray-700/30',
  exec: 'text-purple-400 bg-purple-950/30 border-purple-800/30',
}
const typeLabels = { strategy: 'Estrategia', anti_strat: 'Anti-Strat', default: 'Default', exec: 'Exec' }

export function TeamPlaybooksPage({ playbooks: initial, teamId, userId }: { playbooks: Playbook[], teamId: string, userId: string }) {
  const [playbooks, setPlaybooks] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState({ map: '', type: '', side: '' })
  const [form, setForm] = useState({ title: '', description: '', map: '', side: 'attack', type: 'strategy', content: '' })
  const supabase = createClient()

  const filtered = playbooks.filter(p =>
    (!filter.map || p.map === filter.map) &&
    (!filter.type || p.type === filter.type) &&
    (!filter.side || p.side === filter.side)
  )

  const handleCreate = async () => {
    if (!form.title || !form.map) { toast({ title: 'Rellena título y mapa', variant: 'destructive' }); return }
    const { data, error } = await supabase.from('playbooks').insert({
      team_id: teamId, created_by: userId,
      title: form.title, description: form.description, map: form.map,
      side: form.side, type: form.type,
      content: { description: form.content, steps: [] },
    }).select().single()
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    setPlaybooks(p => [data, ...p])
    toast({ title: 'Playbook creado' }); setShowForm(false)
    setForm({ title: '', description: '', map: '', side: 'attack', type: 'strategy', content: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Playbooks</h1>
          <p className="text-muted-foreground text-sm mt-1">Estrategias, anti-strats y execs del equipo</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-crimson flex items-center gap-2"><Plus className="w-4 h-4" />Nuevo playbook</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-6">
            <h3 className="font-semibold mb-4">Crear playbook</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium mb-1">Título</label>
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" /></div>
              <div><label className="block text-xs font-medium mb-1">Mapa</label>
                <select value={form.map} onChange={e => setForm(f => ({...f, map: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 bg-charcoal-800">
                  <option value="">Seleccionar mapa</option>
                  {VALORANT_MAPS.map(m => <option key={m} value={m}>{m}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium mb-1">Lado</label>
                <select value={form.side} onChange={e => setForm(f => ({...f, side: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 bg-charcoal-800">
                  <option value="attack">Ataque</option><option value="defense">Defensa</option><option value="both">Ambos</option>
                </select></div>
              <div><label className="block text-xs font-medium mb-1">Tipo</label>
                <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 bg-charcoal-800">
                  <option value="strategy">Estrategia</option><option value="anti_strat">Anti-Strat</option><option value="exec">Exec</option><option value="default">Default</option>
                </select></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1">Descripción táctica</label>
                <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} rows={4} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 resize-none" /></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
              <button onClick={handleCreate} className="btn-crimson text-sm px-4 py-2">Crear playbook</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filter.map} onChange={e => setFilter(f => ({...f, map: e.target.value}))}
          className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm bg-charcoal-800 focus:outline-none focus:ring-2 focus:ring-crimson-600/50">
          <option value="">Todos los mapas</option>
          {VALORANT_MAPS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filter.type} onChange={e => setFilter(f => ({...f, type: e.target.value}))}
          className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm bg-charcoal-800 focus:outline-none focus:ring-2 focus:ring-crimson-600/50">
          <option value="">Todos los tipos</option>
          <option value="strategy">Estrategia</option><option value="anti_strat">Anti-Strat</option>
          <option value="exec">Exec</option><option value="default">Default</option>
        </select>
        <select value={filter.side} onChange={e => setFilter(f => ({...f, side: e.target.value}))}
          className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm bg-charcoal-800 focus:outline-none focus:ring-2 focus:ring-crimson-600/50">
          <option value="">Todos los lados</option>
          <option value="attack">Ataque</option><option value="defense">Defensa</option><option value="both">Ambos</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Map className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No hay playbooks con estos filtros.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pb, i) => (
            <motion.div key={pb.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card-hover p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{pb.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{pb.map} · {pb.side === 'attack' ? 'Ataque' : pb.side === 'defense' ? 'Defensa' : 'Ambos'}</p>
                </div>
                <span className={cn('px-2 py-0.5 rounded text-xs font-semibold border ml-2 shrink-0', typeColors[pb.type as keyof typeof typeColors] ?? typeColors.default)}>
                  {typeLabels[pb.type as keyof typeof typeLabels] ?? pb.type}
                </span>
              </div>
              {pb.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{pb.description}</p>}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" />Ver</button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" />Editar</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
