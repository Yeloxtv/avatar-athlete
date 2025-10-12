import { useEffect, useState } from 'react'
import { Quest } from '@/lib/supabase'

interface UseHiitTimerProps {
  quest: Quest | null
  isStrengthWorkout: boolean
  isRunning: boolean
  time: number
  setTime: (time: number) => void
  workTime: number
  setWorkTime: (workTime: number) => void
}

export function useHiitTimer({ 
  quest, 
  isStrengthWorkout, 
  isRunning, 
  time, 
  setTime, 
  workTime, 
  setWorkTime 
}: UseHiitTimerProps) {
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [isWorkPhase, setIsWorkPhase] = useState(true)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(1)
  const [roundTimes, setRoundTimes] = useState<any[]>([])

  // Timer principal
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
        if (!isStrengthWorkout) {
          setWorkTime(prev => prev + 1)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isStrengthWorkout, setTime, setWorkTime])

  // Logique spécifique HIIT (Tabata, AMRAP, etc.)
  useEffect(() => {
    if (!isRunning || isStrengthWorkout || !quest) return

    const workoutType = quest.workout_type?.toLowerCase()

    // Tabata: 20s travail / 10s repos
    if (workoutType === 'tabata') {
      const workSeconds = quest.work_seconds || 20
      const restSeconds = quest.rest_seconds || 10
      const cycleTime = workSeconds + restSeconds
      const currentCycleTime = workTime % cycleTime

      if (currentCycleTime < workSeconds) {
        setIsWorkPhase(true)
      } else {
        setIsWorkPhase(false)
      }

      // Changement d'exercice à chaque cycle complet
      const completedCycles = Math.floor(workTime / cycleTime)
      const newExerciseIndex = completedCycles % (quest.exercises?.length || 1)
      setExerciseIndex(newExerciseIndex)
    }

    // AMRAP: temps limite fixe
    else if (workoutType === 'amrap') {
      const totalMinutes = quest.total_minutes || 10
      const maxTime = totalMinutes * 60

      if (workTime >= maxTime) {
        console.log('⏰ Temps AMRAP écoulé!')
        // On peut arrêter automatiquement ou juste notifier
      }
    }

    // For Time: pas de limite de temps, juste chronométrer
    else if (workoutType === 'for_time') {
      setIsWorkPhase(true) // Toujours en phase de travail
    }

    // Par défaut: rotation simple des exercices
    else {
      const exerciseChangeInterval = 30 // Change d'exercice toutes les 30s
      const newExerciseIndex = Math.floor(workTime / exerciseChangeInterval) % (quest.exercises?.length || 1)
      setExerciseIndex(newExerciseIndex)
    }

  }, [workTime, isRunning, isStrengthWorkout, quest])

  const nextExercise = () => {
    if (quest && exerciseIndex < quest.exercises.length - 1) {
      setExerciseIndex(prev => prev + 1)
    }
  }

  const previousExercise = () => {
    if (exerciseIndex > 0) {
      setExerciseIndex(prev => prev - 1)
    }
  }

  const addRound = () => {
    console.log('➕ addRound appelée - Round ajouté!')
    setCurrentRound(prev => prev + 1)
    setTotalRounds(prev => prev + 1)
    
    // Optionnel : ajouter le temps du round actuel
    if (roundTimes) {
      setRoundTimes(prev => [...prev, { round: currentRound, time: workTime || 0 }])
    }
  }

  return {
    // États HIIT
    workTime,
    exerciseIndex,
    isWorkPhase,
    currentRound,
    totalRounds,
    roundTimes,
    
    // Actions HIIT
    addRound,
    
    // ... autres propriétés
  }
}