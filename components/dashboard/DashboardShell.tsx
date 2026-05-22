'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store/ui'
import { useAuthStore } from '@/store/auth'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'
import { CommandPalette } from './CommandPalette'
import { ChatDrawer } from './ChatDrawer'
import { NotificationsPanel } from './NotificationsPanel'
import { motion } from 'framer-motion'
import type { Profile } from '@/types/database'
import { cn } from '@/lib/utils'

interface Props {
  profile: Profile | null
  children: React.ReactNode
}

export function DashboardShell({ profile, children }: Props) {
  const { sidebarOpen, commandPaletteOpen, chatOpen, notificationsOpen } = useUIStore()
  const { setProfile } = useAuthStore()

  useEffect(() => {
    if (profile) setProfile(profile)
  }, [profile, setProfile])

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useUIStore.getState().setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="min-h-screen bg-charcoal-900 flex">
      <DashboardSidebar profile={profile} />
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      )}>
        <DashboardTopbar profile={profile} />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
      {commandPaletteOpen && <CommandPalette />}
      {chatOpen && <ChatDrawer />}
      {notificationsOpen && <NotificationsPanel />}
    </div>
  )
}
