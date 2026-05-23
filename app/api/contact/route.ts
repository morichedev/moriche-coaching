import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(4),
  message: z.string().min(20),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Send to Discord webhook
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '📬 Nuevo mensaje de contacto',
            color: 0xdc2626,
            fields: [
              { name: 'Nombre', value: data.name, inline: true },
              { name: 'Email', value: data.email, inline: true },
              { name: 'Asunto', value: data.subject },
              { name: 'Mensaje', value: data.message },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
