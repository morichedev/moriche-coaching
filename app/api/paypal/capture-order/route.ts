import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

async function getPayPalAccessToken(): Promise<string> {
  const mode = process.env.PAYPAL_MODE ?? 'sandbox'
  const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
  const credentials = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()
    const mode = process.env.PAYPAL_MODE ?? 'sandbox'
    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
    const token = await getPayPalAccessToken()

    const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    const capture = await res.json()

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Extract metadata from custom_id
    const customId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
    let metadata = { user_id: '', booking_id: '', plan: 'single' }
    try { metadata = JSON.parse(customId ?? '{}') } catch { /* noop */ }

    if (metadata.user_id) {
      const supabase = await createServiceSupabaseClient()
      const amountCents = Math.round(parseFloat(capture.purchase_units[0]?.payments?.captures[0]?.amount?.value ?? '0') * 100)

      await supabase.from('payments').insert({
        user_id: metadata.user_id,
        booking_id: metadata.booking_id || null,
        provider: 'paypal',
        provider_id: orderId,
        amount_cents: amountCents,
        currency: 'eur',
        status: 'succeeded',
        description: metadata.plan === 'monthly' ? 'Suscripción mensual' : 'Sesión individual',
      })

      if (metadata.plan === 'monthly') {
        const subEnds = new Date()
        subEnds.setMonth(subEnds.getMonth() + 1)
        await supabase.from('profiles').update({ subscription_tier: 'monthly', subscription_ends_at: subEnds.toISOString() }).eq('id', metadata.user_id)
      }

      if (metadata.booking_id) {
        await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', metadata.booking_id)
      }

      await supabase.from('notifications').insert({
        user_id: metadata.user_id, type: 'payment', title: 'Pago confirmado vía PayPal',
        body: 'Tu pago ha sido procesado correctamente.', link: '/player/sessions',
      })
    }

    return NextResponse.json({ status: 'success', capture })
  } catch (_err) {
    return NextResponse.json({ error: 'Capture failed' }, { status: 500 })
  }
}
