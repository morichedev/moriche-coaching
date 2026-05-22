'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Mail, MessageCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(4, 'Mínimo 4 caracteres'),
  message: z.string().min(20, 'Mínimo 20 caracteres'),
})
type FormData = z.infer<typeof schema>

export function ContactSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { toast({ title: 'Mensaje enviado', description: 'Te responderemos en menos de 24h.' }); reset() }
      else throw new Error()
    } catch {
      toast({ title: 'Error', description: 'No se pudo enviar el mensaje. Inténtalo de nuevo.', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  return (
    <section id="contacto" ref={ref} className="py-24 bg-charcoal-800/30">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-crimson-800/40 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-4">Contacto</div>
          <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4">¿Listo para mejorar?<br /><span className="text-gradient-crimson">Escríbeme</span></h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { id: 'name', label: 'Nombre', placeholder: 'Tu nombre', type: 'text' },
                { id: 'email', label: 'Email', placeholder: 'tu@email.com', type: 'email' },
                { id: 'subject', label: 'Asunto', placeholder: '¿En qué te puedo ayudar?', type: 'text' },
              ].map(({ id, label, placeholder, type }) => (
                <div key={id}>
                  <label className="block text-sm font-medium mb-1.5">{label}</label>
                  <input {...register(id as keyof FormData)} type={type} placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 focus:border-crimson-600/50 transition-all" />
                  {errors[id as keyof FormData] && <p className="text-crimson-500 text-xs mt-1">{errors[id as keyof FormData]?.message}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5">Mensaje</label>
                <textarea {...register('message')} rows={5} placeholder="Cuéntame sobre tu nivel actual, tus objetivos y en qué necesitas ayuda..."
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 focus:border-crimson-600/50 transition-all resize-none" />
                {errors.message && <p className="text-crimson-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-crimson w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
            <div className="glass-card p-6">
              <Mail className="w-6 h-6 text-crimson-500 mb-3" />
              <h4 className="font-semibold mb-1">Email directo</h4>
              <p className="text-sm text-muted-foreground">coach@morichecoaching.gg</p>
              <p className="text-xs text-muted-foreground mt-1">Respuesta en menos de 24 horas</p>
            </div>
            <div className="glass-card p-6">
              <MessageCircle className="w-6 h-6 text-indigo-400 mb-3" />
              <h4 className="font-semibold mb-1">Discord</h4>
              <p className="text-sm text-muted-foreground">moriche#0001</p>
              <p className="text-xs text-muted-foreground mt-1">Para respuestas más rápidas</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-400">Disponible ahora</span>
              </div>
              <p className="text-sm text-muted-foreground">Aceptando nuevos alumnos para el mes de Febrero. Plazas limitadas.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
