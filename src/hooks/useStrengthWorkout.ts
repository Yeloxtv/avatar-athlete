import { useState, useEffect, useRef, useCallback } from 'react'
import { StrengthWorkoutState, ExerciseLog, SetInput, PreviousPerformance } from '@/types/strength'
import type { Tables } from '@/integrations/supabase/types'
import { supabase } from '@/integrations/supabase/client'
import { XpService } from '@/services/xpService'

type QuestExercise = Tables<'quest_exercises'>

// Extended type that carries enriched data from the exercises table
export type EnrichedQuestExercise = QuestExercise & {
  gif_url?: string | null
  global_exercise_id?: string | null
}

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

async function enrichExercisesWithGifs(exercises: QuestExercise[]): Promise<EnrichedQuestExercise[]> {
  if (!exercises.length) return exercises
  const names = exercises.map(e => e.name).filter(Boolean)
  const { data } = await supabase
    .from('exercises')
    .select('id, name, gif_url')
    .in('name', names)
  if (!data?.length) return exercises
  const byName = new Map(data.map(e => [e.name, e]))
  return exercises.map(ex => {
    const match = byName.get(ex.name)
    return match
      ? { ...ex, gif_url: match.gif_url, global_exercise_id: match.id }
      : ex
  })
}

export const useStrengthWorkout = ({
  exercises: initialExercises,
  sessionId,
  restTimeSeconds = 60,
  onSetCompleted
}: UseStrengthWorkoutProps) => {

  const [exercises, setExercises] = useState<EnrichedQuestExercise[]>(initialExercises)

  // Sync + enrich with gif_url when exercises load
  useEffect(() => {
    if (initialExercises.length > 0) {
      enrichExercisesWithGifs(initialExercises).then(setExercises)
    }
  }, [initialExercises.length])

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
  const isWorkoutComplete = exercises.length > 0 && state.currentExerciseIndex >= exercises.length

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

    restTimerRef.current = setInterval(() => {
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

    const globalExerciseId = (currentExercise as EnrichedQuestExercise).global_exercise_id ?? null

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
        xp: XpService.calculateLiveSetXp(setData.reps, setData.weight),
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
    const loadInitialState = async () => {
      const performances: Record<string, PreviousPerformance | null> = {}
      for (const exercise of exercises) {
        const prevPerf = await fetchBestPreviousPerformance(exercise.id)
        performances[exercise.id] = prevPerf ?? null
      }

      // Restaurer la position courante depuis les logs déjà enregistrés pour cette session
      const { data: existingLogs } = await supabase
        .from('exercise_logs')
        .select('exercise_id, set_number')
        .eq('session_id', sessionId)
        .order('set_number', { ascending: true })

      let restoredExerciseIndex = 0
      let restoredSet = 1
      let restoredCompletedSets = 0

      if (existingLogs && existingLogs.length > 0) {
        // Reconstruire combien de séries ont été faites par exercice
        const setsDonePerExercise: Record<string, number> = {}
        for (const log of existingLogs) {
          setsDonePerExercise[log.exercise_id] = Math.max(
            setsDonePerExercise[log.exercise_id] ?? 0,
            log.set_number
          )
        }
        restoredCompletedSets = existingLogs.length

        // Trouver le premier exercice pas encore terminé
        for (let i = 0; i < exercises.length; i++) {
          const ex = exercises[i]
          const setsDone = setsDonePerExercise[ex.id] ?? 0
          const totalSetsForEx = ex.sets_count ?? 3
          if (setsDone < totalSetsForEx) {
            restoredExerciseIndex = i
            restoredSet = setsDone + 1
            break
          }
          // Exercice terminé, passer au suivant
          restoredExerciseIndex = i + 1
          restoredSet = 1
        }
      }

      setState(prev => ({
        ...prev,
        previousPerformances: performances,
        // Ne restaurer la position que si des logs existent — sinon on garde index 0 / set 1
        ...(restoredCompletedSets > 0 && {
          currentExerciseIndex: restoredExerciseIndex,
          currentSet: restoredSet,
          completedSets: restoredCompletedSets,
        }),
      }))
    }

    if (exercises.length > 0 && sessionId && sessionId !== '') {
      loadInitialState()
    }
  }, [sessionId])

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

    // Fetch gif_url for the substitute from the exercises table
    let gifUrl: string | null = null
    try {
      const { data: exData } = await supabase
        .from('exercises')
        .select('gif_url')
        .eq('id', globalExerciseId)
        .maybeSingle()
      gifUrl = exData?.gif_url ?? null
    } catch { /* non-blocking */ }

    // Charger les perfs passées pour pré-remplir target_reps/target_weight
    let bestReps: number | null = null
    let bestWeight: number | null = null
    try {
      const { data: logs } = await supabase
        .from('exercise_logs')
        .select('session_id, completed_at, reps_completed, weight_used, exercise_name')
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
        bestReps = best.reps_completed ?? null
        bestWeight = best.weight_used ?? null

        setState(prev => ({
          ...prev,
          previousPerformances: {
            ...prev.previousPerformances,
            [original.id]: {
              reps_completed: best.reps_completed ?? 0,
              weight_used: best.weight_used ?? null,
              session_date: best.completed_at,
            }
          }
        }))
      } else {
        setState(prev => ({
          ...prev,
          previousPerformances: { ...prev.previousPerformances, [original.id]: null }
        }))
      }
    } catch { /* silencieux */ }

    const substituted: EnrichedQuestExercise = {
      ...original,
      name: substituteName,
      global_exercise_id: globalExerciseId,
      gif_url: gifUrl,
      // Pré-remplir avec l'historique si disponible, sinon garder les valeurs originales
      target_reps: bestReps ?? original.target_reps,
      target_weight: bestWeight ?? original.target_weight,
    }

    setExercises(prev => {
      const next = [...prev]
      next[idx] = substituted
      return next
    })

    // Persist exercise_id on quest_exercises row
    supabase
      .from('quest_exercises')
      .update({ exercise_id: globalExerciseId } as any)
      .eq('id', original.id)
      .then(() => { /* fire-and-forget */ })
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
