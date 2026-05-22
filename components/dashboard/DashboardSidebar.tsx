'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Video, BookOpen, Target,
  TrendingUp, MessageCircle, Bell, Download, Trophy,
  Users, Map, Swords, BarChart3, Settings, LogOut,
  Shield, FileText, Zap, CreditCard, ChevronLeft
} from 'lucide-react'
import { cn, RANK_COLORS, RANK_LABELS, getInitials } from '@/lib/utils'
import { useUIStore } from '@/store/ui'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types/database'

const playerNav = [
  { label: 'Dashboard', href: '/player', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Sesiones', href: '/player/sessions', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Rutinas', href: '/player/routines', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'VOD Review', href: '/player/vods', icon: <Video className="w-4 h-4" /> },
  { label: 'Calendario', href: '/player/calendar', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Métricas', href: '/player/metrics', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Objetivos', href: '/player/goals', icon: <Target className="w-4 h-4" /> },
  { label: 'Recursos', href: '/player/resources', icon: <Download className="w-4 h-4" /> },
  { label: 'Chat', href: '/player/chat', icon: <MessageCircle className="w-4 h-4" /> },
  { label: 'Notificaciones', href: '/player/notifications', icon: <Bell className="w-4 h-4" /> },
]

const teamNav = [
  { label: 'Dashboard', href: '/team', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Playbooks', href: '/team/playbooks', icon: <Map className="w-4 h-4" /> },
  { label: 'Anti-strats', href: '/team/playbooks?type=anti_strat', icon: <Swords className="w-4 h-4" /> },
  { label: 'Scrims', href: '/team/scrims', icon: <Trophy className="w-4 h-4" /> },
  { label: 'Roster', href: '/team/roster', icon: <Users className="w-4 h-4" /> },
  { label: 'Analytics', href: '/team/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Recursos', href: '/team/resources', icon: <Download className="w-4 h-4" /> },
]

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Usuarios', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Sesiones', href: '/admin/sessions', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Pagos', href: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Contenido', href: '/admin/content', icon: <FileText className="w-4 h-4" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Blog', href: '/admin/blog', icon: <FileText className="w-4 h-4" /> },
  { label: 'Notificaciones', href: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
]

export function DashboardSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const router = useRouter()
  const supabase = createClient()

  const navItems = profile?.role === 'admin' ? adminNav : profile?.role === 'team' ? teamNav : playerNav

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 64 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full z-40 bg-charcoal-800/80 backdrop-blur-sm border-r border-white/[0.05] flex flex-col overflow-hidden hidden lg:flex"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.05] shrink-0">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 shrink-0 bg-crimson-600 rounded rotate-45 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white -rotate-45" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-bold text-lg whitespace-nowrap overflow-hidden"
              >
                MORICHE<span className="text-crimson-500">.</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={toggleSidebar}
          className="ml-auto shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* Profile mini */}
      {profile && sidebarOpen && (
        <div className="px-4 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-crimson-700 to-crimson-900 flex items-center justify-center text-sm font-bold shrink-0">
              {getInitials(profile.full_name ?? profile.email ?? 'U')}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{profile.display_name ?? profile.full_name ?? 'Usuario'}</p>
              {profile.rank && (
                <span className={cn('rank-badge text-[10px]', RANK_COLORS[profile.rank])}>
                  {RANK_LABELS[profile.rank]}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 no-scrollbar">
        {sidebarOpen && (
          <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            {profile?.role === 'admin' ? 'Admin Panel' : profile?.role === 'team' ? 'Team' : 'Player'}
          </p>
        )}
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/player' && item.href !== '/team' && item.href !== '/admin' && pathname.startsWith(item.href.split('?')[0]))
            return (
              <Link key={item.href} href={item.href}
                className={cn('sidebar-item', isActive && 'active', !sidebarOpen && 'justify-center px-0')}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </div>

        {/* Bottom items */}
        <div className="mt-6 pt-4 border-t border-white/[0.05] space-y-0.5">
          <Link href="/player/settings" className={cn('sidebar-item', !sidebarOpen && 'justify-center px-0')}>
            <Settings className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="text-sm">Configuración</span>}
          </Link>
          <button onClick={handleSignOut} className={cn('sidebar-item w-full hover:text-crimson-400', !sidebarOpen && 'justify-center px-0')}>
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="text-sm">Cerrar sesión</span>}
          </button>
        </div>
      </nav>

      {/* Role badge bottom */}
      {sidebarOpen && profile?.role === 'admin' && (
        <div className="p-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-crimson-950/40 border border-crimson-800/30">
            <Shield className="w-4 h-4 text-crimson-500" />
            <span className="text-xs font-semibold text-crimson-400">Admin</span>
          </div>
        </div>
      )}
    </motion.aside>
  )
}
