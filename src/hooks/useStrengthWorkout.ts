import { useState, useEffect, useRef, useCallback } from 'react'
import { StrengthWorkoutState, ExerciseLog, SetInput } from '@/types/strength'
import type { Tables } from '@/integrations/supabase/types'
import { supabase } from '@/lib/supabase'

// Types extraits des tables Supabase
type QuestExercise = Tables<'quest_exercises'>

interface UseStrengthWorkoutProps {
  exercises: QuestExercise[]
  sessionId: string
  restTimeSeconds?: number 
}

export const useStrengthWorkout = ({ 
  exercises, 
  sessionId, 
  restTimeSeconds = 60 
}: UseStrengthWorkoutProps) => {
  
  // État principal
  const [state, setState] = useState<StrengthWorkoutState>({
    currentExerciseIndex: 0,
    currentSet: 1,
    exerciseLogs: [],
    restTimer: 0,
    isResting: false,
    completedSets: 0
  })

  // Timer refs pour éviter les re-renders
  const restTimerRef = useRef<number | null>(null)

  // 📊 Computed values (avec les nouveaux champs)
  const currentExercise = exercises[state.currentExerciseIndex]
  
  // 🔍 Debug temporaire pour voir les champs
  console.log('🔍 Exercise fields:', {
    sets_count: currentExercise?.sets_count,
    target_weight: currentExercise?.target_weight,
    rest_seconds: currentExercise?.rest_seconds
  })
  
  const totalSets = currentExercise?.sets_count || 3 // ← Maintenant dynamique
  const exerciseRestTime = currentExercise?.rest_seconds || restTimeSeconds
  const isWorkoutComplete = state.currentExerciseIndex >= exercises.length
  
  // Calcul de progression plus précis
  const totalSetsInWorkout = exercises.reduce((total, ex) => total + (ex.sets_count || 3), 0)
  const progressPercentage = totalSetsInWorkout > 0 
    ? ((state.completedSets / totalSetsInWorkout) * 100) 
    : 0
    
  const currentExerciseLogs = state.exerciseLogs.filter(
    log => log.exercise_id === currentExercise?.id
  )
  const canCompleteSet = !state.isResting && !isWorkoutComplete
  const setsRemaining = totalSets - (state.currentSet - 1)

  // 🔥 Utiliser le temps de repos de l'exercice
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

  const completeSet = useCallback(async (setData: SetInput) => {
    // Guards clauses (pattern moderne 2025)
    if (!currentExercise || !sessionId) {
      console.warn('⚠️ Cannot complete set: missing exercise or session')
      return
    }

    const newLog: ExerciseLog = {
      session_id: sessionId,
      exercise_id: currentExercise.id,
      set_number: state.currentSet,
      reps_completed: setData.reps,
      weight_used: setData.weight
    }

    try {
      // Sauvegarde en base
      const { error } = await supabase
        .from('exercise_logs')
        .insert(newLog)

      if (error) throw error

      // État updates en batch pour performance
      setState(prev => {
        const newState = {
          ...prev,
          exerciseLogs: [...prev.exerciseLogs, newLog],
          completedSets: prev.completedSets + 1
        }

        // Logique de progression
        if (prev.currentSet < totalSets) {
          // Encore des séries → Prochaine série
          newState.currentSet = prev.currentSet + 1
        } else {
          // Exercice terminé → Exercice suivant
          newState.currentExerciseIndex = prev.currentExerciseIndex + 1
          newState.currentSet = 1
        }

        return newState
      })

      // Démarrer repos seulement si pas le dernier set de l'exercice
      if (state.currentSet < totalSets) {
        startRest()
      }

    } catch (error) {
      console.error('❌ Erreur sauvegarde set:', error)
      // TODO: Ajouter error state + retry logic
    }
  }, [sessionId, currentExercise, state.currentSet, totalSets, startRest])

  // 🧹 Cleanup moderne
  useEffect(() => {
    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current)
        restTimerRef.current = null
      }
    }
  }, [])

  // 📤 API enrichie
  return {
    state: state as Readonly<StrengthWorkoutState>,
    currentExercise,
    isWorkoutComplete,
    progressPercentage,
    currentExerciseLogs,
    canCompleteSet,
    setsRemaining,
    totalSets, // ← Nouveau
    exerciseRestTime, // ← Nouveau
    
    // Actions
    completeSet,
    startRest,
    skipRest
  } as const
}