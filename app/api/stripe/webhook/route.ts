import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceSupabaseClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const bookingId = session.metadata?.booking_id
      const plan = session.metadata?.plan

      if (!userId) break

      // Record payment
      await supabase.from('payments').insert({
        user_id: userId,
        booking_id: bookingId || null,
        provider: 'stripe',
        provider_id: session.payment_intent as string ?? session.id,
        provider_sub_id: session.subscription as string ?? null,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? 'eur',
        status: 'succeeded',
        description: plan === 'monthly' ? 'Suscripción mensual' : 'Sesión individual',
      })

      // Update subscription tier
      if (plan === 'monthly') {
        const subEnds = new Date()
        subEnds.setMonth(subEnds.getMonth() + 1)
        await supabase.from('profiles').update({
          subscription_tier: 'monthly',
          subscription_ends_at: subEnds.toISOString(),
        }).eq('id', userId)
      } else {
        await supabase.from('profiles').update({ subscription_tier: 'single' }).eq('id', userId)
      }

      // Confirm booking if linked
      if (bookingId) {
        await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId)
      }

      // Send notification
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'payment',
        title: 'Pago confirmado',
        body: plan === 'monthly' ? 'Tu suscripción mensual está activa.' : 'Tu sesión ha sido pagada y confirmada.',
        link: '/player/sessions',
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customer = await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer
      const userId = customer.metadata?.supabase_uid
      if (userId) {
        await supabase.from('profiles').update({ subscription_tier: 'free', subscription_ends_at: null }).eq('id', userId)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const userId = (invoice.customer_object as Stripe.Customer)?.metadata?.supabase_uid
      if (userId) {
        await supabase.from('notifications').insert({
          user_id: userId, type: 'payment', title: 'Pago fallido',
          body: 'El pago de tu suscripción ha fallado. Por favor actualiza tu método de pago.',
          link: '/player',
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

export const config = { api: { bodyParser: false } }
