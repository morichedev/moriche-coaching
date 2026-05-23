import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServiceSupabaseClient()
    const { data: { user } } = await (await import('@/lib/supabase/server')).createServerSupabaseClient().then(c => c.auth.getUser())

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { priceId, bookingId, plan } = await req.json()

    const { data: profile } = await supabase.from('profiles').select('stripe_customer_id, email, full_name').eq('id', user.id).single()

    // Get or create Stripe customer
    let customerId = profile?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({ email: profile?.email ?? user.email!, name: profile?.full_name ?? undefined, metadata: { supabase_uid: user.id } })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const isSubscription = plan === 'monthly'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [{
        price: priceId ?? (isSubscription ? process.env.STRIPE_PRICE_MONTHLY_COACHING! : process.env.STRIPE_PRICE_SINGLE_SESSION!),
        quantity: 1,
      }],
      success_url: `${appUrl}/player?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/player?payment=cancelled`,
      metadata: { user_id: user.id, booking_id: bookingId ?? '', plan: plan ?? 'single' },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
