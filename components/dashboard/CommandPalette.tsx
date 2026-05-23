'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Calendar, Video, BookOpen, Target, TrendingUp, Settings, LayoutDashboard, X } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { cn } from '@/lib/utils'

const commands = [
  { label: 'Dashboard', href: '/player', icon: <LayoutDashboard className="w-4 h-4" />, category: 'Navegación' },
  { label: 'Sesiones', href: '/player/sessions', icon: <Calendar className="w-4 h-4" />, category: 'Navegación' },
  { label: 'Rutinas', href: '/player/routines', icon: <BookOpen className="w-4 h-4" />, category: 'Navegación' },
  { label: 'VOD Review', href: '/player/vods', icon: <Video className="w-4 h-4" />, category: 'Navegación' },
  { label: 'Métricas', href: '/player/metrics', icon: <TrendingUp className="w-4 h-4" />, category: 'Navegación' },
  { label: 'Objetivos', href: '/player/goals', icon: <Target className="w-4 h-4" />, category: 'Navegación' },
  { label: 'Configuración', href: '/player/settings', icon: <Settings className="w-4 h-4" />, category: 'Cuenta' },
]

export function CommandPalette() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const { setCommandPaletteOpen } = useUIStore()
  const router = useRouter()

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCommandPaletteOpen(false)
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0))
      if (e.key === 'Enter' && filtered[selected]) {
        router.push(filtered[selected].href)
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [filtered, selected, router, setCommandPaletteOpen])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
      onClick={(e) => e.target === e.currentTarget && setCommandPaletteOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-lg glass-card overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar páginas, acciones..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setCommandPaletteOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">Sin resultados para &quot;{query}&quot;</p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.href}
                onMouseEnter={() => setSelected(i)}
                onClick={() => { router.push(cmd.href); setCommandPaletteOpen(false) }}
                className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left', i === selected ? 'bg-crimson-950/40 text-foreground' : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground')}
              >
                <span className={cn(i === selected ? 'text-crimson-500' : 'text-muted-foreground')}>{cmd.icon}</span>
                <span>{cmd.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{cmd.category}</span>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center gap-4 text-[10px] text-muted-foreground">
          <span>↑↓ navegar</span><span>↵ abrir</span><span>Esc cerrar</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
