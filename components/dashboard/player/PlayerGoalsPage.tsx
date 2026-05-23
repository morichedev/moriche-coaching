'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, CheckCircle, Calendar, Trophy } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { formatDate, RANK_COLORS, RANK_LABELS, cn } from '@/lib/utils'
import type { Goal, RankTier } from '@/types/database'

const RANKS: RankTier[] = ['iron','bronze','silver','gold','platinum','diamond','ascendant','immortal','radiant']
const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  target_rank: z.enum(['iron','bronze','silver','gold','platinum','diamond','ascendant','immortal','radiant'] as [RankTier, ...RankTier[]]).optional(),
  target_date: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export function PlayerGoalsPage({ goals: initial, userId }: { goals: Goal[], userId: string }) {
  const [goals, setGoals] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()
  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const { data: goal, error } = await supabase.from('goals').insert({ ...data, user_id: userId }).select().single()
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    setGoals(g => [goal, ...g])
    toast({ title: 'Objetivo creado' }); reset(); setShowForm(false)
  }

  const updateProgress = async (id: string, progress: number) => {
    await supabase.from('goals').update({ progress }).eq('id', id)
    setGoals(g => g.map(goal => goal.id === id ? { ...goal, progress } : goal))
  }

  const markComplete = async (id: string) => {
    await supabase.from('goals').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', id)
    setGoals(g => g.map(goal => goal.id === id ? { ...goal, completed: true } : goal))
    toast({ title: '🏆 Objetivo completado', description: '¡Enhorabuena!' })
  }

  const activeGoals = goals.filter(g => !g.completed)
  const doneGoals = goals.filter(g => g.completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Mis Objetivos</h1>
          <p className="text-muted-foreground text-sm mt-1">{activeGoals.length} objetivo{activeGoals.length !== 1 ? 's' : ''} activo{activeGoals.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-crimson flex items-center gap-2"><Plus className="w-4 h-4" />Nuevo objetivo</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Objetivo</label>
                  <input {...register('title')} placeholder="Ej: Subir a Diamante"
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Rank objetivo</label>
                  <select {...register('target_rank')} className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50">
                    <option value="">Sin rank específico</option>
                    {RANKS.map(r => <option key={r} value={r}>{RANK_LABELS[r]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Descripción</label>
                  <input {...register('description')} placeholder="Detalles adicionales..."
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Fecha límite</label>
                  <input {...register('target_date')} type="date" min={new Date().toISOString().slice(0,10)}
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
                <button type="submit" className="btn-crimson text-sm px-4 py-2">Crear objetivo</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {activeGoals.length === 0 && !showForm ? (
        <div className="glass-card p-16 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No tienes objetivos activos.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-crimson text-sm px-5 py-2.5">Crear primer objetivo</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {activeGoals.map((goal, i) => (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold">{goal.title}</h3>
                  {goal.description && <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                    {goal.target_rank && <span className={cn('rank-badge', RANK_COLORS[goal.target_rank])}>{RANK_LABELS[goal.target_rank]}</span>}
                    {goal.target_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(goal.target_date, 'd MMM yyyy')}</span>}
                  </div>
                </div>
                <button onClick={() => markComplete(goal.id)} title="Marcar como completado" className="text-muted-foreground hover:text-emerald-400 transition-colors shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progreso</span><span>{goal.progress}%</span>
                </div>
                <input type="range" min={0} max={100} value={goal.progress}
                  onChange={e => updateProgress(goal.id, Number(e.target.value))}
                  className="w-full accent-crimson-600" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {doneGoals.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" />Completados</h2>
          <div className="space-y-2">
            {doneGoals.map(goal => (
              <div key={goal.id} className="glass-card p-4 opacity-60 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm line-through text-muted-foreground">{goal.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{goal.completed_at ? formatDate(goal.completed_at, 'd MMM') : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
