import { createContext, useContext, useState, ReactNode } from 'react'

interface LiveSession {
  sessionId: string
  questId: string
  questTitle: string
  currentExerciseName: string
  currentExerciseIndex: number
  totalExercises: number
  progressPercentage: number
}

interface WorkoutSessionContextValue {
  liveSession: LiveSession | null
  startLiveSession: (session: LiveSession) => void
  updateLiveSession: (patch: Partial<LiveSession>) => void
  clearLiveSession: () => void
}

const WorkoutSessionContext = createContext<WorkoutSessionContextValue | null>(null)

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null)

  const startLiveSession = (session: LiveSession) => setLiveSession(session)

  const updateLiveSession = (patch: Partial<LiveSession>) =>
    setLiveSession(prev => prev ? { ...prev, ...patch } : prev)

  const clearLiveSession = () => setLiveSession(null)

  return (
    <WorkoutSessionContext.Provider value={{ liveSession, startLiveSession, updateLiveSession, clearLiveSession }}>
      {children}
    </WorkoutSessionContext.Provider>
  )
}

export function useWorkoutSessionContext() {
  const ctx = useContext(WorkoutSessionContext)
  if (!ctx) throw new Error('useWorkoutSessionContext must be used inside WorkoutSessionProvider')
  return ctx
}
