import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { StreakService, StreakSummary } from '@/services/streakService'

const EMPTY_STREAK: StreakSummary = {
  currentStreak: 0,
  completedToday: false,
  completedYesterday: false,
  isActive: false,
  weekDays: [],
  longestStreak: 0,
}

export function useStreak(profileId?: string | null) {
  const [streak, setStreak] = useState<StreakSummary>(EMPTY_STREAK)
  const [loading, setLoading] = useState(true)

  const fetchStreak = async () => {
    if (!profileId) {
      setStreak(EMPTY_STREAK)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('started_at, ended_at')
        .eq('user_id', profileId)
        .eq('is_completed', true)
        .order('started_at', { ascending: true })

      if (error) throw error

      const dates = (data || []).map(session => session.ended_at || session.started_at)
      setStreak(StreakService.compute(dates))
    } catch (error) {
      console.warn('Erreur calcul streak:', error)
      setStreak(EMPTY_STREAK)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchStreak()
  }, [profileId])

  return {
    streak,
    loading,
    refetch: fetchStreak,
  }
}
