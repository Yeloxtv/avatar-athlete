import { useState, Dispatch, SetStateAction } from 'react'
import { ExerciseDraft, SessionDraft } from '@/types/program'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function emptyExercise(): ExerciseDraft {
  return { name: '', sets_count: 3, target_reps: 8, target_weight: null, rest_seconds: 90, superset_group: null }
}

export function emptySession(dayIndex: number): SessionDraft {
  return { name: DAYS[dayIndex], exercises: [emptyExercise()] }
}

export type WizardStep = 1 | 2 | 3

export interface ProgramBuilderState {
  step: WizardStep
  programName: string
  activeDays: Set<number>
  sessions: Record<number, SessionDraft>
}

export interface ProgramBuilderActions {
  setStep: (step: WizardStep) => void
  setProgramName: (name: string) => void
  toggleDay: (day: number) => void
  setSessionName: (day: number, name: string) => void
  addExercise: (day: number) => void
  updateExercise: (day: number, idx: number, field: keyof ExerciseDraft, value: string | number | null) => void
  removeExercise: (day: number, idx: number) => void
  setActiveDays: Dispatch<SetStateAction<Set<number>>>
  setSessions: Dispatch<SetStateAction<Record<number, SessionDraft>>>
  goToStep2: () => void
  goToStep3: () => void
  canGoNext: boolean
}

export function useProgramBuilder(): ProgramBuilderState & ProgramBuilderActions {
  const [step, setStep] = useState<WizardStep>(1)
  const [programName, setProgramName] = useState('')
  const [activeDays, setActiveDays] = useState<Set<number>>(new Set())
  const [sessions, setSessions] = useState<Record<number, SessionDraft>>({})

  const toggleDay = (day: number) => {
    setActiveDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) {
        next.delete(day)
        setSessions(s => {
          const n = { ...s }
          delete n[day]
          return n
        })
      } else {
        next.add(day)
        setSessions(s => ({
          ...s,
          [day]: s[day] ?? emptySession(day),
        }))
      }
      return next
    })
  }

  const setSessionName = (day: number, name: string) => {
    setSessions(prev => ({
      ...prev,
      [day]: { ...prev[day], name },
    }))
  }

  const addExercise = (day: number) => {
    setSessions(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: [...prev[day].exercises, emptyExercise()],
      },
    }))
  }

  const updateExercise = (
    day: number,
    idx: number,
    field: keyof ExerciseDraft,
    value: string | number | null
  ) => {
    setSessions(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: prev[day].exercises.map((ex, i) =>
          i === idx ? { ...ex, [field]: value } : ex
        ),
      },
    }))
  }

  const removeExercise = (day: number, idx: number) => {
    setSessions(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: prev[day].exercises.filter((_, i) => i !== idx),
      },
    }))
  }

  const goToStep2 = () => setStep(2)

  const goToStep3 = () => {
    setSessions(prev => {
      const next = { ...prev }
      activeDays.forEach(day => {
        if (!next[day]) next[day] = emptySession(day)
      })
      return next
    })
    setStep(3)
  }

  const canGoNext =
    step === 1 ? programName.trim().length > 0 :
    step === 2 ? activeDays.size > 0 :
    false

  return {
    step,
    programName,
    activeDays,
    sessions,
    setStep,
    setProgramName,
    toggleDay,
    setSessionName,
    addExercise,
    updateExercise,
    removeExercise,
    setActiveDays,
    setSessions,
    goToStep2,
    goToStep3,
    canGoNext,
  }
}
