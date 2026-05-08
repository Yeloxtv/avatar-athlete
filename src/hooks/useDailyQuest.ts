import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { DailyQuest, DailyQuestMetrics, DailyQuestService } from '@/services/dailyQuestService'

const EMPTY_METRICS: DailyQuestMetrics = {
  completedWorkouts: 0,
  completedSets: 0,
  earnedXp: 0,
}

export function useDailyQuest(profileId?: string | null) {
  const [dailyQuest, setDailyQuest] = useState<DailyQuest>(() => DailyQuestService.compute(EMPTY_METRICS))
  const [loading, setLoading] = useState(true)

  const fetchDailyQuest = async () => {
    if (!profileId) {
      setDailyQuest(DailyQuestService.compute(EMPTY_METRICS))
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { start, end } = DailyQuestService.getTodayRange()

      const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('user_id', profileId)
        .eq('is_completed', true)
        .gte('started_at', start.toISOString())
        .lte('started_at', end.toISOString())

      if (sessionsError) throw sessionsError

      const sessionIds = (sessions || []).map(session => session.id)
      let completedSets = 0

      if (sessionIds.length > 0) {
        const { count, error: logsError } = await supabase
          .from('exercise_logs')
          .select('id', { count: 'exact', head: true })
          .in('session_id', sessionIds)

        if (logsError) throw logsError
        completedSets = count || 0
      }

      const { data: xpRows, error: xpError } = await supabase
        .from('audit_xp')
        .select('delta_total')
        .eq('user_id', profileId)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())

      if (xpError) throw xpError

      const earnedXp = (xpRows || []).reduce((sum, row) => sum + (row.delta_total || 0), 0)

      setDailyQuest(DailyQuestService.compute({
        completedWorkouts: sessionIds.length,
        completedSets,
        earnedXp,
      }))
    } catch (error) {
      console.warn('Erreur calcul quête du jour:', error)
      setDailyQuest(DailyQuestService.compute(EMPTY_METRICS))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchDailyQuest()
  }, [profileId])

  return {
    dailyQuest,
    loading,
    refetch: fetchDailyQuest,
  }
}
