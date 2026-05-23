import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient, createServiceSupabaseClient } from '@/lib/supabase/server'

export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' })
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const serviceSupabase = await createServiceSupabaseClient()
    const { data: profile } = await serviceSupabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/player`,
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Portal error' }, { status: 500 })
  }
}
