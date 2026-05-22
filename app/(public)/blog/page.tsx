import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Clock, Tag, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Guías y estrategias de Valorant',
  description: 'Aprende estrategias, mecánicas y mentalidad competitiva con las guías de Moriche Coaching.',
}

export default async function BlogPage() {
  const supabase = await createServerSupabaseClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id,title,slug,excerpt,cover_url,tags,category,read_time,views,published_at,author:profiles(full_name)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="font-display font-bold text-4xl lg:text-5xl mb-3">Blog</h1>
            <p className="text-muted-foreground text-lg">Guías, estrategias y mentalidad competitiva para subir de rango.</p>
          </div>
          {!posts || posts.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <p className="text-muted-foreground">No hay artículos publicados todavía.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post: object) => {
                const p = post as { id: string; title: string; slug: string; excerpt?: string; category?: string; read_time?: number; views: number; published_at?: string; tags: string[]; author?: { full_name?: string } }
                return (
                  <article key={p.id} className="glass-card-hover p-6 group">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      {p.category && <span className="px-2 py-0.5 rounded bg-crimson-600/20 text-crimson-400 font-semibold">{p.category}</span>}
                      {p.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.read_time} min</span>}
                      {p.published_at && <span>{formatDate(p.published_at, 'd MMM yyyy')}</span>}
                    </div>
                    <h2 className="font-display font-bold text-xl mb-2 group-hover:text-crimson-400 transition-colors">{p.title}</h2>
                    {p.excerpt && <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{p.excerpt}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {p.tags.slice(0,3).map((t: string) => (
                          <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] text-xs text-muted-foreground">
                            <Tag className="w-2.5 h-2.5" />{t}
                          </span>
                        ))}
                      </div>
                      <Link href={`/blog/${p.slug}`} className="text-sm text-crimson-500 flex items-center gap-1 hover:text-crimson-400 transition-colors">
                        Leer <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
