'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const stats = [
  { value: 200, suffix: '+', label: 'Jugadores mejorados', color: 'text-crimson-500' },
  { value: 5,   suffix: ' años', label: 'Experiencia competitiva', color: 'text-crimson-400' },
  { value: 98,  suffix: '%', label: 'Tasa de satisfacción', color: 'text-crimson-500' },
  { value: 500, suffix: '+', label: 'Sesiones completadas', color: 'text-crimson-400' },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(value / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, 20)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{count}{suffix}</span>
}

export function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="relative py-20 bg-charcoal-800/50 border-y border-white/[0.04]">
      <div className="absolute inset-0 bg-crimson-glow opacity-30" />
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`font-display font-bold text-4xl lg:text-5xl mb-2 ${stat.color}`}>
                {inView ? <Counter value={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
