import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/integrations/supabase/types'

type Quest = Database['public']['Tables']['quests']['Row']
type QuestExercise = Database['public']['Tables']['quest_exercises']['Row']
type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']

interface WorkoutState {
  isActive: boolean
  isPaused: boolean
  timeElapsed: number
  currentRound: number
  phase: 'work' | 'rest' | 'finished'
  roundsCompleted: number
}

export function useWorkout(questId: string) {
  const { user } = useAuth()
  const [quest, setQuest] = useState<Quest | null>(null)
  const [exercises, setExercises] = useState<QuestExercise[]>([])
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [workoutState, setWorkoutState] = useState<WorkoutState>({
    isActive: false,
    isPaused: false,
    timeElapsed: 0,
    currentRound: 0,
    phase: 'work',
    roundsCompleted: 0
  })
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (questId) {
      fetchQuestData()
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [questId])

  // Auto-save workout state
  useEffect(() => {
    if (session && workoutState.isActive) {
      const saveState = async () => {
        await supabase
          .from('workout_sessions')
          .update({
            total_time_seconds: workoutState.timeElapsed,
            rounds_completed: workoutState.roundsCompleted
          })
          .eq('id', session.id)
      }
      saveState()
    }
  }, [workoutState.timeElapsed, workoutState.roundsCompleted, session])

  const fetchQuestData = async () => {
    try {
      const { data: questData, error: questError } = await supabase
        .from('quests')
        .select('*')
        .eq('id', questId)
        .single()

      if (questError) throw questError

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('quest_exercises')
        .select('*')
        .eq('quest_id', questId)
        .order('order_index')

      if (exercisesError) throw exercisesError

      setQuest(questData)
      setExercises(exercisesData || [])

      // Check for existing session
      if (user) {
        await checkExistingSession(questData)
      }
    } catch (error) {
      console.error('Error fetching quest data:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkExistingSession = async (questData: Quest) => {
    if (!user) return

    const { data: existingSession } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('quest_id', questId)
      .eq('is_completed', false)
      .order('started_at', { ascending: false })
      .limit(1)
      .single()

    if (existingSession) {
      setSession(existingSession)
      setWorkoutState(prev => ({
        ...prev,
        timeElapsed: existingSession.total_time_seconds,
        roundsCompleted: existingSession.rounds_completed
      }))
    }
  }

  const startWorkout = async () => {
    if (!user || !quest) return

    let currentSession = session

    if (!currentSession) {
      // Create new session
      const { data: newSession, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          quest_id: quest.id,
          workout_type: quest.workout_type
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating session:', error)
        return
      }

      currentSession = newSession
      setSession(newSession)
    }

    setWorkoutState(prev => ({ ...prev, isActive: true, isPaused: false }))
    startTimer()
  }

  const pauseWorkout = () => {
    setWorkoutState(prev => ({ ...prev, isPaused: true }))
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resumeWorkout = () => {
    setWorkoutState(prev => ({ ...prev, isPaused: false }))
    startTimer()
  }

  const stopWorkout = async () => {
    setWorkoutState(prev => ({ ...prev, isActive: false, isPaused: false }))
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (session) {
      await supabase
        .from('workout_sessions')
        .update({
          ended_at: new Date().toISOString(),
          is_completed: true,
          total_time_seconds: workoutState.timeElapsed,
          rounds_completed: workoutState.roundsCompleted
        })
        .eq('id', session.id)
    }
  }

  const addRound = async () => {
    if (!session) return

    const newRoundNumber = workoutState.roundsCompleted + 1
    
    // Add round to session_rounds
    await supabase
      .from('session_rounds')
      .insert({
        session_id: session.id,
        round_no: newRoundNumber,
        duration_seconds: Math.floor(workoutState.timeElapsed / newRoundNumber),
        reps_total: 0
      })

    setWorkoutState(prev => ({
      ...prev,
      roundsCompleted: newRoundNumber,
      currentRound: newRoundNumber
    }))
  }

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setWorkoutState(prev => {
        const newTimeElapsed = prev.timeElapsed + 1

        // Handle different workout types
        if (quest?.workout_type === 'tabata') {
          const cycleTime = (quest.work_seconds + quest.rest_seconds)
          const currentCycleTime = newTimeElapsed % cycleTime
          const isWorkPhase = currentCycleTime <= quest.work_seconds
          const completedCycles = Math.floor(newTimeElapsed / cycleTime)

          return {
            ...prev,
            timeElapsed: newTimeElapsed,
            phase: isWorkPhase ? 'work' : 'rest',
            currentRound: completedCycles + 1,
            roundsCompleted: completedCycles
          }
        } else if (quest?.workout_type === 'amrap' && quest?.total_minutes) {
          const totalSeconds = quest.total_minutes * 60
          if (newTimeElapsed >= totalSeconds) {
            // Auto-stop for AMRAP
            return {
              ...prev,
              timeElapsed: totalSeconds,
              isActive: false,
              phase: 'finished'
            }
          }
        }

        return {
          ...prev,
          timeElapsed: newTimeElapsed
        }
      })
    }, 1000)
  }

  const resetWorkout = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setWorkoutState({
      isActive: false,
      isPaused: false,
      timeElapsed: 0,
      currentRound: 0,
      phase: 'work',
      roundsCompleted: 0
    })

    setSession(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeRemaining = () => {
    if (!quest) return 0

    if (quest.workout_type === 'amrap' && quest.total_minutes) {
      return Math.max(0, (quest.total_minutes * 60) - workoutState.timeElapsed)
    } else if (quest.workout_type === 'tabata') {
      const cycleTime = quest.work_seconds + quest.rest_seconds
      const currentCycleTime = workoutState.timeElapsed % cycleTime
      const isWorkPhase = currentCycleTime <= quest.work_seconds
      
      if (isWorkPhase) {
        return quest.work_seconds - currentCycleTime
      } else {
        return cycleTime - currentCycleTime
      }
    }

    return 0
  }

  return {
    quest,
    exercises,
    session,
    workoutState,
    loading,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    stopWorkout,
    addRound,
    resetWorkout,
    formatTime,
    getTimeRemaining
  }
}