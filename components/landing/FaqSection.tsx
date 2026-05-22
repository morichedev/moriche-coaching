'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  { q: "¿Necesito un nivel mínimo para hacer coaching?", a: "No. Trabajo con jugadores desde Iron hasta Immortal. El proceso se adapta completamente a tu nivel actual, tus objetivos y tu forma de aprender." },
  { q: "¿Cómo funciona la primera sesión gratis?", a: "Reservas tu sesión, nos conectamos por Discord y analizamos tu gameplay juntos durante 30 minutos. Sin compromiso, sin tarjeta de crédito. Al final recibes un informe básico con los puntos a trabajar." },
  { q: "¿En qué plataforma se hacen las sesiones?", a: "Las sesiones se realizan por Discord (voz + pantalla compartida). Puedes compartir tu pantalla en directo o enviarme tus VODs previamente para el análisis." },
  { q: "¿Cuánto tiempo tardaré en subir de rango?", a: "Depende de tu nivel de partida y compromiso con el entrenamiento. La mayoría de jugadores ven mejora notable en 2-4 semanas. El ranking es una consecuencia de la mejora, no el objetivo en sí." },
  { q: "¿Hacéis coaching para equipos completos?", a: "Sí. El coaching de equipo incluye análisis de demos, estrategias de mapa, roles, comunicación y playbooks personalizados. Contacta para presupuesto adaptado a tu equipo." },
  { q: "¿Puedo cancelar la suscripción mensual en cualquier momento?", a: "Sí, puedes cancelar cuando quieras desde tu panel de usuario. No hay permanencia ni cargos adicionales por cancelación." },
  { q: "¿Los pagos son seguros?", a: "Totalmente. Aceptamos pagos via Stripe y PayPal, ambos con encriptación SSL y protección al comprador. En ningún momento veo ni almacenamos tus datos de pago." },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-24">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-crimson-800/40 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-4">FAQ</div>
          <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4">Preguntas <span className="text-gradient-crimson">frecuentes</span></h2>
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="glass-card overflow-hidden"
            >
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors">
                <span className="font-medium text-sm sm:text-base">{faq.q}</span>
                <span className="shrink-0 text-crimson-500">
                  {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-white/[0.04] pt-4">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
