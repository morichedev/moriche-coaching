'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Video, Plus, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { formatDate, cn } from '@/lib/utils'
import type { Booking, Session } from '@/types/database'

type Tab = 'bookings' | 'sessions'

export function AdminSessionsPage({ bookings: initial, sessions: initial2, coachId }: { bookings: Booking[], sessions: Session[], coachId: string }) {
  const [bookings, setBookings] = useState(initial)
  const [sessions, setSessions] = useState(initial2)
  const [tab, setTab] = useState<Tab>('bookings')
  const [showCreate, setShowCreate] = useState(false)
  const [newSession, setNewSession] = useState({ title: '', scheduled_at: '', duration_min: 60, player_email: '', meeting_url: '', is_free_trial: false })
  const supabase = createClient()

  const confirmBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id)
    if (error) { toast({ title: 'Error', variant: 'destructive' }); return }
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'confirmed' } : bk))
    toast({ title: 'Reserva confirmada' })
  }

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    if (error) { toast({ title: 'Error', variant: 'destructive' }); return }
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'cancelled' } : bk))
    toast({ title: 'Reserva cancelada' })
  }

  const createSession = async () => {
    if (!newSession.title || !newSession.scheduled_at) return
    const { data, error } = await supabase.from('sessions').insert({
      coach_id: coachId, title: newSession.title,
      scheduled_at: new Date(newSession.scheduled_at).toISOString(),
      duration_min: newSession.duration_min, meeting_url: newSession.meeting_url || null,
      is_free_trial: newSession.is_free_trial, status: 'scheduled',
    }).select().single()
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    setSessions(s => [data, ...s])
    toast({ title: 'Sesión creada' }); setShowCreate(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Sesiones & Reservas</h1>
          <p className="text-muted-foreground text-sm mt-1">{bookings.filter(b => b.status === 'pending').length} reservas pendientes</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-crimson flex items-center gap-2"><Plus className="w-4 h-4" />Nueva sesión</button>
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium mb-1">Título</label><input value={newSession.title} onChange={e => setNewSession(n => ({...n, title: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" /></div>
            <div><label className="block text-xs font-medium mb-1">Fecha y hora</label><input type="datetime-local" value={newSession.scheduled_at} onChange={e => setNewSession(n => ({...n, scheduled_at: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" /></div>
            <div><label className="block text-xs font-medium mb-1">Duración (min)</label><input type="number" value={newSession.duration_min} onChange={e => setNewSession(n => ({...n, duration_min: Number(e.target.value)}))} className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" /></div>
            <div><label className="block text-xs font-medium mb-1">Link de reunión</label><input value={newSession.meeting_url} onChange={e => setNewSession(n => ({...n, meeting_url: e.target.value}))} placeholder="Discord / Google Meet URL" className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowCreate(false)} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
            <button onClick={createSession} className="btn-crimson text-sm px-4 py-2">Crear sesión</button>
          </div>
        </motion.div>
      )}

      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        {(['bookings', 'sessions'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize', tab === t ? 'bg-crimson-600 text-white' : 'text-muted-foreground hover:text-foreground')}>
            {t === 'bookings' ? `Reservas (${bookings.filter(b => b.status === 'pending').length})` : 'Sesiones'}
          </button>
        ))}
      </div>

      {tab === 'bookings' ? (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="glass-card p-12 text-center"><p className="text-muted-foreground">No hay reservas.</p></div>
          ) : (
            bookings.map((booking: Booking & { user?: { full_name?: string; email?: string; rank?: string } }, i) => (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{booking.user?.full_name ?? booking.user?.email ?? 'Usuario'}</p>
                      {booking.is_free_trial && <span className="px-1.5 py-0.5 rounded bg-emerald-950/30 text-emerald-400 text-[10px] font-semibold border border-emerald-800/20">GRATIS</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{formatDate(booking.scheduled_at, "d 'de' MMMM 'a las' HH:mm")} · <span className="capitalize">{booking.session_type.replace('_',' ')}</span>
                    </p>
                    {booking.notes && <p className="text-xs text-muted-foreground mt-1 italic">&quot;{booking.notes}&quot;</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn('px-2.5 py-1 rounded-md text-xs font-semibold border',
                      booking.status === 'confirmed' ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/30' :
                      booking.status === 'pending' ? 'text-amber-400 bg-amber-950/30 border-amber-800/30' : 'text-red-400 bg-red-950/30 border-red-800/30')}>
                      {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                    </span>
                    {booking.status === 'pending' && (
                      <>
                        <button onClick={() => confirmBooking(booking.id)} className="p-2 rounded-lg bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-400 transition-colors"><Check className="w-4 h-4" /></button>
                        <button onClick={() => cancelBooking(booking.id)} className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/50 text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session: Session & { player?: { full_name?: string; email?: string } }, i) => (
            <motion.div key={session.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{session.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {session.player?.full_name ?? session.player?.email ?? 'Sin asignar'} · {formatDate(session.scheduled_at, "d MMM, HH:mm")} · {session.duration_min}min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {session.meeting_url && (
                    <a href={session.meeting_url} target="_blank" rel="noopener noreferrer"
                      className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"><Video className="w-3 h-3" />Unirse</a>
                  )}
                  <span className={cn('px-2.5 py-1 rounded-md text-xs font-semibold border',
                    session.status === 'scheduled' ? 'text-blue-400 bg-blue-950/30 border-blue-800/30' :
                    session.status === 'completed' ? 'text-gray-400 bg-gray-900/30 border-gray-700/30' : 'text-red-400 bg-red-950/30 border-red-800/30')}>
                    {session.status === 'scheduled' ? 'Programada' : session.status === 'completed' ? 'Completada' : session.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
