import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bvdgvzfsldvmnmxiysyo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZGd2emZzbGR2bW5teGl5c3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTU2MTYsImV4cCI6MjA3MjQzMTYxNn0.70Or1ZFF-XVzVmLB_jRTOLL-qgUEl837zQAyXC2v8wQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  display_name: string
  avatar_emoji: string
  level: number
  xp_total: number
  stat_force: number
  stat_endurance: number
  stat_agilite: number
  stat_mental: number
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  slug: string
  title: string
  description: string
  is_active: boolean
}

export interface Quest {
  id: string
  campaign_id: string
  order_index: number
  title: string
  description: string
  type: 'quete' | 'boss'
  xp_force: number
  xp_endurance: number
  xp_agilite: number
  xp_mental: number
  xp_total: number
  workout_type: 'emom' | 'tabata' | 'amrap' | 'for_time' | 'simple'
  work_seconds: number
  rest_seconds: number
  rounds_target: number
  total_minutes: number
}

export interface QuestExercise {
  id: string
  quest_id: string
  order_index: number
  name: string
  target_reps: number
  notes?: string
}

export interface UserQuest {
  id: string
  user_id: string
  quest_id: string
  status: 'locked' | 'available' | 'completed'
  completed_at?: string
}

export interface Badge {
  id: string
  slug: string
  name: string
  emoji: string
  condition_type: 'min_sessions' | 'first_superset' | 'beat_final_boss'
  condition_value: number
  description: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  unlocked_at: string
}

export interface WorkoutSession {
  id: string
  user_id: string
  quest_id: string
  workout_type: string
  started_at: string
  ended_at?: string
  rounds_completed: number
  total_time_seconds: number
  is_completed: boolean
}

export interface SessionRound {
  id: string
  session_id: string
  round_no: number
  duration_seconds: number
  reps_total: number
}