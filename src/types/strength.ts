export interface ExerciseLog {
  id?: string
  session_id: string
  exercise_id: string
  set_number: number
  reps_completed: number
  weight_used?: number
  completed_at?: string
}

// 🆕 Nouvelle interface pour la performance précédente
export interface PreviousPerformance {
  reps_completed: number
  weight_used?: number
  session_date: string
}

export interface StrengthWorkoutState {
  // Progression par blocs (un bloc = un exercice simple OU un superset de 2-5 exercices)
  currentBlockIndex: number
  currentRound: number      // tour en cours dans le bloc (1-based) = n° de série de chaque exo du bloc
  positionInBlock: number   // index de l'exercice courant dans le bloc (0-based)
  exerciseLogs: ExerciseLog[]
  restTimer: number
  isResting: boolean
  completedSets: number
  // 🆕 Ajouter les performances précédentes dans le state
  previousPerformances: Record<string, PreviousPerformance | null>
}

export interface SetInput {
  reps: number
  weight?: number
}

// 🆕 Interface pour les paramètres du hook
export interface UseStrengthWorkoutProps {
  exercises: Array<{
    id: string
    name: string
    target_reps?: number
    sets_count?: number
    target_weight?: number
    rest_seconds?: number
  }>
  sessionId: string
  restTimeSeconds?: number
}