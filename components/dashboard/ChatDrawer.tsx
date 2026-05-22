'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { useAuthStore } from '@/store/auth'
import { createClient } from '@/lib/supabase/client'
import { timeAgo, getInitials } from '@/lib/utils'
import type { Message, Conversation } from '@/types/database'

export function ChatDrawer() {
  const { setChatOpen, chatConversationId } = useUIStore()
  const { profile } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<string | null>(chatConversationId)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!profile) return
    supabase
      .from('conversation_participants')
      .select('conversation:conversations(*)')
      .eq('user_id', profile.id)
      .then(({ data }) => setConversations((data?.map(d => d.conversation).filter(Boolean) ?? []) as Conversation[]))
  }, [profile, supabase])

  useEffect(() => {
    if (!activeConv) return
    supabase.from('messages').select('*, sender:profiles(*)').eq('conversation_id', activeConv).order('created_at').then(({ data }) => setMessages((data ?? []) as unknown as Message[]))

    const channel = supabase.channel(`conv-${activeConv}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConv}` },
        (payload) => setMessages(m => [...m, payload.new as Message]))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeConv, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !activeConv || !profile) return
    const content = input
    setInput('')
    await supabase.from('messages').insert({ conversation_id: activeConv, sender_id: profile.id, content, type: 'text' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/30"
      onClick={(e) => e.target === e.currentTarget && setChatOpen(false)}
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
            <MessageCircle className="w-5 h-5 text-crimson-500" />
            <h2 className="font-semibold">Chat</h2>
          </div>
          <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        {!activeConv ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <MessageCircle className="w-12 h-12 opacity-20" />
                <p className="text-sm">Sin conversaciones aún</p>
              </div>
            ) : (
              conversations.map(conv => (
                <button key={conv.id} onClick={() => setActiveConv(conv.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors text-left">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-700 to-crimson-900 flex items-center justify-center font-bold text-sm shrink-0">
                    {getInitials(conv.name ?? 'Chat')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{conv.name ?? 'Conversación'}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(conv.updated_at)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <button onClick={() => setActiveConv(null)} className="text-muted-foreground hover:text-foreground mr-1">←</button>
              <span className="font-medium text-sm">Moriche Coach</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-auto" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isOwn = msg.sender_id === profile?.id
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${isOwn ? 'bg-crimson-600 text-white rounded-br-sm' : 'bg-white/[0.06] text-foreground rounded-bl-sm'}`}>
                      {msg.content}
                      <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/60 text-right' : 'text-muted-foreground'}`}>{timeAgo(msg.created_at)}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50 transition-all"
                />
                <button onClick={sendMessage} disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-crimson-600 hover:bg-crimson-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
