'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Shield, Trophy, Target, Crosshair, BookOpen, Users } from 'lucide-react'
import { RANK_COLORS } from '@/lib/utils'

const achievements = [
  { icon: <Trophy className="w-5 h-5" />, title: 'Campeón Elite 5', desc: 'Máximo logro en torneos locales' },
  { icon: <Shield className="w-5 h-5" />, title: 'Ascendant 3 Peak', desc: 'Top percentil competitivo EU' },
  { icon: <Target className="w-5 h-5" />, title: 'IGL Especializado', desc: 'In-Game Leader táctico y estratégico' },
  { icon: <Crosshair className="w-5 h-5" />, title: '5 años de experiencia', desc: 'Desde los inicios de Valorant' },
  { icon: <BookOpen className="w-5 h-5" />, title: 'Análisis profundo', desc: 'VOD review, anti-strats, playbooks' },
  { icon: <Users className="w-5 h-5" />, title: '+200 alumnos', desc: 'Jugadores individuales y equipos' },
]

export function CoachProfileSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-crimson-800/40 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-6">
              Tu Coach
            </div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4 leading-tight">
              Moriche —<br />
              <span className="text-gradient-crimson">Estratega de élite</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Con 5 años de experiencia competitiva en Valorant, he analizado miles de partidas, liderado equipos a
              campeonatos y desarrollado metodologías probadas para acelerar el progreso de jugadores de todos los niveles.
              Mi enfoque es claro: entender tu juego, identificar los bloqueos y aplicar soluciones concretas.
            </p>

            <div className="flex items-center gap-3 mb-8">
              <div className={`rank-badge ${RANK_COLORS.ascendant}`}>
                Ascendant 3 Peak
              </div>
              <div className="rank-badge border-yellow-600/40 bg-yellow-950/20 text-yellow-400">
                Elite 5 Champion
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  className="glass-card p-4"
                >
                  <div className="text-crimson-500 mb-2">{a.icon}</div>
                  <div className="text-sm font-semibold mb-0.5">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative glass-card p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-crimson-600/10 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
              <div className="relative z-10">
                {/* Avatar placeholder */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-crimson-600 to-crimson-900 flex items-center justify-center text-3xl font-display font-bold mb-6 shadow-crimson">
                  M
                </div>
                <h3 className="font-display font-bold text-2xl mb-1">MORICHE</h3>
                <p className="text-muted-foreground text-sm mb-6">Valorant Coach · IGL · Analyst</p>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Rank pico', value: 'Ascendant 3' },
                    { label: 'Rol principal', value: 'IGL / Controller' },
                    { label: 'Agentes', value: 'Omen, Brimstone, Viper' },
                    { label: 'Región', value: 'EU — Spain' },
                    { label: 'Idiomas', value: 'Español · English' },
                    { label: 'Experiencia', value: '5 años' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
