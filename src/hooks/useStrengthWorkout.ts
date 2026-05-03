import { useState, useEffect, useRef, useCallback } from 'react'
import { StrengthWorkoutState, ExerciseLog, SetInput, PreviousPerformance } from '@/types/strength'
import type { Tables } from '@/integrations/supabase/types'
import { supabase } from '@/integrations/supabase/client'

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
    completedSets: 0,
    previousPerformances: {} // 🆕 Nouveau champ
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

  // Ajouter une fonction pour récupérer les performances précédentes
  const fetchPreviousPerformance = async (exerciseId: string) => {
    if (!sessionId) return null
  
    try {
      const { data, error } = await supabase
        .from('exercise_logs')
        .select('reps_completed, weight_used, created_at')
        .eq('exercise_id', exerciseId)
        .neq('session_id', sessionId) // Exclure la session actuelle
        .order('created_at', { ascending: false })
        .limit(1)
    
      if (error) {
        console.warn('Erreur récupération performance précédente:', error)
        return null
      }
    
      return data?.[0] || null
    } catch (error) {
      console.warn('Erreur récupération performance précédente:', error)
      return null
    }
  }

  // Remplace la fonction fetchBestPreviousPerformance par :
  const fetchBestPreviousPerformance = async (exerciseId: string): Promise<PreviousPerformance | null> => {
    if (!sessionId) return null

    const currentExercise = exercises.find(ex => ex.id === exerciseId)
    if (!currentExercise?.name) return null

    try {
      console.log(`🔍 Recherche performance précédente pour "${currentExercise.name}"`)
      
      // 1. Récupérer tous les exercise_logs avec le même nom d'exercice
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
        .eq('quest_exercises.name', currentExercise.name) // ← Recherche par nom !
        .neq('session_id', sessionId) // Exclure session actuelle
        .order('completed_at', { ascending: false })
    
      if (error) {
        console.warn(`❌ Erreur recherche pour "${currentExercise.name}":`, error)
        return null
      }
    
      if (!allExerciseLogs?.length) {
        console.log(`ℹ️ Aucune performance trouvée pour "${currentExercise.name}"`)
        return null
      }
    
      console.log(`📊 ${allExerciseLogs.length} logs trouvés pour "${currentExercise.name}"`)
    
      // 2. Grouper par session pour trouver la session la plus récente
      const sessionGroups = allExerciseLogs.reduce((groups, log) => {
        if (!groups[log.session_id]) {
          groups[log.session_id] = {
            date: log.completed_at,
            sets: []
          }
        }
        groups[log.session_id].sets.push(log)
        return groups
      }, {} as Record<string, { date: string, sets: any[] }>)
    
      // 3. Prendre la session la plus récente (déjà triée par completed_at DESC)
      const latestSessionId = Object.keys(sessionGroups)[0]
      const latestSession = sessionGroups[latestSessionId]
    
      console.log(`✅ Session la plus récente: ${latestSessionId} (${latestSession.date})`)
      console.log(`📊 ${latestSession.sets.length} séries dans cette session`)
    
      // 4. Trouver la MEILLEURE série de cette session
      const bestSet = latestSession.sets.reduce((best, current) => {
        // Priorité 1: Plus de reps
        if (current.reps_completed > best.reps_completed) {
          return current
        }
        // Priorité 2: Même reps mais plus lourd
        if (current.reps_completed === best.reps_completed && 
            (current.weight_used || 0) > (best.weight_used || 0)) {
          return current
        }
        return best
      })
    
      console.log(`🏆 Meilleure série pour "${currentExercise.name}":`, bestSet)
    
      return {
        reps_completed: bestSet.reps_completed,
        weight_used: bestSet.weight_used,
        session_date: latestSession.date
      }
    } catch (error) {
      console.warn(`❌ Erreur générale pour "${currentExercise.name}":`, error)
      return null
    }
  }

  // Et dans useEffect, charger les performances précédentes :
  useEffect(() => {
    const loadPreviousPerformances = async () => {
      console.log('🚀 Début chargement performances précédentes')
      console.log('📋 Exercices reçus:', exercises.map(ex => ({ id: ex.id, name: ex.name })))
      
      const performances: Record<string, PreviousPerformance | null> = {}
      
      for (const exercise of exercises) {
        console.log(`🔄 Traitement exercice: ${exercise.name} (ID: ${exercise.id})`)
        const prevPerf = await fetchBestPreviousPerformance(exercise.id)
        
        if (prevPerf) {
          console.log(`✅ Performance trouvée pour ${exercise.name}:`, prevPerf)
          performances[exercise.id] = prevPerf
        } else {
          console.log(`ℹ️ Aucune performance trouvée pour ${exercise.name}`)
          performances[exercise.id] = null
        }
      }
      
      console.log('📊 Performances finales:', performances)
      
      setState(prev => ({
        ...prev,
        previousPerformances: performances
      }))
    }
  
    if (exercises.length > 0 && sessionId) {
      loadPreviousPerformances()
    }
  }, [exercises, sessionId])

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
    previousPerformances: state.previousPerformances,
    getCurrentExercisePreviousPerformance: () => {
      return currentExercise ? state.previousPerformances[currentExercise.id] : null
    },
    
    // Actions
    completeSet,
    startRest,
    skipRest
  } as const
}