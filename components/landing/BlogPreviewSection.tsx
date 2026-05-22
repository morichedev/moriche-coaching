'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'

const posts = [
  { slug: 'como-subir-de-rango-guia-completa', title: 'Cómo subir de rango en Valorant: la guía definitiva', excerpt: 'Estrategias probadas, mentalidad competitiva y rutinas de entrenamiento para maximizar tu progreso ranking.', category: 'Guías', readTime: 8, date: '15 Ene 2025' },
  { slug: 'mejores-agentes-para-rankear-2025', title: 'Los mejores agentes para rankear en 2025', excerpt: 'Análisis del meta actual con los agentes más efectivos para escalar en cada elo del ladder competitivo.', category: 'Meta', readTime: 5, date: '22 Ene 2025' },
  { slug: 'como-leer-el-juego-como-igl', title: 'Cómo leer el juego como un IGL', excerpt: 'Principios fundamentales del liderazgo en juego: timing, información y toma de decisiones bajo presión.', category: 'Tácticas', readTime: 12, date: '1 Feb 2025' },
]

export function BlogPreviewSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="py-24">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="flex items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-crimson-800/40 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-4">Blog</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl">Conocimiento<br /><span className="text-gradient-crimson">gratuito</span></h2>
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card-hover overflow-hidden group"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-charcoal-600 to-charcoal-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-crimson-950/30 to-transparent group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-crimson-600/90 text-white text-xs font-semibold">{post.category}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} min</div>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-semibold text-base mb-2 group-hover:text-crimson-400 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-sm text-crimson-500 hover:text-crimson-400 font-medium flex items-center gap-1 transition-colors">
                  Leer más <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
