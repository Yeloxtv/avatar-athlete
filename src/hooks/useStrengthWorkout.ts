import { useState, useEffect, useRef, useCallback } from 'react'
import { StrengthWorkoutState, ExerciseLog, SetInput, PreviousPerformance } from '@/types/strength'
import type { Tables } from '@/integrations/supabase/types'
import { supabase } from '@/integrations/supabase/client'

type QuestExercise = Tables<'quest_exercises'>

interface UseStrengthWorkoutProps {
  exercises: QuestExercise[]
  sessionId: string
  restTimeSeconds?: number
  onSetCompleted?: (event: {
    exerciseId: string
    exerciseName: string
    setNumber: number
    reps: number
    weight: number
    xp: number
  }) => void
}

function calculateLiveSetXp(reps: number, weight?: number): number {
  const effortXp = Math.min(10, Math.floor(Math.max(0, reps) / 2))
  const loadXp = Math.min(12, Math.floor(Math.max(0, weight || 0) / 5))
  return 10 + effortXp + loadXp
}

export const useStrengthWorkout = ({
  exercises: initialExercises,
  sessionId,
  restTimeSeconds = 60,
  onSetCompleted
}: UseStrengthWorkoutProps) => {

  const [exercises, setExercises] = useState<QuestExercise[]>(initialExercises)

  const [state, setState] = useState<StrengthWorkoutState>({
    currentExerciseIndex: 0,
    currentSet: 1,
    exerciseLogs: [],
    restTimer: 0,
    isResting: false,
    completedSets: 0,
    previousPerformances: {}
  })

  const [lastPR, setLastPR] = useState<{ exerciseName: string; weight: number; reps: number } | null>(null)

  const restTimerRef = useRef<number | null>(null)

  const currentExercise = exercises[state.currentExerciseIndex]

  const totalSets = currentExercise?.sets_count || 3
  const exerciseRestTime = currentExercise?.rest_seconds || restTimeSeconds
  const isWorkoutComplete = state.currentExerciseIndex >= exercises.length

  const totalSetsInWorkout = exercises.reduce((total, ex) => total + (ex.sets_count || 3), 0)
  const progressPercentage = totalSetsInWorkout > 0
    ? ((state.completedSets / totalSetsInWorkout) * 100)
    : 0

  const currentExerciseLogs = state.exerciseLogs.filter(
    log => log.exercise_id === currentExercise?.id
  )
  const canCompleteSet = !state.isResting && !isWorkoutComplete
  const setsRemaining = totalSets - (state.currentSet - 1)

  const startRest = useCallback(() => {
    const restTime = exerciseRestTime
    setState(prev => ({ ...prev, isResting: true, restTimer: restTime }))

    restTimerRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.restTimer <= 1) {
          if (restTimerRef.current) {
            clearInterval(restTimerRef.current)
            restTimerRef.current = null
          }
          return { ...prev, isResting: false, restTimer: 0 }
        }
        return { ...prev, restTimer: prev.restTimer - 1 }
      })
    }, 1000)
  }, [exerciseRestTime])

  const skipRest = useCallback(() => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current)
      restTimerRef.current = null
    }
    setState(prev => ({ ...prev, isResting: false, restTimer: 0 }))
  }, [])

  const adjustRest = useCallback((delta: number) => {
    setState(prev => ({ ...prev, restTimer: Math.max(0, prev.restTimer + delta) }))
  }, [])

  const completeSet = useCallback(async (setData: SetInput) => {
    if (!currentExercise || !sessionId) return

    const globalExerciseId = (currentExercise as any).global_exercise_id ?? null

    const newLog: ExerciseLog = {
      session_id: sessionId,
      exercise_id: currentExercise.id,
      set_number: state.currentSet,
      reps_completed: setData.reps,
      weight_used: setData.weight
    }

    try {
      const { error } = await supabase
        .from('exercise_logs')
        .insert({
          ...newLog,
          exercise_name: currentExercise.name,
          ...(globalExerciseId ? { global_exercise_id: globalExerciseId } : {}),
        })

      if (error) throw error

      const prevPerf = state.previousPerformances[currentExercise.id]
      const prevBestWeight = prevPerf?.weight_used ?? 0
      const prevBestReps = prevPerf?.reps_completed ?? 0
      const isWeightPR = setData.weight > 0 && setData.weight > prevBestWeight
      const isRepsPR = setData.weight === prevBestWeight && setData.reps > prevBestReps
      if (isWeightPR || isRepsPR) {
        setLastPR({ exerciseName: currentExercise.name, weight: setData.weight, reps: setData.reps })
      }

      onSetCompleted?.({
        exerciseId: currentExercise.id,
        exerciseName: currentExercise.name,
        setNumber: state.currentSet,
        reps: setData.reps,
        weight: setData.weight ?? 0,
        xp: calculateLiveSetXp(setData.reps, setData.weight),
      })

      setState(prev => {
        const newState = {
          ...prev,
          exerciseLogs: [...prev.exerciseLogs, newLog],
          completedSets: prev.completedSets + 1
        }

        if (prev.currentSet < totalSets) {
          newState.currentSet = prev.currentSet + 1
        } else {
          newState.currentExerciseIndex = prev.currentExerciseIndex + 1
          newState.currentSet = 1
        }

        return newState
      })

      if (state.currentSet < totalSets) {
        startRest()
      }

    } catch (error) {
      console.error('Erreur sauvegarde set:', error)
    }
  }, [sessionId, currentExercise, state.currentSet, totalSets, startRest, onSetCompleted])

  const fetchBestPreviousPerformance = async (exerciseId: string): Promise<PreviousPerformance | null> => {
    if (!sessionId) return null

    const currentExercise = exercises.find(ex => ex.id === exerciseId)
    if (!currentExercise?.name) return null

    try {
      const { data: allExerciseLogs, error } = await supabase
        .from('exercise_logs')
        .select(`
          session_id,
          completed_at,
          reps_completed,
          weight_used,
          set_number,
          quest_exercises!inner(name)
        `)
        .eq('quest_exercises.name', currentExercise.name)
        .neq('session_id', sessionId)
        .order('completed_at', { ascending: false })

      if (error || !allExerciseLogs?.length) return null

      const sessionGroups = allExerciseLogs.reduce((groups, log) => {
        if (!groups[log.session_id]) {
          groups[log.session_id] = { date: log.completed_at, sets: [] }
        }
        groups[log.session_id].sets.push(log)
        return groups
      }, {} as Record<string, { date: string, sets: any[] }>)

      const latestSessionId = Object.keys(sessionGroups)[0]
      const latestSession = sessionGroups[latestSessionId]

      const bestSet = latestSession.sets.reduce((best, current) => {
        if (current.reps_completed > best.reps_completed) return current
        if (current.reps_completed === best.reps_completed &&
          (current.weight_used || 0) > (best.weight_used || 0)) return current
        return best
      })

      return {
        reps_completed: bestSet.reps_completed,
        weight_used: bestSet.weight_used,
        session_date: latestSession.date
      }
    } catch {
      return null
    }
  }

  useEffect(() => {
    const loadPreviousPerformances = async () => {
      const performances: Record<string, PreviousPerformance | null> = {}

      for (const exercise of exercises) {
        const prevPerf = await fetchBestPreviousPerformance(exercise.id)
        performances[exercise.id] = prevPerf ?? null
      }

      setState(prev => ({
        ...prev,
        previousPerformances: performances
      }))
    }

    if (exercises.length > 0 && sessionId) {
      loadPreviousPerformances()
    }
  }, [exercises, sessionId])

  const switchToExercise = useCallback((targetIndex: number) => {
    const current = state.currentExerciseIndex
    if (targetIndex <= current || targetIndex >= exercises.length) return
    setExercises(prev => {
      const next = [...prev]
      ;[next[current], next[targetIndex]] = [next[targetIndex], next[current]]
      return next
    })
    setState(prev => ({ ...prev, currentSet: 1 }))
  }, [exercises.length, state.currentExerciseIndex])

  const substituteExercise = useCallback(async (
    globalExerciseId: string,
    substituteName: string,
    substituteMuscleGroup: string
  ) => {
    const idx = state.currentExerciseIndex
    const original = exercises[idx]
    if (!original) return

    // Remplace le nom dans la liste locale (garde tous les autres champs : sets, reps, rest)
    const substituted: QuestExercise = {
      ...original,
      name: substituteName,
      // on stocke l'id global pour le logging
      // @ts-ignore — champ extra non typé
      global_exercise_id: globalExerciseId,
    }

    setExercises(prev => {
      const next = [...prev]
      next[idx] = substituted
      return next
    })

    // Charger les perfs précédentes pour le nouvel exercice par nom
    try {
      const { data: logs } = await supabase
        .from('exercise_logs')
        .select(`
          session_id,
          completed_at,
          reps_completed,
          weight_used,
          exercise_name
        `)
        .eq('exercise_name', substituteName)
        .neq('session_id', sessionId)
        .order('completed_at', { ascending: false })
        .limit(20)

      if (logs && logs.length > 0) {
        const latestSessionId = logs[0].session_id
        const latestSets = logs.filter(l => l.session_id === latestSessionId)
        const best = latestSets.reduce((b, c) => {
          if ((c.reps_completed ?? 0) > (b.reps_completed ?? 0)) return c
          if (c.reps_completed === b.reps_completed && (c.weight_used ?? 0) > (b.weight_used ?? 0)) return c
          return b
        })
        setState(prev => ({
          ...prev,
          previousPerformances: {
            ...prev.previousPerformances,
            [substituted.id]: {
              reps_completed: best.reps_completed ?? 0,
              weight_used: best.weight_used ?? null,
              session_date: best.completed_at,
            }
          }
        }))
      } else {
        // Pas d'historique pour cet exercice
        setState(prev => ({
          ...prev,
          previousPerformances: {
            ...prev.previousPerformances,
            [substituted.id]: null,
          }
        }))
      }
    } catch {
      // silencieux
    }
  }, [state.currentExerciseIndex, exercises, sessionId])

  useEffect(() => {
    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current)
        restTimerRef.current = null
      }
    }
  }, [])

  return {
    state: state as Readonly<StrengthWorkoutState>,
    exercises,
    currentExercise,
    isWorkoutComplete,
    progressPercentage,
    currentExerciseLogs,
    canCompleteSet,
    setsRemaining,
    totalSets,
    exerciseRestTime,
    previousPerformances: state.previousPerformances,
    getCurrentExercisePreviousPerformance: () => {
      return currentExercise ? state.previousPerformances[currentExercise.id] : null
    },
    lastPR,
    clearPR: () => setLastPR(null),
    completeSet,
    startRest,
    skipRest,
    adjustRest,
    switchToExercise,
    substituteExercise,
  } as const
}
