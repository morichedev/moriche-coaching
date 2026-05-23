import Image from "next/image"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { formatDate } from "@/lib/utils"
import { Clock, Tag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: post } = await supabase.from("blog_posts").select("seo_title,seo_desc,title,excerpt,cover_url").eq("slug", slug).single()
  if (!post) return { title: "Post no encontrado" }
  return {
    title: post.seo_title ?? post.title,
    description: post.seo_desc ?? post.excerpt ?? undefined,
    openGraph: { images: post.cover_url ? [post.cover_url] : undefined },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  if (!post) notFound()

  // Increment views
  await supabase.from("blog_posts").update({ views: (post.views ?? 0) + 1 }).eq("id", post.id)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al blog
          </Link>
          <div className="mb-8">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
              {post.category && <span className="px-2.5 py-1 rounded bg-crimson-600/20 text-crimson-400 font-semibold">{post.category}</span>}
              {post.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time} min de lectura</span>}
              {post.published_at && <span>{formatDate(post.published_at, "d 'de' MMMM, yyyy")}</span>}
              <span>{post.views} vistas</span>
            </div>
            <h1 className="font-display font-bold text-3xl lg:text-4xl leading-tight mb-4">{post.title}</h1>
            {post.excerpt && <p className="text-muted-foreground text-lg leading-relaxed">{post.excerpt}</p>}
          </div>
          {post.cover_url && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-charcoal-700 mb-10">
              <Image src={post.cover_url} alt={post.title} fill className="object-cover" />
            </div>
          )}
          <div className="prose prose-invert prose-crimson max-w-none">
            <MDXRemote source={post.content} />
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/[0.06]">
              {post.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground bg-white/[0.04] border border-white/[0.08]">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
