'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Video, Users, Crosshair, BookOpen, Target, TrendingUp } from 'lucide-react'

const services = [
  {
    icon: <Crosshair className="w-6 h-6" />,
    title: 'Sesión Individual',
    desc: 'Análisis 1:1 de tu gameplay. Identificamos errores, trabajamos mecánicas y creamos un plan de mejora personalizado.',
    tags: ['Análisis personal', 'Mecánicas', 'Mentalidad'],
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Coaching de Equipo',
    desc: 'Trabajo táctico completo: comunicación, roles, playbooks y estrategias de mapa específicas para tu equipo.',
    tags: ['Tácticas', 'Comunicación', 'Playbooks'],
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: 'VOD Review',
    desc: 'Revisión detallada de tus partidas. Timestamps de errores, decisiones, posicionamiento y toma de decisiones.',
    tags: ['Timestamps', 'Errores', 'Mejora rápida'],
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Rutinas de Entrenamiento',
    desc: 'Programas de calentamiento y ejercicios diarios diseñados para mejorar tu aim, movimiento y consistencia.',
    tags: ['Aim training', 'Warmup', 'Consistencia'],
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Análisis Táctico',
    desc: 'Anti-strats, lectura de metas, gestión de economía y toma de decisiones en situaciones clave.',
    tags: ['Anti-strats', 'Economía', 'Decisiones'],
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Seguimiento Continuo',
    desc: 'Tracking de progreso mensual con métricas, ajuste de rutinas y acceso a recursos exclusivos.',
    tags: ['Métricas', 'Progreso', 'Recursos'],
  },
]

export function ServicesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="servicios" ref={ref} className="py-24 relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-crimson-800/40 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-4">
            Servicios
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4">
            Todo lo que necesitas para<br />
            <span className="text-gradient-crimson">subir de rango</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Metodología probada con cientos de jugadores. Desde Iron hasta Immortal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card-hover p-6 group"
            >
              <div className="w-12 h-12 rounded-xl bg-crimson-950/40 border border-crimson-800/30 flex items-center justify-center text-crimson-500 mb-5 group-hover:bg-crimson-900/40 group-hover:scale-110 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.desc}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md text-xs bg-white/[0.05] text-muted-foreground border border-white/[0.06]">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
