'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Analytics, Profile } from '@/types/database'

const schema = z.object({
  recorded_at: z.string(),
  rr: z.number().min(0).max(100),
  acs: z.number().min(0).optional(),
  kd_ratio: z.number().min(0).optional(),
  hs_percent: z.number().min(0).max(100).optional(),
  matches_played: z.number().min(0),
  wins: z.number().min(0),
})
type FormData = z.infer<typeof schema>

export function PlayerMetricsPage({ analytics, profile, userId }: { analytics: Analytics[], profile: Profile | null, userId: string }) {
  const [showForm, setShowForm] = useState(false)
  const [data, setData] = useState(analytics)
  const supabase = createClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { recorded_at: new Date().toISOString().slice(0,10), matches_played: 0, wins: 0, rr: 0 } })

  const onSubmit = async (form: FormData) => {
    const { data: inserted, error } = await supabase.from('analytics').upsert({ ...form, user_id: userId }).select().single()
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    setData(d => [...d.filter(a => a.recorded_at !== form.recorded_at), inserted].sort((a,b) => a.recorded_at.localeCompare(b.recorded_at)))
    toast({ title: 'Stats guardadas' })
    reset(); setShowForm(false)
  }

  const last = data[data.length - 1]
  const prev = data[data.length - 2]
  const rrChange = last && prev ? last.rr - prev.rr : 0

  const chartData = data.slice(-30).map(a => ({ date: a.recorded_at.slice(5), rr: a.rr, acs: a.acs ?? 0, kd: a.kd_ratio ?? 0, hs: a.hs_percent ?? 0 }))

  const radarData = last ? [
    { subject: 'ACS', value: Math.min(100, ((last.acs ?? 0) / 300) * 100) },
    { subject: 'K/D', value: Math.min(100, ((last.kd_ratio ?? 0) / 2) * 100) },
    { subject: 'HS%', value: last.hs_percent ?? 0 },
    { subject: 'Win%', value: last.win_rate ?? 0 },
    { subject: 'RR', value: last.rr },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Métricas de rendimiento</h1>
          <p className="text-muted-foreground text-sm mt-1">Tracking de tu progreso competitivo</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-crimson flex items-center gap-2"><Plus className="w-4 h-4" />Añadir stats</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'recorded_at', label: 'Fecha', type: 'date' },
              { id: 'rr', label: 'RR (0-100)', type: 'number' },
              { id: 'acs', label: 'ACS', type: 'number' },
              { id: 'kd_ratio', label: 'K/D', type: 'number' },
              { id: 'hs_percent', label: 'HS%', type: 'number' },
              { id: 'matches_played', label: 'Partidas', type: 'number' },
              { id: 'wins', label: 'Victorias', type: 'number' },
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label className="block text-xs font-medium mb-1">{label}</label>
                <input {...register(id as keyof FormData, { valueAsNumber: type === 'number' })} type={type}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" />
              </div>
            ))}
            <div className="col-span-2 sm:col-span-4 flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
              <button type="submit" className="btn-crimson text-sm px-4 py-2">Guardar</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'RR Actual', value: last?.rr ?? '-', change: rrChange, suffix: '' },
          { label: 'ACS Promedio', value: last?.acs?.toFixed(0) ?? '-', change: 0, suffix: '' },
          { label: 'K/D Ratio', value: last?.kd_ratio?.toFixed(2) ?? '-', change: 0, suffix: '' },
          { label: 'Headshot %', value: last?.hs_percent?.toFixed(1) ?? '-', change: 0, suffix: '%' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5">
            <p className="text-xs text-muted-foreground mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold">{kpi.value}{kpi.suffix}</p>
            {kpi.change !== 0 && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${kpi.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change > 0 ? '+' : ''}{kpi.change}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-semibold mb-4">Progreso RR (últimas 30 sesiones)</h3>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rrG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="rr" stroke="#dc2626" strokeWidth={2} fill="url(#rrG)" name="RR" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm text-center py-16">Añade al menos 2 registros para ver el gráfico</p>}
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Perfil de habilidades</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Radar name="Stats" dataKey="value" stroke="#dc2626" fill="#dc2626" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm text-center py-16">Sin datos</p>}
        </div>
      </div>

      {/* ACS + KD chart */}
      {chartData.length > 1 && (
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">ACS y K/D histórico</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="acs" stroke="#60a5fa" strokeWidth={2} dot={false} name="ACS" />
              <Line type="monotone" dataKey="kd" stroke="#a78bfa" strokeWidth={2} dot={false} name="K/D×100" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
