import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { plan, bookingId } = await req.json()
    const amount = plan === 'monthly' ? '15.00' : '5.00'
    const description = plan === 'monthly' ? 'Coaching Mensual - Moriche' : 'Sesión Individual - Moriche'

    const mode = process.env.PAYPAL_MODE ?? 'sandbox'
    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
    const token = await getPayPalAccessToken()

    const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'EUR', value: amount },
          description,
          custom_id: JSON.stringify({ user_id: user.id, booking_id: bookingId ?? '', plan }),
        }],
      }),
    })

    const order = await res.json()
    return NextResponse.json({ id: order.id })
  } catch (_err) {
    return NextResponse.json({ error: 'PayPal order failed' }, { status: 500 })
  }
}
