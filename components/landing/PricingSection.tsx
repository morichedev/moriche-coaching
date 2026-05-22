'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Trophy } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'free',
    icon: <Zap className="w-5 h-5" />,
    name: 'Primera Sesión',
    price: '0',
    period: 'gratis',
    desc: 'Prueba el coaching sin compromiso',
    features: [
      '1 sesión de 30 minutos',
      'Análisis básico de tu gameplay',
      'Identificación de errores clave',
      'Plan de mejora inicial',
      'Acceso a recursos básicos',
    ],
    cta: 'Reservar sesión gratis',
    href: '/register',
    highlight: false,
    badge: null,
  },
  {
    id: 'single',
    icon: <Star className="w-5 h-5" />,
    name: 'Sesión Individual',
    price: '5',
    period: 'por sesión',
    desc: 'Una sesión completa de coaching',
    features: [
      '1 sesión de 60 minutos',
      'Análisis profundo personalizado',
      'VOD review detallado',
      'Rutina de entrenamiento',
      'Feedback escrito post-sesión',
      'Recursos y playbooks',
    ],
    cta: 'Reservar sesión',
    href: '/register?plan=single',
    highlight: false,
    badge: null,
  },
  {
    id: 'monthly',
    icon: <Trophy className="w-5 h-5" />,
    name: 'Coaching Mensual',
    price: '15',
    period: 'al mes',
    desc: 'La opción más popular para subir de rango',
    features: [
      '4 sesiones mensuales (60 min)',
      'Análisis continuo y seguimiento',
      'Revisiones de VOD ilimitadas',
      'Rutinas actualizadas semanalmente',
      'Acceso a todos los recursos premium',
      'Chat privado con el coach',
      'Métricas y tracking de progreso',
      'Estrategias y playbooks de equipo',
    ],
    cta: 'Empezar ahora',
    href: '/register?plan=monthly',
    highlight: true,
    badge: 'Más popular',
  },
]

export function PricingSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="precios" ref={ref} className="py-24 relative">
      <div className="absolute inset-0 bg-crimson-glow opacity-20" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-crimson-800/40 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-4">
            Precios
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4">
            Inversión en tu<br />
            <span className="text-gradient-crimson">mejora real</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Sin contratos largos. Sin excusas. Coaching de calidad a precio accesible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={cn(
                'relative rounded-2xl p-8 flex flex-col',
                plan.highlight
                  ? 'bg-gradient-to-b from-crimson-950/60 to-charcoal-800/80 border-2 border-crimson-600/60 shadow-crimson'
                  : 'glass-card'
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-crimson-600 text-white text-xs font-bold rounded-full tracking-wide">
                  {plan.badge}
                </div>
              )}
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-6',
                plan.highlight ? 'bg-crimson-600 text-white' : 'bg-white/[0.06] text-crimson-500')}>
                {plan.icon}
              </div>
              <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{plan.desc}</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-bold font-display">{plan.price}€</span>
                <span className="text-muted-foreground text-sm pb-1.5">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-crimson-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={plan.highlight ? 'btn-crimson text-sm text-center' : 'btn-ghost text-sm text-center'}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-muted-foreground text-sm mt-8">
          Pagos seguros vía <span className="text-foreground font-medium">Stripe</span> o{' '}
          <span className="text-foreground font-medium">PayPal</span> · Garantía de satisfacción
        </p>
      </div>
    </section>
  )
}
