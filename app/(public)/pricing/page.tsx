import { PricingSection } from "@/components/landing/PricingSection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Precios — Moriche Coaching",
  description: "Primera sesión gratis. Sesiones individuales desde 5€. Suscripción mensual de coaching por 15€.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-16">
      <PricingSection />
    </div>
  )
}
