import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/lib/supabase'
import { StreakService } from '@/services/streakService'
import { DailyQuest, DailyQuestService } from '@/services/dailyQuestService'

interface ExercisePerformance {
  exercise_id: string
  exercise_name: string
  sets: Array<{ set_number: number; reps: number; weight: number }>
  best_weight: number
  total_reps: number
  volume: number
}

interface SessionSummary {
  totalTime: number
  totalVolume: number
  exercises: ExercisePerformance[]
  intensity: 'Légère' | 'Modérée' | 'Intense'
  streak: {
    consecutive: number
    thisWeek: number
  }
  xp: {
    force: number
    endurance: number
    agilite: number
    mental: number
    total: number
  }
  prs: Array<{ exercise_name: string; weight: number; reps: number }>
  dailyQuest: DailyQuest
}

interface UseSessionSummaryProps {
  quest: Quest | null
  session: WorkoutSession | null
  time: number
}

type ExerciseLogRow = {
  exercise_id: string
  exercise_name?: string | null
  global_exercise_id?: string | null
  set_number: number
  reps_completed: number
  weight_used: number | null
  quest_exercises?: { name?: string | null } | { name?: string | null }[] | null
}

const getLoggedExerciseName = (log: ExerciseLogRow): string => {
  const relation = Array.isArray(log.quest_exercises) ? log.quest_exercises[0] : log.quest_exercises
  return log.exercise_name || relation?.name || 'Exercice'
}

const getLoggedExerciseKey = (log: ExerciseLogRow): string => {
  const name = getLoggedExerciseName(log).trim().toLowerCase()
  return log.global_exercise_id || `${log.exercise_id}:${name}`
}

export function useSessionSummary({ quest, session, time }: UseSessionSummaryProps) {
  const { profile } = useProfile()
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [loading, setLoading] = useState(false)

  const generateSummary = async (): Promise<SessionSummary | null> => {
    if (!quest || !session || !profile) return null

    setLoading(true)
    try {
      // Charger les vrais exercise_logs de la séance
      const { data: logs } = await supabase
        .from('exercise_logs')
        .select('exercise_id, exercise_name, global_exercise_id, set_number, reps_completed, weight_used, quest_exercises(name)')
        .eq('session_id', session.id)
        .order('exercise_id')
        .order('set_number')
      const sessionLogs = (logs || []) as ExerciseLogRow[]

      // Calculer le streak en incluant la session en cours de validation.
      const { data: completedSessions } = await supabase
        .from('workout_sessions')
        .select('id, started_at, ended_at')
        .eq('user_id', profile.id)
        .eq('is_completed', true)

      const streakDates = [
        ...((completedSessions || []).map(s => s.ended_at || s.started_at)),
        session.ended_at || session.started_at || new Date().toISOString(),
      ]
      const streak = StreakService.compute(streakDates)
      const { start, end } = DailyQuestService.getTodayRange()
      const todayCompletedSessions = (completedSessions || []).filter(completedSession => {
        const date = new Date(completedSession.ended_at || completedSession.started_at)
        return date >= start && date <= end
      })
      const todayCompletedSessionIds = todayCompletedSessions.map(completedSession => completedSession.id)
      let previousTodaySets = 0
      if (todayCompletedSessionIds.length > 0) {
        const { count } = await supabase
          .from('exercise_logs')
          .select('id', { count: 'exact', head: true })
          .in('session_id', todayCompletedSessionIds)
        previousTodaySets = count || 0
      }

      const { data: xpRows } = await supabase
        .from('audit_xp')
        .select('delta_total')
        .eq('user_id', profile.id)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())

      let exercises: ExercisePerformance[] = []
      let totalVolume = 0

      const prs: SessionSummary['prs'] = []

      if (sessionLogs.length > 0) {
        // Grouper les logs par exercice
        const grouped = new Map<string, ExerciseLogRow[]>()
        for (const log of sessionLogs) {
          const key = getLoggedExerciseKey(log)
          if (!grouped.has(key)) grouped.set(key, [])
          grouped.get(key)!.push(log)
        }

        // Charger les meilleures perfs précédentes pour chaque exercice
        const exerciseIds = [...new Set(sessionLogs.map(log => log.exercise_id))]
        const exerciseNames = [...new Set(sessionLogs.map(getLoggedExerciseName))]
        const [prevByIdResult, prevByNameResult] = await Promise.all([
          supabase
            .from('exercise_logs')
            .select('exercise_id, exercise_name, global_exercise_id, reps_completed, weight_used, quest_exercises(name)')
            .in('exercise_id', exerciseIds)
            .neq('session_id', session.id)
            .order('weight_used', { ascending: false }),
          supabase
            .from('exercise_logs')
            .select('exercise_id, exercise_name, global_exercise_id, reps_completed, weight_used, quest_exercises(name)')
            .in('exercise_name', exerciseNames)
            .neq('session_id', session.id)
            .order('weight_used', { ascending: false }),
        ])
        const prevLogs = [
          ...((prevByIdResult.data || []) as ExerciseLogRow[]),
          ...((prevByNameResult.data || []) as ExerciseLogRow[]),
        ]

        // Meilleur poids précédent par exercice
        const prevBest = new Map<string, { weight: number; reps: number }>()
        for (const log of prevLogs) {
          const key = getLoggedExerciseKey(log)
          const w = Number(log.weight_used) || 0
          const existing = prevBest.get(key)
          if (!existing || w > existing.weight || (w === existing.weight && log.reps_completed > existing.reps)) {
            prevBest.set(key, { weight: w, reps: log.reps_completed })
          }
        }

        exercises = Array.from(grouped.entries()).map(([exerciseId, sets]) => {
          const name = getLoggedExerciseName(sets[0])
          const setsData = sets.map(s => ({
            set_number: s.set_number,
            reps: s.reps_completed,
            weight: Number(s.weight_used) || 0,
          }))
          const best_weight = Math.max(...setsData.map(s => s.weight))
          const best_reps_at_best_weight = setsData
            .filter(s => s.weight === best_weight)
            .reduce((max, s) => Math.max(max, s.reps), 0)
          const total_reps = setsData.reduce((sum, s) => sum + s.reps, 0)
          const volume = setsData.reduce((sum, s) => sum + s.reps * s.weight, 0)
          totalVolume += volume

          // Détection PR
          const prev = prevBest.get(exerciseId)
          const isWeightPR = best_weight > 0 && (!prev || best_weight > prev.weight)
          const isRepsPR = !isWeightPR && prev && best_weight === prev.weight && best_reps_at_best_weight > prev.reps
          if (isWeightPR || isRepsPR) {
            prs.push({ exercise_name: name, weight: best_weight, reps: best_reps_at_best_weight })
          }

          return { exercise_id: exerciseId, exercise_name: name, sets: setsData, best_weight, total_reps, volume }
        })
      } else {
        // Fallback sur les cibles de la quest si pas de logs
        exercises = (quest.exercises || []).map(ex => {
          const sets = ex.sets_count || 3
          const reps = ex.target_reps || 10
          const weight = Number(ex.target_weight) || 0
          const volume = sets * reps * weight
          totalVolume += volume
          return {
            exercise_id: ex.id,
            exercise_name: ex.name,
            sets: Array.from({ length: sets }, (_, i) => ({ set_number: i + 1, reps, weight })),
            best_weight: weight,
            total_reps: sets * reps,
            volume,
          }
        })
      }

      const timeMinutes = (time || session.total_time_seconds || 0) / 60
      const intensity: SessionSummary['intensity'] =
        timeMinutes < 20 ? 'Légère' : timeMinutes < 50 ? 'Modérée' : 'Intense'

      const sessionSummary: SessionSummary = {
        totalTime: time || session.total_time_seconds || 0,
        totalVolume,
        exercises,
        intensity,
        streak: { consecutive: streak.currentStreak, thisWeek: streak.weekDays.length },
        xp: {
          force: quest.xp_force || 0,
          endurance: quest.xp_endurance || 0,
          agilite: quest.xp_agilite || 0,
          mental: quest.xp_mental || 0,
          total: (quest.xp_force || 0) + (quest.xp_endurance || 0) + (quest.xp_agilite || 0) + (quest.xp_mental || 0),
        },
        prs,
        dailyQuest: DailyQuestService.compute({
          completedWorkouts: todayCompletedSessions.length + 1,
          completedSets: previousTodaySets + sessionLogs.length,
          earnedXp: (xpRows || []).reduce((sum, row) => sum + (row.delta_total || 0), 0)
            + (quest.xp_force || 0) + (quest.xp_endurance || 0) + (quest.xp_agilite || 0) + (quest.xp_mental || 0),
        }),
      }

      setSummary(sessionSummary)
      return sessionSummary
    } catch (error) {
      console.error('Erreur génération récapitulatif:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const formatVolume = (kg: number): string => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`
    return `${Math.round(kg)} kg`
  }

  const getIntensityEmoji = (intensity: SessionSummary['intensity']): string => {
    switch (intensity) {
      case 'Intense': return '🔥'
      case 'Modérée': return '💪'
      case 'Légère': return '🌱'
    }
  }

  const getProgressionMessage = (): string => "Séance enregistrée !"

  return { summary, loading, generateSummary, formatVolume, getIntensityEmoji, getProgressionMessage }
}
