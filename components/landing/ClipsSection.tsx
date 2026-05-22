'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Play, Eye } from 'lucide-react'
import { useState } from 'react'

const clips = [
  { id: 1, title: '5K en Ascent — IGL callout perfecto', views: '12.4K', duration: '0:45', thumbnail: '/images/clip1.jpg', youtubeId: null },
  { id: 2, title: 'Anti-strat ejecutada a la perfección', views: '8.7K', duration: '1:20', thumbnail: '/images/clip2.jpg', youtubeId: null },
  { id: 3, title: 'Full hold Bind B — Sentinel mastery', views: '6.2K', duration: '0:58', thumbnail: '/images/clip3.jpg', youtubeId: null },
  { id: 4, title: 'Economy win con pistols — Toma de decisión', views: '4.1K', duration: '2:10', thumbnail: '/images/clip4.jpg', youtubeId: null },
]

export function ClipsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [playing, setPlaying] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-24 bg-charcoal-800/30">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-crimson-800/40 bg-crimson-950/20 text-crimson-400 text-xs font-semibold tracking-wider uppercase mb-4">Clips</div>
          <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4">El juego en <span className="text-gradient-crimson">acción</span></h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Highlights reales del gameplay y ejemplos de las enseñanzas del coaching.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clips.map((clip, i) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative glass-card overflow-hidden cursor-pointer"
              onClick={() => setPlaying(playing === clip.id ? null : clip.id)}
            >
              <div className="aspect-video bg-gradient-to-br from-charcoal-600 to-charcoal-800 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-crimson-950/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-crimson-600/80 flex items-center justify-center group-hover:scale-110 group-hover:bg-crimson-500 transition-all duration-300 backdrop-blur-sm">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs font-mono">{clip.duration}</div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold mb-2 line-clamp-2">{clip.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" /> {clip.views} vistas
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
