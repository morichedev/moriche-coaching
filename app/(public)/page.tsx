import { HeroSection } from '@/components/landing/HeroSection'
import { StatsSection } from '@/components/landing/StatsSection'
import { ServicesSection } from '@/components/landing/ServicesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { CoachProfileSection } from '@/components/landing/CoachProfileSection'
import { ClipsSection } from '@/components/landing/ClipsSection'
import { BlogPreviewSection } from '@/components/landing/BlogPreviewSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { DiscordSection } from '@/components/landing/DiscordSection'
import { ContactSection } from '@/components/landing/ContactSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moriche Coaching — Elite Valorant Coaching',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CoachProfileSection />
      <ServicesSection />
      <PricingSection />
      <TestimonialsSection />
      <ClipsSection />
      <BlogPreviewSection />
      <FaqSection />
      <DiscordSection />
      <ContactSection />
    </>
  )
}
