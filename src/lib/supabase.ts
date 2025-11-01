// Supabase Client Configuration
// Mock client for now - to be replaced when Supabase is installed

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here'
}

// Mock Supabase client until properly configured
export const supabase = {
  from: (table: string) => ({
    select: () => ({ data: null, error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  }),
  channel: () => ({
    on: () => ({ subscribe: () => {} })
  })
} as any

// TODO: Replace with actual Supabase when installed
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types matching our database schema
export interface Database {
  public: {
    Tables: {
      faith_flames: {
        Row: {
          id: string
          user_id: string
          fellowship_id: string
          activity_date: string
          activity_count: number
          activity_type: string
          points_awarded: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['faith_flames']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['faith_flames']['Row']>
      }
      faith_streaks: {
        Row: {
          id: string
          user_id: string
          fellowship_id: string
          current_streak: number
          longest_streak: number
          last_activity_date: string
          flame_intensity: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['faith_streaks']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['faith_streaks']['Row']>
      }
      unity_points: {
        Row: {
          id: string
          fellowship_id: string
          week_start: string
          week_end: string
          total_points: number
          participation_rate: number
          member_count: number
          ember_meter_level: number
          is_on_fire: boolean
          weekly_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['unity_points']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['unity_points']['Row']>
      }
      blessing_badges: {
        Row: {
          id: string
          code: string
          name: string
          description: string
          category: string
          icon: string
          glow_color: string | null
          rarity: string
          requirements: Record<string, any>
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blessing_badges']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['blessing_badges']['Row']>
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          fellowship_id: string | null
          badge_id: string
          earned_at: string
          is_featured: boolean
        }
        Insert: Omit<Database['public']['Tables']['user_badges']['Row'], 'id' | 'earned_at'>
        Update: Partial<Database['public']['Tables']['user_badges']['Row']>
      }
      weekly_challenges: {
        Row: {
          id: string
          fellowship_id: string
          template_id: string
          steward_id: string | null
          week_start: string
          week_end: string
          status: string
          completion_threshold: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['weekly_challenges']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['weekly_challenges']['Row']>
      }
      fellowship_highlights: {
        Row: {
          id: string
          fellowship_id: string
          highlight_type: string
          title: string
          message: string
          icon: string
          points_or_streak: number | null
          threshold_met: number | null
          period_start: string
          period_end: string
          is_public: boolean
          display_start: string
          display_until: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['fellowship_highlights']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['fellowship_highlights']['Row']>
      }
    }
  }
}

