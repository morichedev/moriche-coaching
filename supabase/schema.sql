-- ============================================================
-- MORICHE COACHING — Supabase SQL Schema
-- Run in the Supabase SQL editor to initialize the database
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'player', 'team');
CREATE TYPE session_type AS ENUM ('individual', 'team', 'vod_review', 'tactical');
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded', 'cancelled');
CREATE TYPE payment_provider AS ENUM ('stripe', 'paypal');
CREATE TYPE subscription_tier AS ENUM ('free', 'single', 'monthly', 'team');
CREATE TYPE notification_type AS ENUM ('session', 'payment', 'message', 'system', 'achievement');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');
CREATE TYPE routine_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'pro');
CREATE TYPE vod_status AS ENUM ('uploading', 'processing', 'ready', 'reviewed', 'error');
CREATE TYPE event_type AS ENUM ('session', 'scrim', 'match', 'training', 'tournament');
CREATE TYPE rank_tier AS ENUM ('iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'ascendant', 'immortal', 'radiant');

-- PROFILES
CREATE TABLE public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  username      TEXT UNIQUE,
  full_name     TEXT,
  display_name  TEXT,
  avatar_url    TEXT,
  role          user_role DEFAULT 'player' NOT NULL,
  rank          rank_tier,
  peak_rank     rank_tier,
  agent_mains   TEXT[] DEFAULT '{}',
  bio           TEXT,
  discord_id    TEXT,
  discord_username TEXT,
  twitter_handle TEXT,
  twitch_handle TEXT,
  country       TEXT,
  timezone      TEXT DEFAULT 'Europe/Madrid',
  language      TEXT DEFAULT 'es',
  theme         TEXT DEFAULT 'dark',
  notifications_email BOOLEAN DEFAULT TRUE,
  notifications_discord BOOLEAN DEFAULT TRUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_ends_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  paypal_subscriber_id TEXT,
  total_sessions INTEGER DEFAULT 0,
  total_hours DECIMAL(10,2) DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TEAMS
CREATE TABLE public.teams (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL,
  tag           TEXT NOT NULL,
  description   TEXT,
  logo_url      TEXT,
  banner_url    TEXT,
  owner_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invite_code   TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  is_public     BOOLEAN DEFAULT FALSE,
  region        TEXT DEFAULT 'EU',
  rank_avg      rank_tier,
  wins          INTEGER DEFAULT 0,
  losses        INTEGER DEFAULT 0,
  subscription_tier subscription_tier DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.team_members (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id    UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role       TEXT DEFAULT 'member',
  joined_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(team_id, user_id)
);

-- SESSIONS
CREATE TABLE public.sessions (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id      UUID REFERENCES public.profiles(id) NOT NULL,
  player_id     UUID REFERENCES public.profiles(id),
  team_id       UUID REFERENCES public.teams(id),
  title         TEXT NOT NULL,
  description   TEXT,
  session_type  session_type DEFAULT 'individual' NOT NULL,
  status        session_status DEFAULT 'scheduled' NOT NULL,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  duration_min  INTEGER DEFAULT 60,
  ended_at      TIMESTAMPTZ,
  notes         TEXT,
  feedback      TEXT,
  recording_url TEXT,
  meeting_url   TEXT,
  price_cents   INTEGER DEFAULT 500,
  is_free_trial BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- BOOKINGS
CREATE TABLE public.bookings (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id      UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) NOT NULL,
  team_id         UUID REFERENCES public.teams(id),
  status          booking_status DEFAULT 'pending' NOT NULL,
  notes           TEXT,
  scheduled_at    TIMESTAMPTZ NOT NULL,
  session_type    session_type DEFAULT 'individual',
  is_free_trial   BOOLEAN DEFAULT FALSE,
  payment_id      UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- PAYMENTS
CREATE TABLE public.payments (
  id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id            UUID REFERENCES public.profiles(id) NOT NULL,
  team_id            UUID REFERENCES public.teams(id),
  booking_id         UUID REFERENCES public.bookings(id),
  provider           payment_provider NOT NULL,
  provider_id        TEXT NOT NULL,
  provider_sub_id    TEXT,
  amount_cents       INTEGER NOT NULL,
  currency           TEXT DEFAULT 'eur',
  status             payment_status DEFAULT 'pending' NOT NULL,
  description        TEXT,
  invoice_url        TEXT,
  receipt_url        TEXT,
  metadata           JSONB DEFAULT '{}',
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_payment_id_fkey
  FOREIGN KEY (payment_id) REFERENCES public.payments(id);

-- ROUTINES
CREATE TABLE public.routines (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_by    UUID REFERENCES public.profiles(id) NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  difficulty    routine_difficulty DEFAULT 'intermediate',
  duration_min  INTEGER DEFAULT 30,
  tags          TEXT[] DEFAULT '{}',
  agents        TEXT[] DEFAULT '{}',
  maps          TEXT[] DEFAULT '{}',
  content       JSONB NOT NULL,
  thumbnail_url TEXT,
  video_url     TEXT,
  is_public     BOOLEAN DEFAULT FALSE,
  is_premium    BOOLEAN DEFAULT FALSE,
  views         INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.player_routines (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  routine_id  UUID REFERENCES public.routines(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed   BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  progress    INTEGER DEFAULT 0,
  notes       TEXT,
  UNIQUE(user_id, routine_id)
);

-- VOD REVIEWS
CREATE TABLE public.vod_reviews (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id        UUID REFERENCES public.profiles(id) NOT NULL,
  session_id     UUID REFERENCES public.sessions(id),
  title          TEXT NOT NULL,
  description    TEXT,
  video_url      TEXT NOT NULL,
  thumbnail_url  TEXT,
  status         vod_status DEFAULT 'uploading' NOT NULL,
  duration_sec   INTEGER,
  map            TEXT,
  agent          TEXT,
  match_result   TEXT,
  tags           TEXT[] DEFAULT '{}',
  coach_notes    TEXT,
  review_data    JSONB DEFAULT '[]',
  is_reviewed    BOOLEAN DEFAULT FALSE,
  reviewed_at    TIMESTAMPTZ,
  reviewed_by    UUID REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RESOURCES
CREATE TABLE public.resources (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_by   UUID REFERENCES public.profiles(id) NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  file_url     TEXT NOT NULL,
  file_type    TEXT,
  file_size    BIGINT,
  category     TEXT,
  tags         TEXT[] DEFAULT '{}',
  maps         TEXT[] DEFAULT '{}',
  agents       TEXT[] DEFAULT '{}',
  is_public    BOOLEAN DEFAULT FALSE,
  is_premium   BOOLEAN DEFAULT FALSE,
  for_team_id  UUID REFERENCES public.teams(id),
  downloads    INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.player_resources (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  downloaded  BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, resource_id)
);

-- GOALS
CREATE TABLE public.goals (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  target_rank  rank_tier,
  target_date  DATE,
  progress     INTEGER DEFAULT 0,
  completed    BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  milestones   JSONB DEFAULT '[]',
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ANALYTICS
CREATE TABLE public.analytics (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recorded_at     DATE NOT NULL,
  rank            rank_tier,
  rr              INTEGER DEFAULT 0,
  acs             DECIMAL(6,2),
  kd_ratio        DECIMAL(4,2),
  hs_percent      DECIMAL(5,2),
  win_rate        DECIMAL(5,2),
  matches_played  INTEGER DEFAULT 0,
  wins            INTEGER DEFAULT 0,
  losses          INTEGER DEFAULT 0,
  hours_played    DECIMAL(5,2) DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, recorded_at)
);

-- PLAYBOOKS
CREATE TABLE public.playbooks (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id     UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  created_by  UUID REFERENCES public.profiles(id) NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  map         TEXT NOT NULL,
  side        TEXT NOT NULL,
  type        TEXT DEFAULT 'strategy',
  content     JSONB NOT NULL,
  thumbnail_url TEXT,
  tags        TEXT[] DEFAULT '{}',
  is_private  BOOLEAN DEFAULT TRUE,
  views       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- SCRIMS
CREATE TABLE public.scrims (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  home_team_id   UUID REFERENCES public.teams(id) NOT NULL,
  away_team_id   UUID REFERENCES public.teams(id),
  away_team_name TEXT,
  scheduled_at   TIMESTAMPTZ NOT NULL,
  maps           TEXT[] DEFAULT '{}',
  result         JSONB,
  status         TEXT DEFAULT 'scheduled',
  notes          TEXT,
  server_region  TEXT,
  created_by     UUID REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- CALENDAR EVENTS
CREATE TABLE public.calendar_events (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id),
  team_id     UUID REFERENCES public.teams(id),
  title       TEXT NOT NULL,
  description TEXT,
  event_type  event_type NOT NULL,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  all_day     BOOLEAN DEFAULT FALSE,
  color       TEXT DEFAULT '#dc2626',
  location    TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- CONVERSATIONS & MESSAGES
CREATE TABLE public.conversations (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type         TEXT DEFAULT 'direct',
  name         TEXT,
  team_id      UUID REFERENCES public.teams(id),
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.conversation_participants (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  last_read_at    TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE public.messages (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id       UUID REFERENCES public.profiles(id) NOT NULL,
  content         TEXT,
  type            message_type DEFAULT 'text' NOT NULL,
  file_url        TEXT,
  file_name       TEXT,
  file_size       BIGINT,
  is_edited       BOOLEAN DEFAULT FALSE,
  is_deleted      BOOLEAN DEFAULT FALSE,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type         notification_type NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT,
  link         TEXT,
  is_read      BOOLEAN DEFAULT FALSE,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id    UUID REFERENCES public.profiles(id) NOT NULL,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT NOT NULL,
  cover_url    TEXT,
  tags         TEXT[] DEFAULT '{}',
  category     TEXT,
  locale       TEXT DEFAULT 'es',
  is_published BOOLEAN DEFAULT FALSE,
  is_featured  BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  read_time    INTEGER,
  views        INTEGER DEFAULT 0,
  seo_title    TEXT,
  seo_desc     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id),
  name        TEXT NOT NULL,
  username    TEXT,
  avatar_url  TEXT,
  rank_before rank_tier,
  rank_after  rank_tier,
  content     TEXT NOT NULL,
  rating      INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_sessions_player_id ON public.sessions(player_id);
CREATE INDEX idx_sessions_coach_id ON public.sessions(coach_id);
CREATE INDEX idx_sessions_scheduled_at ON public.sessions(scheduled_at);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_provider_id ON public.payments(provider_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_vod_reviews_user_id ON public.vod_reviews(user_id);
CREATE INDEX idx_calendar_events_user_id ON public.calendar_events(user_id);

-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at  BEFORE UPDATE ON public.profiles  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_teams_updated_at     BEFORE UPDATE ON public.teams     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_sessions_updated_at  BEFORE UPDATE ON public.sessions  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bookings_updated_at  BEFORE UPDATE ON public.bookings  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated_at  BEFORE UPDATE ON public.payments  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_routines_updated_at  BEFORE UPDATE ON public.routines  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_vod_reviews_updated_at BEFORE UPDATE ON public.vod_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_playbooks_updated_at BEFORE UPDATE ON public.playbooks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_goals_updated_at     BEFORE UPDATE ON public.goals     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_messages_updated_at  BEFORE UPDATE ON public.messages  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_routines       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vod_reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials          ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "sessions_select_participant" ON public.sessions FOR SELECT USING (auth.uid() = player_id OR auth.uid() = coach_id);
CREATE POLICY "sessions_admin_all" ON public.sessions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "bookings_select_own" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookings_insert_own" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings_admin_all" ON public.bookings FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_admin_all" ON public.payments FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "routines_select_public" ON public.routines FOR SELECT USING (is_public = TRUE);
CREATE POLICY "routines_admin_all" ON public.routines FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "player_routines_own" ON public.player_routines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "vods_select_own" ON public.vod_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vods_insert_own" ON public.vod_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vods_admin_all" ON public.vod_reviews FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "notifications_own" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "analytics_own" ON public.analytics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "goals_own" ON public.goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "messages_select_participant" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "messages_insert_participant" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "blog_select_published" ON public.blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "blog_admin_all" ON public.blog_posts FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "testimonials_select_approved" ON public.testimonials FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "testimonials_insert" ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "testimonials_admin_all" ON public.testimonials FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- SEED DATA
INSERT INTO public.testimonials (name, username, rank_before, rank_after, content, rating, is_approved, is_featured) VALUES
  ('Carlos M.', 'CarlosVCT', 'gold', 'platinum', 'Moriche me ayudó a entender mi rol como Sentinel. Subí 3 rangos en 3 semanas. El análisis de VOD fue clave.', 5, TRUE, TRUE),
  ('Alex R.', 'AlexFragger', 'silver', 'gold', 'Las rutinas de calentamiento que me dieron cambiaron mi consistencia por completo. 100% recomendado.', 5, TRUE, TRUE),
  ('Team Nexus', 'TeamNexus', 'diamond', 'ascendant', 'El coaching de equipo fue excepcional. Nuestras estrategias de mapa mejoraron radicalmente.', 5, TRUE, TRUE),
  ('Sara L.', 'SaraVAL', 'bronze', 'silver', 'Primera vez haciendo coaching y fue increíble. Muy profesional y paciente.', 5, TRUE, FALSE),
  ('Diego P.', 'DiegoIGL', 'platinum', 'diamond', 'El análisis táctico y los playbooks personalizados llevaron a mi equipo al siguiente nivel.', 5, TRUE, TRUE);
