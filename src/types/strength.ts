export interface ExerciseLog {
  id?: string
  session_id: string
  exercise_id: string
  set_number: number
  reps_completed: number
  weight_used?: number
  completed_at?: string
}

export interface StrengthWorkoutState {
  currentExerciseIndex: number
  currentSet: number
  exerciseLogs: ExerciseLog[]
  restTimer: number
  isResting: boolean
  completedSets: number
}

export interface SetInput {
  reps: number
  weight?: number
}