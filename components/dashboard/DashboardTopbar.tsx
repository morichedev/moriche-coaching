'use client'

import { Bell, MessageCircle, Search, Menu } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function DashboardTopbar({ profile }: { profile: Profile | null }) {
  const { setCommandPaletteOpen, setNotificationsOpen, setChatOpen, toggleSidebar } = useUIStore()
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    if (!profile) return
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('is_read', false)
      setUnreadCount(count ?? 0)
    }
    fetchUnread()

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        () => setUnreadCount(c => c + 1))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile, supabase])

  return (
    <header className="sticky top-0 z-30 h-16 bg-charcoal-900/90 backdrop-blur-sm border-b border-white/[0.05] flex items-center gap-4 px-4 sm:px-6">
      <button onClick={toggleSidebar} className="lg:hidden text-muted-foreground hover:text-foreground">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/[0.10] transition-all text-sm flex-1 sm:max-w-xs"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded border border-white/[0.08] bg-white/[0.04]">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button onClick={() => setChatOpen(true)} className="relative w-9 h-9 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="w-4 h-4" />
        </button>
        <button onClick={() => setNotificationsOpen(true)} className="relative w-9 h-9 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-crimson-600 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-crimson-700 to-crimson-900 flex items-center justify-center text-sm font-bold cursor-pointer">
          {getInitials(profile?.full_name ?? profile?.email ?? 'U')}
        </div>
      </div>
    </header>
  )
}
