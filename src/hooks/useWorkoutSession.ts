import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

interface UseWorkoutSessionProps {
  quest: Quest | null
}

interface RoundTime {
  roundNumber: number
  duration: number
  timestamp: number
}

export function useWorkoutSession({ quest }: UseWorkoutSessionProps) {
  const navigate = useNavigate()
  const { profile } = useProfile()
  
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [roundStartTime, setRoundStartTime] = useState(0)
  const [roundTimes, setRoundTimes] = useState<RoundTime[]>([])
  const [workTime, setWorkTime] = useState(0)

  const startWorkout = async () => {
    if (!quest || !profile) {
      console.error('❌ Pas de quête ou profil pour démarrer')
      return
    }

    try {
      console.log('🚀 Démarrage de l\'entraînement...')
      console.log('🔍 Quest workout_type:', quest.workout_type) // Debug
      
      setIsRunning(true)
      setRoundStartTime(0)

      const { data: newSession, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: profile.id,
          quest_id: quest.id,
          workout_type: quest.workout_type,  // ← AJOUTER cette ligne
          started_at: new Date().toISOString(),
          is_completed: false,
          total_time_seconds: 0,
          rounds_completed: 0,
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Erreur création session:', error)
        throw error
      }

      console.log('✅ Session créée:', newSession.id)
      setSession(newSession)

      toast({
        title: '🚀 Session démarrée',
        description: 'Bon entraînement !',
      })

    } catch (error) {
      console.error('❌ Erreur lors du démarrage:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer la session',
        variant: 'destructive',
      })
      setIsRunning(false)
    }
  }

  const pauseWorkout = useCallback(() => {
    console.log('⏸️ Pause de l\'entraînement')
    setIsRunning(false)
  }, [])

  const resetWorkout = async () => {
    console.log('🔄 Reset de l\'entraînement')
    
    if (session) {
      try {
        await supabase
          .from('workout_sessions')
          .update({
            is_completed: false,
            ended_at: null,
            total_time_seconds: 0,
            rounds_completed: 0,
          })
          .eq('id', session.id)
      } catch (error) {
        console.warn('⚠️ Erreur reset session:', error)
      }
    }

    setIsRunning(false)
    setTime(0)
    setWorkTime(0)
    setRounds(0)
    setCurrentRound(1)
    setRoundStartTime(0)
    setRoundTimes([])

    toast({
      title: '🔄 Reset effectué',
      description: 'Session remise à zéro',
    })
  }

  const saveSession = async () => {
    if (!session) return

    try {
      await supabase
        .from('workout_sessions')
        .update({
          total_time_seconds: time,
          rounds_completed: rounds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id)
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde session:', error)
    }
  }

  const addRound = async () => {
    const currentTime = time
    const roundDuration = roundStartTime > 0 ? currentTime - roundStartTime : currentTime

    const newRounds = rounds + 1
    setRounds(newRounds)
    setCurrentRound(newRounds + 1)

    const newRoundTime: RoundTime = {
      roundNumber: newRounds,
      duration: roundDuration,
      timestamp: Date.now(),
    }
    setRoundTimes(prev => [...prev, newRoundTime])
    setRoundStartTime(currentTime)

    if (session) {
      try {
        await supabase.from('session_rounds').insert({
          session_id: session.id,
          round_no: newRounds,
          duration_seconds: roundDuration,
          reps_total: quest?.exercises.reduce((sum, ex) => sum + (ex.target_reps ?? 0), 0) || 0,
        })
        await saveSession()
      } catch (error) {
        console.warn('⚠️ Erreur sauvegarde round:', error)
      }
    }

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    toast({
      title: `Tour ${newRounds} terminé !`,
      description: `Temps: ${formatTime(roundDuration)}`,
    })
  }

  const finishWorkout = () => {
    console.log('🏁 finishWorkout appelée dans useWorkoutSession')
    console.log('🔍 État actuel:', { rounds, time, questTitle: quest?.title })
    setIsRunning(false)
    return {
      rounds: rounds,
      totalTime: time,
      questTitle: quest?.title,
    }
  }

  return {
    // States
    session,
    isRunning,
    time,
    rounds,
    currentRound,
    roundStartTime,
    roundTimes,
    workTime,
    
    // Setters
    setSession,
    setTime,
    setWorkTime,
    setIsRunning,
    setRounds,
    
    // Actions
    startWorkout,
    pauseWorkout,
    resetWorkout,
    saveSession,
    addRound,
    finishWorkout,
  }
}