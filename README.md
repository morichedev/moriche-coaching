# Moriche Coaching — Elite Valorant Coaching Platform

A full-stack, production-ready SaaS platform for premium Valorant coaching.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS + custom design system |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email + Google + Discord) |
| Payments | Stripe + PayPal |
| Realtime | Supabase Realtime |
| Storage | Supabase Storage |
| State | Zustand + React Context |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Calendar | FullCalendar |
| Blog | MDX (next-mdx-remote) |
| Deployment | Vercel |

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/youruser/moriche-coaching.git
cd moriche-coaching
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Enable Google and Discord OAuth providers in **Authentication → Providers**
4. Create a storage bucket named `moriche-media` (public)
5. Copy your project URL and anon key to `.env.local`

### 4. Stripe setup

1. Create an account at [stripe.com](https://stripe.com)
2. Create products and prices:
   - **Single session** — one-time, 5€ → copy price ID to `STRIPE_PRICE_SINGLE_SESSION`
   - **Monthly coaching** — recurring, 15€/month → copy to `STRIPE_PRICE_MONTHLY_COACHING`
3. Set up webhook: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5. PayPal setup

1. Create an app at [developer.paypal.com](https://developer.paypal.com)
2. Copy Client ID and Secret to `.env.local`
3. Set `PAYPAL_MODE=sandbox` for testing, `live` for production

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
moriche-coaching/
├── app/
│   ├── (auth)/              # Login, register pages
│   ├── (dashboard)/
│   │   ├── player/          # Player dashboard (sessions, routines, metrics, vods...)
│   │   ├── team/            # Team dashboard (playbooks, scrims, roster...)
│   │   └── admin/           # Admin panel (users, payments, sessions, blog...)
│   ├── (public)/            # Landing page, blog, pricing
│   ├── api/                 # API routes (Stripe, PayPal, auth, contact)
│   ├── layout.tsx           # Root layout with fonts and providers
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt
├── components/
│   ├── landing/             # Landing page sections (Hero, Pricing, FAQ...)
│   ├── dashboard/
│   │   ├── player/          # Player-specific components
│   │   ├── team/            # Team-specific components
│   │   └── admin/           # Admin-specific components
│   ├── auth/                # Login/register forms
│   ├── shared/              # ThemeProvider
│   └── ui/                  # Reusable UI primitives
├── lib/
│   ├── supabase/            # Client, server, middleware helpers
│   ├── utils/               # cn, formatDate, RANK_COLORS, etc.
├── store/                   # Zustand: auth, ui
├── types/                   # TypeScript types from DB schema
├── styles/                  # globals.css with design system
├── locales/                 # i18n (es, en)
├── supabase/                # schema.sql
├── .env.example
├── vercel.json
└── README.md
```

---

## Role System

| Role | Access |
|---|---|
| `admin` | Full platform management, all dashboards |
| `player` | Personal dashboard, sessions, routines, metrics |
| `team` | Team dashboard, playbooks, scrims, roster |

To make a user admin, run in Supabase SQL editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Services & Pricing

| Plan | Price | Features |
|---|---|---|
| Free Trial | 0€ | 1 × 30min session, first time only |
| Single Session | 5€ | 1 × 60min, VOD review, personalized routine |
| Monthly Coaching | 15€/month | 4 sessions, unlimited VODs, premium resources, chat |

---

## Deployment (Vercel)

1. Push your repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in Vercel project settings
4. Deploy — zero config needed (vercel.json is included)

For Stripe webhooks in production:
- Add endpoint: `https://yourdomain.com/api/stripe/webhook`
- Events to listen: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Database Migrations

After making schema changes:
```bash
# Generate TypeScript types from your Supabase project
npm run db:generate

# Push local schema changes
npm run db:push
```

---

## Features Implemented

### Public
- [x] Cinematic hero with particle system + scan line animation
- [x] Stats counter animation
- [x] Coach profile section
- [x] Services grid with hover effects
- [x] Pricing plans (Free / Single / Monthly)
- [x] Testimonials carousel with rank progression
- [x] Video clips section
- [x] Blog preview
- [x] FAQ accordion
- [x] Discord CTA
- [x] Contact form (→ Discord webhook)
- [x] Navbar with scroll effect + mobile menu
- [x] Footer with social links
- [x] SEO metadata + Open Graph
- [x] Dynamic sitemap + robots.txt
- [x] i18n (ES + EN)

### Authentication
- [x] Email/password signup & login
- [x] Google OAuth
- [x] Discord OAuth
- [x] JWT session management via Supabase
- [x] Role-based middleware protection
- [x] Auto profile creation on signup

### Player Dashboard
- [x] Overview with stats, charts, goals, upcoming sessions
- [x] Sessions page with booking modal
- [x] VOD upload (Supabase Storage)
- [x] Performance metrics with charts (RR, ACS, K/D, HS%)
- [x] Goals tracker with progress slider
- [x] Command palette (⌘K)
- [x] Notifications panel (realtime)
- [x] Live chat drawer (realtime)
- [x] Responsive sidebar with collapse

### Team Dashboard
- [x] Team overview with W/L stats
- [x] Playbooks with filter (map, type, side)
- [x] Scrim scheduler & history
- [x] Roster management

### Admin Panel
- [x] Analytics overview with revenue chart
- [x] User management with role editor
- [x] Booking management (confirm/cancel)
- [x] Session creation & management
- [x] Pending bookings alert system

### Payments
- [x] Stripe checkout (one-time + subscriptions)
- [x] Stripe customer portal
- [x] Stripe webhooks (payment success, sub cancel, payment failed)
- [x] PayPal order create + capture
- [x] Automatic subscription tier update
- [x] Payment notifications

### Infrastructure
- [x] Full Supabase schema with RLS policies
- [x] Row Level Security for all tables
- [x] TypeScript strict types
- [x] Vercel deployment config
- [x] Security headers

---

## License

Private — Moriche Coaching © 2025. All rights reserved.
