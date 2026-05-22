'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Target, Trophy, Star } from 'lucide-react'

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 5,
}))

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal-900"
    >
      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Red glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-crimson-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-crimson-950/30 rounded-full blur-[80px] pointer-events-none" />

      {/* Particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-crimson-500/40"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* Scan line */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson-600/50 to-transparent pointer-events-none"
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-crimson-600/40" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-crimson-600/40" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-crimson-600/40" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-crimson-600/40" />

      <motion.div style={{ y, opacity }} className="relative z-10 section-container text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-crimson-600/30 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-crimson-500 animate-pulse" />
          Elite 5 Champion · Ascendant 3 Peak · IGL
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-8xl tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-foreground">ELEVA TU</span>
          <br />
          <span className="text-gradient-crimson text-glow">NIVEL</span>
          <br />
          <span className="text-foreground opacity-80 text-4xl sm:text-5xl lg:text-7xl">EN VALORANT</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Coaching premium con 5 años de experiencia competitiva. Análisis táctico, VOD review personalizado y
          rutinas de entrenamiento para llevar tu juego al siguiente nivel.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/register" className="btn-crimson text-base px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center">
            Primera sesión gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/#precios" className="btn-ghost text-base px-8 py-4 w-full sm:w-auto justify-center">
            Ver precios
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          {[
            { icon: <Shield className="w-4 h-4 text-crimson-500" />, text: '100% Garantizado' },
            { icon: <Target className="w-4 h-4 text-crimson-500" />, text: '+200 jugadores mejorados' },
            { icon: <Trophy className="w-4 h-4 text-crimson-500" />, text: 'Campeón Elite 5' },
            { icon: <Star className="w-4 h-4 text-crimson-500" />, text: '5.0 valoración media' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              {icon}
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-crimson-600/80 to-transparent"
        />
      </motion.div>
    </section>
  )
}
