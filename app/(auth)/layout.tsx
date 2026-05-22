import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-charcoal-900 flex flex-col">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-crimson-900/10 rounded-full blur-[100px] pointer-events-none" />
      <header className="relative z-10 h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-crimson-600 rounded rotate-45 flex items-center justify-center group-hover:rotate-[60deg] transition-transform duration-300">
            <Zap className="w-4 h-4 text-white -rotate-45" />
          </div>
          <span className="font-display font-bold text-xl">MORICHE<span className="text-crimson-500">.</span></span>
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="relative z-10 text-center text-xs text-muted-foreground pb-6">
        © {new Date().getFullYear()} Moriche Coaching
      </footer>
    </div>
  )
}
