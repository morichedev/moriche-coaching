'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Upload, CheckCircle, Clock, AlertCircle, Eye, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { formatDate, cn } from '@/lib/utils'
import type { VodReview } from '@/types/database'

const statusConfig = {
  uploading:   { label: 'Subiendo', color: 'text-blue-400', icon: <Upload className="w-3 h-3" /> },
  processing:  { label: 'Procesando', color: 'text-amber-400', icon: <Clock className="w-3 h-3" /> },
  ready:       { label: 'Pendiente revisión', color: 'text-purple-400', icon: <Eye className="w-3 h-3" /> },
  reviewed:    { label: 'Revisado', color: 'text-emerald-400', icon: <CheckCircle className="w-3 h-3" /> },
  error:       { label: 'Error', color: 'text-red-400', icon: <AlertCircle className="w-3 h-3" /> },
}

export function PlayerVodsPage({ vods: initial, userId }: { vods: VodReview[], userId: string }) {
  const [vods, setVods] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const supabase = createClient()

  const handleUpload = async () => {
    if (!selectedFile || !title) return
    setUploading(true)
    try {
      const ext = selectedFile.name.split('.').pop()
      const path = `vods/${userId}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('moriche-media').upload(path, selectedFile)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('moriche-media').getPublicUrl(path)
      const { data, error } = await supabase.from('vod_reviews').insert({ user_id: userId, title, video_url: publicUrl, status: 'ready' }).select().single()
      if (error) throw error
      setVods(v => [data, ...v])
      setTitle(''); setSelectedFile(null); setShowForm(false)
      toast({ title: 'VOD subido', description: 'Tu clip ha sido enviado al coach para revisión.' })
    } catch (e: unknown) {
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' })
    } finally { setUploading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">VOD Review</h1>
          <p className="text-muted-foreground text-sm mt-1">Sube tus clips para análisis personalizado del coach</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-crimson flex items-center gap-2">
          <Upload className="w-4 h-4" /> Subir VOD
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-6">
            <h3 className="font-semibold mb-4">Subir nuevo VOD</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Título del clip</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Pérdida round 23 en Ascent ataque"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-crimson-600/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Archivo de video</label>
                <div className="border-2 border-dashed border-white/[0.12] rounded-xl p-8 text-center hover:border-crimson-600/40 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('vod-input')?.click()}>
                  <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{selectedFile ? selectedFile.name : 'Haz click o arrastra tu video aquí'}</p>
                  <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI · Máx. 500MB</p>
                </div>
                <input id="vod-input" type="file" accept="video/*" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
                <button onClick={handleUpload} disabled={uploading || !title || !selectedFile} className="btn-crimson text-sm px-4 py-2 flex items-center gap-2">
                  {uploading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {uploading ? 'Subiendo...' : 'Subir VOD'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {vods.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No has subido ningún VOD todavía.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-crimson text-sm px-5 py-2.5">Subir primer VOD</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vods.map((vod, i) => {
            const status = statusConfig[vod.status]
            return (
              <motion.div key={vod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card-hover overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-charcoal-600 to-charcoal-800 relative flex items-center justify-center">
                  <Video className="w-10 h-10 text-muted-foreground/40" />
                  <div className={cn('absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-sm', status.color)}>
                    {status.icon} {status.label}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{vod.title}</h3>
                  <p className="text-xs text-muted-foreground">{formatDate(vod.created_at, 'd MMM yyyy')}</p>
                  {vod.is_reviewed && vod.coach_notes && (
                    <div className="mt-3 p-3 rounded-lg bg-crimson-950/20 border border-crimson-800/20">
                      <p className="text-xs text-crimson-400 font-semibold flex items-center gap-1 mb-1"><MessageSquare className="w-3 h-3" />Feedback del coach</p>
                      <p className="text-xs text-muted-foreground line-clamp-3">{vod.coach_notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
