import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PreviousPerf {
  reps_completed: number
  weight_used: number | null
}

interface StrengthPerformanceInputProps {
  exercise: {
    id: string
    target_reps?: number
    target_weight?: number
  }
  previousPerf?: PreviousPerf | null
  onComplete: (data: { reps: number; weight?: number }) => void
  disabled: boolean
}

export const StrengthPerformanceInput = React.memo(({
  exercise,
  previousPerf,
  onComplete,
  disabled
}: StrengthPerformanceInputProps) => {
  // Pré-remplir avec la perf précédente si dispo, sinon les cibles
  const defaultWeight = previousPerf?.weight_used ?? exercise.target_weight ?? 0
  const defaultReps = previousPerf?.reps_completed ?? exercise.target_reps ?? 0

  const [reps, setReps] = useState(defaultReps)
  const [weight, setWeight] = useState(defaultWeight)

  useEffect(() => {
    setReps(previousPerf?.reps_completed ?? exercise.target_reps ?? 0)
    setWeight(previousPerf?.weight_used ?? exercise.target_weight ?? 0)
  }, [exercise.id])

  const handleSubmit = useCallback(() => {
    onComplete({
      reps,
      weight: weight > 0 ? weight : undefined
    })
  }, [reps, weight, onComplete])

  const adjustWeight = (delta: number) => setWeight(w => Math.max(0, Math.round((w + delta) * 2) / 2))
  const adjustReps = (delta: number) => setReps(r => Math.max(0, r + delta))

  return (
    <div className="space-y-3">
      {/* Référence précédente */}
      {previousPerf && (
        <div className="text-xs text-center text-muted-foreground bg-muted/30 rounded-lg py-1.5">
          Dernière fois : <span className="font-semibold text-foreground">
            {previousPerf.weight_used ? `${previousPerf.weight_used}kg × ` : ''}{previousPerf.reps_completed} reps
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Reps */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Répétitions</Label>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 text-lg" onClick={() => adjustReps(-1)}>−</Button>
            <Input
              type="number"
              value={reps}
              onChange={(e) => setReps(Number(e.target.value) || 0)}
              className="text-center text-xl font-bold h-10 px-1"
            />
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 text-lg" onClick={() => adjustReps(1)}>+</Button>
          </div>
        </div>

        {/* Poids */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Poids (kg)</Label>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 text-lg" onClick={() => adjustWeight(-2.5)}>−</Button>
            <Input
              type="number"
              step="0.5"
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              className="text-center text-xl font-bold h-10 px-1"
              placeholder="0"
            />
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 text-lg" onClick={() => adjustWeight(2.5)}>+</Button>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700"
      >
        Valider la série
      </Button>
    </div>
  )
})

StrengthPerformanceInput.displayName = 'StrengthPerformanceInput'