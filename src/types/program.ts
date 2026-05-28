// ─── Program builder types ────────────────────────────────────────────────────

export interface ExerciseDraft {
  id?: string
  name: string
  sets_count: number
  target_reps: number
  target_weight: number | null
  rest_seconds: number
  global_exercise_id?: string | null
}

export interface FinisherExerciseDraft {
  name: string
  target_reps: number
  reps_unit: 'reps' | 'm' | 'cal'
  global_exercise_id?: string | null
}

export interface FinisherDraft {
  questId?: string
  format: 'amrap' | 'emom' | 'tabata'
  duration_minutes: number
  exercises: FinisherExerciseDraft[]
}

export interface SessionDraft {
  questId?: string
  name: string
  exercises: ExerciseDraft[]
  finisher?: FinisherDraft | null
}
