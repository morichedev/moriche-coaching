'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { MessageCircle, Users, Zap } from 'lucide-react'

export function DiscordSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? 'https://discord.gg/morichecoaching'

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-crimson-950/20" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto glass-card p-10 lg:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/10 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="font-display font-bold text-3xl lg:text-4xl mb-4">
              Únete a la comunidad
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Discord exclusivo con estrategias diarias, análisis de meta, torneos internos y acceso directo al coach.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /> +500 miembros activos</div>
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-indigo-400" /> Torneos semanales</div>
              <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-indigo-400" /> Soporte 24/7</div>
            </div>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-indigo-900/30"
            >
              <MessageCircle className="w-5 h-5" />
              Unirme al Discord
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
