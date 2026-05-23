// Supabase Database type placeholder
// Replace with `supabase gen types typescript` output when ready

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Database {}
