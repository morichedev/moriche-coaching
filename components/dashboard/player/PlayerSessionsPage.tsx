'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import type { Session, Booking } from '@/types/database'
import { BookingModal } from './BookingModal'

type Tab = 'upcoming' | 'past' | 'bookings'

const statusConfig = {
  scheduled:   { label: 'Programada', color: 'text-blue-400 bg-blue-950/30 border-blue-800/30', icon: <Clock className="w-3 h-3" /> },
  in_progress: { label: 'En curso', color: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/30', icon: <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" /> },
  completed:   { label: 'Completada', color: 'text-gray-400 bg-gray-900/30 border-gray-700/30', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled:   { label: 'Cancelada', color: 'text-red-400 bg-red-950/30 border-red-800/30', icon: <XCircle className="w-3 h-3" /> },
  no_show:     { label: 'No presentado', color: 'text-amber-400 bg-amber-950/30 border-amber-800/30', icon: <AlertCircle className="w-3 h-3" /> },
}

export function PlayerSessionsPage({ sessions, bookings, userId }: { sessions: Session[], bookings: Booking[], userId: string }) {
  const [tab, setTab] = useState<Tab>('upcoming')
  const [bookingOpen, setBookingOpen] = useState(false)

  const upcoming = sessions.filter(s => s.status === 'scheduled' || s.status === 'in_progress')
  const past = sessions.filter(s => s.status === 'completed' || s.status === 'cancelled' || s.status === 'no_show')
  const displayed = tab === 'upcoming' ? upcoming : tab === 'past' ? past : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Mis Sesiones</h1>
          <p className="text-muted-foreground text-sm mt-1">{upcoming.length} sesión{upcoming.length !== 1 ? 'es' : ''} próxima{upcoming.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setBookingOpen(true)} className="btn-crimson flex items-center gap-2">
          <Plus className="w-4 h-4" /> Reservar sesión
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        {([['upcoming', 'Próximas'], ['past', 'Historial'], ['bookings', 'Reservas']] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', tab === t ? 'bg-crimson-600 text-white shadow-crimson-sm' : 'text-muted-foreground hover:text-foreground')}>
            {label}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {tab !== 'bookings' ? (
        <div className="space-y-3">
          {displayed.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{tab === 'upcoming' ? 'No tienes sesiones próximas.' : 'No tienes sesiones pasadas.'}</p>
              {tab === 'upcoming' && <button onClick={() => setBookingOpen(true)} className="mt-4 btn-crimson text-sm px-5 py-2.5">Reservar primera sesión</button>}
            </div>
          ) : (
            displayed.map((session, i) => {
              const status = statusConfig[session.status]
              return (
                <motion.div key={session.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card-hover p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-crimson-950/40 border border-crimson-800/20 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] text-crimson-400 font-bold uppercase">{new Date(session.scheduled_at).toLocaleString('es', { month: 'short' })}</span>
                        <span className="text-base font-bold leading-none">{new Date(session.scheduled_at).getDate()}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold">{session.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(session.scheduled_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>{session.duration_min} min</span>
                          <span className="capitalize">{session.session_type.replace('_', ' ')}</span>
                          {session.is_free_trial && <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 text-[10px] font-semibold">GRATIS</span>}
                        </div>
                        {session.feedback && <p className="mt-2 text-sm text-muted-foreground line-clamp-2 italic">"{session.feedback}"</p>}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {session.meeting_url && session.status === 'scheduled' && (
                        <a href={session.meeting_url} target="_blank" rel="noopener noreferrer" className="btn-crimson text-xs px-3 py-1.5 flex items-center gap-1.5">
                          <Video className="w-3 h-3" /> Unirse
                        </a>
                      )}
                      <span className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border', status.color)}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">No tienes reservas pendientes.</p>
            </div>
          ) : (
            bookings.map((booking, i) => (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{formatDate(booking.scheduled_at, "d 'de' MMMM, HH:mm")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{booking.session_type.replace('_', ' ')} · {booking.is_free_trial ? 'Sesión gratuita' : 'Sesión de pago'}</p>
                  </div>
                  <span className={cn('px-2.5 py-1 rounded-md text-xs font-semibold border',
                    booking.status === 'confirmed' ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/30' :
                    booking.status === 'pending' ? 'text-amber-400 bg-amber-950/30 border-amber-800/30' :
                    'text-red-400 bg-red-950/30 border-red-800/30'
                  )}>
                    {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} userId={userId} />}
    </div>
  )
}
