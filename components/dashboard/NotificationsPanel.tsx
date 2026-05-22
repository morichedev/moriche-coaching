'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Check } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { useAuthStore } from '@/store/auth'
import { createClient } from '@/lib/supabase/client'
import { timeAgo } from '@/lib/utils'
import type { Notification } from '@/types/database'

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { setNotificationsOpen } = useUIStore()
  const { profile } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    if (!profile) return
    const fetch = async () => {
      const { data } = await supabase.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(20)
      setNotifications(data ?? [])
    }
    fetch()
  }, [profile, supabase])

  const markAllRead = async () => {
    if (!profile) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id).eq('is_read', false)
    setNotifications(n => n.map(item => ({ ...item, is_read: true })))
  }

  const iconByType = { session: '📅', payment: '💳', message: '💬', system: '🔔', achievement: '🏆' }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/30"
        onClick={(e) => e.target === e.currentTarget && setNotificationsOpen(false)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-full max-w-sm bg-charcoal-800 border-l border-white/[0.06] flex flex-col"
        >
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-crimson-500" />
              <h2 className="font-semibold">Notificaciones</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={markAllRead} className="text-xs text-crimson-500 hover:text-crimson-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Marcar todo leído
              </button>
              <button onClick={() => setNotificationsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Bell className="w-12 h-12 opacity-20" />
                <p className="text-sm">Sin notificaciones</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${!n.is_read ? 'bg-crimson-950/10' : ''}`}>
                  <span className="text-xl shrink-0">{iconByType[n.type]}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                    {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-crimson-500 mt-1.5 shrink-0" />}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
