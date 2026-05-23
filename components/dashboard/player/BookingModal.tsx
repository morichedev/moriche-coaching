'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

const schema = z.object({
  scheduled_at: z.string().min(1, 'Selecciona fecha y hora'),
  session_type: z.enum(['individual', 'team', 'vod_review', 'tactical']),
  notes: z.string().optional(),
  is_free_trial: z.boolean(),
})
type FormData = z.infer<typeof schema>

export function BookingModal({ onClose, userId }: { onClose: () => void; userId: string }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { session_type: 'individual', is_free_trial: false },
  })

  const isFree = watch('is_free_trial')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { error } = await supabase.from('bookings').insert({
      user_id: userId,
      scheduled_at: new Date(data.scheduled_at).toISOString(),
      session_type: data.session_type,
      notes: data.notes ?? null,
      is_free_trial: data.is_free_trial,
      status: 'pending',
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Reserva enviada', description: 'Te confirmaremos la sesión en breve.' })
      onClose()
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md glass-card p-6 relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-display font-bold text-xl mb-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-crimson-500" /> Reservar sesión
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Elige tu horario y nos ponemos en contacto</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-crimson-500" />Fecha y hora</label>
              <input {...register('scheduled_at')} type="datetime-local" min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 transition-all" />
              {errors.scheduled_at && <p className="text-crimson-500 text-xs mt-1">{errors.scheduled_at.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Tipo de sesión</label>
              <select {...register('session_type')}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 transition-all">
                <option value="individual">Individual (1:1)</option>
                <option value="vod_review">VOD Review</option>
                <option value="tactical">Análisis Táctico</option>
                <option value="team">Equipo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Notas (opcional)</label>
              <textarea {...register('notes')} rows={3} placeholder="¿En qué quieres trabajar? ¿Cuál es tu mayor problema en juego?"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 transition-all resize-none" />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/20">
              <input {...register('is_free_trial')} type="checkbox" id="free_trial" className="w-4 h-4 rounded" />
              <label htmlFor="free_trial" className="text-sm">
                <span className="font-medium text-emerald-400">Primera sesión gratis</span>
                <span className="text-muted-foreground ml-1">(30 min, solo primera vez)</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 text-sm">Cancelar</button>
              <button type="submit" disabled={loading} className="btn-crimson flex-1 text-sm flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {isFree ? 'Reservar gratis' : 'Reservar — 5€'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
