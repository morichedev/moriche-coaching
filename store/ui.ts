import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  notificationsOpen: boolean
  chatOpen: boolean
  chatConversationId: string | null
  theme: 'dark' | 'light'
  setSidebarOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setNotificationsOpen: (open: boolean) => void
  setChatOpen: (open: boolean, conversationId?: string) => void
  setTheme: (theme: 'dark' | 'light') => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  notificationsOpen: false,
  chatOpen: false,
  chatConversationId: null,
  theme: 'dark',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  setChatOpen: (open, conversationId) =>
    set({ chatOpen: open, chatConversationId: conversationId ?? null }),
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
