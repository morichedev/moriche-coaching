import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import type { RankTier } from '@/types/database'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = 'PPP') {
  return format(new Date(date), fmt, { locale: es })
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export function formatCurrency(cents: number, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100)
}

export const RANK_COLORS: Record<RankTier, string> = {
  iron:       'text-gray-400 border-gray-600 bg-gray-900/30',
  bronze:     'text-amber-600 border-amber-700 bg-amber-950/30',
  silver:     'text-gray-300 border-gray-500 bg-gray-800/30',
  gold:       'text-yellow-400 border-yellow-600 bg-yellow-950/30',
  platinum:   'text-cyan-400 border-cyan-600 bg-cyan-950/30',
  diamond:    'text-blue-400 border-blue-600 bg-blue-950/30',
  ascendant:  'text-emerald-400 border-emerald-600 bg-emerald-950/30',
  immortal:   'text-rose-400 border-rose-600 bg-rose-950/30',
  radiant:    'text-yellow-300 border-yellow-400 bg-yellow-950/40',
}

export const RANK_LABELS: Record<RankTier, string> = {
  iron: 'Iron', bronze: 'Bronze', silver: 'Silver', gold: 'Gold',
  platinum: 'Platinum', diamond: 'Diamond', ascendant: 'Ascendant',
  immortal: 'Immortal', radiant: 'Radiant',
}

export const VALORANT_MAPS = [
  'Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 'Icebox',
  'Lotus', 'Pearl', 'Split', 'Sunset', 'Abyss'
]

export const VALORANT_AGENTS = [
  'Brimstone', 'Viper', 'Omen', 'Killjoy', 'Cypher', 'Sova', 'Sage',
  'Phoenix', 'Jett', 'Reyna', 'Raze', 'Breach', 'Skye', 'Yoru',
  'Astra', 'KAY/O', 'Chamber', 'Neon', 'Fade', 'Harbor', 'Gekko',
  'Deadlock', 'Iso', 'Clove', 'Tejo', 'Vyse', 'Waylay'
]

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export function generateAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff&bold=true`
}
