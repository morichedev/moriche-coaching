'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { RANK_COLORS, RANK_LABELS } from '@/lib/utils'
import type { RankTier } from '@/types/database'

const testimonials = [
  { name: 'Carlos M.', username: '@CarlosVCT', rankBefore: 'gold' as RankTier, rankAfter: 'platinum' as RankTier, content: 'Moriche me ayudó a entender completamente mi rol como Sentinel. En 3 semanas subí 3 rangos completos. El análisis de VOD es increíblemente detallado y los playbooks que me dio cambiaron la forma en que entiendo el juego.', rating: 5 },
  { name: 'Alex R.', username: '@AlexFragger', rankBefore: 'silver' as RankTier, rankAfter: 'gold' as RankTier, content: 'Las rutinas de calentamiento que me diseñó personalmente cambiaron mi consistencia por completo. Ahora empiezo cada sesión sabiendo exactamente qué trabajar. 100% recomendado para cualquier nivel.', rating: 5 },
  { name: 'Team Nexus', username: '@TeamNexus', rankBefore: 'diamond' as RankTier, rankAfter: 'ascendant' as RankTier, content: 'El coaching de equipo fue excepcional. Analizó nuestras demos, identificó problemas de comunicación que ni nosotros veíamos y nos dio estrategias específicas por mapa. Ganamos el siguiente torneo.', rating: 5 },
  { name: 'Diego P.', username: '@DiegoIGL', rankBefore: 'platinum' as RankTier, rankAfter: 'diamond' as RankTier, content: 'El análisis táctico y los playbooks personalizados para nuestros mapas favoritos nos llevaron al siguiente nivel competitivo. Moriche entiende el juego a un nivel que pocos coaches tienen.', rating: 5 },
  { name: 'Sara L.', username: '@SaraVAL', rankBefore: 'bronze' as RankTier, rankAfter: 'silver' as RankTier, content: 'Primera vez haciendo coaching y fue una experiencia increíble. Muy profesional, paciente y con explicaciones muy claras. En pocas sesiones ya noto una mejora brutal en mi posicionamiento.', rating: 5 },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [auto, setAuto] = useState(true)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  useEffect(() => {
    if (!auto) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [auto])

  const prev = () => { setAuto(false); setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length) }
  const next = () => { setAuto(false); setCurrent((c) => (c + 1) % testimonials.length) }

  const t = testimonials[current]

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-charcoal-800/30">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="section-container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-crimson-800/40 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-4">Testimonios</div>
          <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4">Resultados <span className="text-gradient-crimson">reales</span></h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Lo que dicen los jugadores que ya pasaron por el proceso.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 lg:p-10 relative"
            >
              <div className="absolute top-6 right-8 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-crimson-500 text-crimson-500" />
                ))}
              </div>
              <blockquote className="text-lg text-foreground/90 leading-relaxed mb-8 italic">
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crimson-700 to-crimson-900 flex items-center justify-center font-display font-bold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`rank-badge ${RANK_COLORS[t.rankBefore]}`}>{RANK_LABELS[t.rankBefore]}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className={`rank-badge ${RANK_COLORS[t.rankAfter]}`}>{RANK_LABELS[t.rankAfter]}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-crimson-600/40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setAuto(false); setCurrent(i) }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-crimson-500' : 'w-1.5 bg-white/20'}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-crimson-600/40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
