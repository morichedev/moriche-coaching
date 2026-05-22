import Link from 'next/link'
import { Zap, Twitter, Twitch, Youtube, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-charcoal-900/80">
      <div className="section-container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-crimson-600 rounded rotate-45 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white -rotate-45" />
              </div>
              <span className="font-display font-bold text-lg">MORICHE<span className="text-crimson-500">.</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">Coaching premium de Valorant. Eleva tu juego con metodología probada.</p>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: <Twitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
                { icon: <Twitch className="w-4 h-4" />, href: '#', label: 'Twitch' },
                { icon: <Youtube className="w-4 h-4" />, href: '#', label: 'YouTube' },
                { icon: <MessageCircle className="w-4 h-4" />, href: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? '#', label: 'Discord' },
              ].map(({ icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-crimson-600/30 transition-colors">{icon}</a>
              ))}
            </div>
          </div>
          {[
            { title: 'Servicios', links: [{ label: 'Coaching individual', href: '/#servicios' }, { label: 'Coaching de equipo', href: '/#servicios' }, { label: 'VOD Review', href: '/#servicios' }, { label: 'Precios', href: '/#precios' }] },
            { title: 'Plataforma', links: [{ label: 'Iniciar sesión', href: '/login' }, { label: 'Registrarse', href: '/register' }, { label: 'Blog', href: '/blog' }, { label: 'Clips', href: '/clips' }] },
            { title: 'Legal', links: [{ label: 'Privacidad', href: '/privacidad' }, { label: 'Términos', href: '/terminos' }, { label: 'Cookies', href: '/cookies' }, { label: 'Contacto', href: '/#contacto' }] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4 text-foreground">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Moriche Coaching. Todos los derechos reservados.</p>
          <p>Hecho con dedicación · Valorant es marca registrada de <a href="https://playvalorant.com" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Riot Games</a></p>
        </div>
      </div>
    </footer>
  )
}
