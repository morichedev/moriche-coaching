// ============================================================
// MORICHE COACHING — Database TypeScript Types
// Auto-generated from Supabase schema
// ============================================================

export type UserRole = 'admin' | 'player' | 'team'
export type SessionType = 'individual' | 'team' | 'vod_review' | 'tactical'
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded' | 'cancelled'
export type PaymentProvider = 'stripe' | 'paypal'
export type SubscriptionTier = 'free' | 'single' | 'monthly' | 'team'
export type NotificationType = 'session' | 'payment' | 'message' | 'system' | 'achievement'
export type MessageType = 'text' | 'image' | 'file' | 'system'
export type RoutineDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'pro'
export type VodStatus = 'uploading' | 'processing' | 'ready' | 'reviewed' | 'error'
export type EventType = 'session' | 'scrim' | 'match' | 'training' | 'tournament'
export type RankTier = 'iron' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ascendant' | 'immortal' | 'radiant'

export interface Profile {
  id: string
  email: string
  username: string | null
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  role: UserRole
  rank: RankTier | null
  peak_rank: RankTier | null
  agent_mains: string[]
  bio: string | null
  discord_id: string | null
  discord_username: string | null
  twitter_handle: string | null
  twitch_handle: string | null
  country: string | null
  timezone: string
  language: string
  theme: string
  notifications_email: boolean
  notifications_discord: boolean
  onboarding_completed: boolean
  subscription_tier: SubscriptionTier
  subscription_ends_at: string | null
  stripe_customer_id: string | null
  paypal_subscriber_id: string | null
  total_sessions: number
  total_hours: number
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  tag: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  owner_id: string | null
  invite_code: string
  is_public: boolean
  region: string
  rank_avg: RankTier | null
  wins: number
  losses: number
  subscription_tier: SubscriptionTier
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
  // joined
  members?: TeamMember[]
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: string
  joined_at: string
  // joined
  profile?: Profile
}

export interface Session {
  id: string
  coach_id: string
  player_id: string | null
  team_id: string | null
  title: string
  description: string | null
  session_type: SessionType
  status: SessionStatus
  scheduled_at: string
  duration_min: number
  ended_at: string | null
  notes: string | null
  feedback: string | null
  recording_url: string | null
  meeting_url: string | null
  price_cents: number
  is_free_trial: boolean
  created_at: string
  updated_at: string
  // joined
  player?: Profile
  team?: Team
  coach?: Profile
}

export interface Booking {
  id: string
  session_id: string | null
  user_id: string
  team_id: string | null
  status: BookingStatus
  notes: string | null
  scheduled_at: string
  session_type: SessionType
  is_free_trial: boolean
  payment_id: string | null
  created_at: string
  updated_at: string
  // joined
  user?: Profile
  session?: Session
  payment?: Payment
}

export interface Payment {
  id: string
  user_id: string
  team_id: string | null
  booking_id: string | null
  provider: PaymentProvider
  provider_id: string
  provider_sub_id: string | null
  amount_cents: number
  currency: string
  status: PaymentStatus
  description: string | null
  invoice_url: string | null
  receipt_url: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Routine {
  id: string
  created_by: string
  title: string
  description: string | null
  difficulty: RoutineDifficulty
  duration_min: number
  tags: string[]
  agents: string[]
  maps: string[]
  content: RoutineContent
  thumbnail_url: string | null
  video_url: string | null
  is_public: boolean
  is_premium: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface RoutineContent {
  steps: RoutineStep[]
  warmup?: RoutineStep[]
  cooldown?: RoutineStep[]
}

export interface RoutineStep {
  id: string
  title: string
  description: string
  duration_min: number
  type: 'aim' | 'movement' | 'strategy' | 'mental' | 'review'
  resources?: string[]
  completed?: boolean
}

export interface PlayerRoutine {
  id: string
  user_id: string
  routine_id: string
  assigned_by: string | null
  assigned_at: string
  completed: boolean
  completed_at: string | null
  progress: number
  notes: string | null
  // joined
  routine?: Routine
}

export interface VodReview {
  id: string
  user_id: string
  session_id: string | null
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  status: VodStatus
  duration_sec: number | null
  map: string | null
  agent: string | null
  match_result: string | null
  tags: string[]
  coach_notes: string | null
  review_data: VodReviewNote[]
  is_reviewed: boolean
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string
  updated_at: string
}

export interface VodReviewNote {
  timestamp: number
  note: string
  type: 'mistake' | 'good_play' | 'suggestion' | 'highlight'
}

export interface Resource {
  id: string
  created_by: string
  title: string
  description: string | null
  file_url: string
  file_type: string | null
  file_size: number | null
  category: string | null
  tags: string[]
  maps: string[]
  agents: string[]
  is_public: boolean
  is_premium: boolean
  for_team_id: string | null
  downloads: number
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  target_rank: RankTier | null
  target_date: string | null
  progress: number
  completed: boolean
  completed_at: string | null
  milestones: GoalMilestone[]
  created_at: string
  updated_at: string
}

export interface GoalMilestone {
  title: string
  completed: boolean
  date?: string
}

export interface Analytics {
  id: string
  user_id: string
  recorded_at: string
  rank: RankTier | null
  rr: number
  acs: number | null
  kd_ratio: number | null
  hs_percent: number | null
  win_rate: number | null
  matches_played: number
  wins: number
  losses: number
  hours_played: number
  notes: string | null
  created_at: string
}

export interface Playbook {
  id: string
  team_id: string
  created_by: string
  title: string
  description: string | null
  map: string
  side: string
  type: string
  content: PlaybookContent
  thumbnail_url: string | null
  tags: string[]
  is_private: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface PlaybookContent {
  description: string
  steps: PlaybookStep[]
  callouts?: string[]
  requirements?: string[]
}

export interface PlaybookStep {
  id: string
  role: string
  action: string
  position?: string
  timing?: string
  notes?: string
}

export interface Scrim {
  id: string
  home_team_id: string
  away_team_id: string | null
  away_team_name: string | null
  scheduled_at: string
  maps: string[]
  result: ScrimResult | null
  status: string
  notes: string | null
  server_region: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  home_team?: Team
  away_team?: Team
}

export interface ScrimResult {
  home: number
  away: number
  maps: { map: string; scoreHome: number; scoreAway: number }[]
}

export interface CalendarEvent {
  id: string
  user_id: string | null
  team_id: string | null
  title: string
  description: string | null
  event_type: EventType
  starts_at: string
  ends_at: string
  all_day: boolean
  color: string
  location: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface Conversation {
  id: string
  type: string
  name: string | null
  team_id: string | null
  created_at: string
  updated_at: string
  participants?: ConversationParticipant[]
  last_message?: Message
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  last_read_at: string | null
  profile?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string | null
  type: MessageType
  file_url: string | null
  file_name: string | null
  file_size: number | null
  is_edited: boolean
  is_deleted: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  sender?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  metadata: Record<string, unknown>
  created_at: string
}

export interface BlogPost {
  id: string
  author_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_url: string | null
  tags: string[]
  category: string | null
  locale: string
  is_published: boolean
  is_featured: boolean
  published_at: string | null
  read_time: number | null
  views: number
  seo_title: string | null
  seo_desc: string | null
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Testimonial {
  id: string
  user_id: string | null
  name: string
  username: string | null
  avatar_url: string | null
  rank_before: RankTier | null
  rank_after: RankTier | null
  content: string
  rating: number
  is_approved: boolean
  is_featured: boolean
  created_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
