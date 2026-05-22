import type { Metadata, Viewport } from 'next'
import { Inter, Rajdhani, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://morichecoaching.gg'),
  title: {
    default: 'Moriche Coaching — Elite Valorant Coaching',
    template: '%s | Moriche Coaching',
  },
  description:
    'Coaching premium de Valorant. Ascendente 3 Peak, 5 años de experiencia competitiva. IGL, campeón Elite 5. Primera sesión gratis.',
  keywords: ['valorant coaching', 'coaching valorant', 'mejora valorant', 'IGL coaching', 'ascendant coaching', 'moriche coaching'],
  authors: [{ name: 'Moriche', url: 'https://morichecoaching.gg' }],
  creator: 'Moriche',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    url: 'https://morichecoaching.gg',
    siteName: 'Moriche Coaching',
    title: 'Moriche Coaching — Elite Valorant Coaching',
    description: 'Coaching premium de Valorant. Primera sesión gratis.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Moriche Coaching' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moriche Coaching — Elite Valorant Coaching',
    description: 'Coaching premium de Valorant. Primera sesión gratis.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0f' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${rajdhani.variable} ${jetbrains.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
