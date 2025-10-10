import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface StrengthPerformanceInputProps {
  exercise: {
    id: string
    target_reps?: number
    target_weight?: number
  }
  onComplete: (data: { reps: number; weight?: number }) => void
  disabled: boolean
}

export const StrengthPerformanceInput = React.memo(({ 
  exercise, 
  onComplete, 
  disabled 
}: StrengthPerformanceInputProps) => {
  const [reps, setReps] = useState(exercise.target_reps || 0)
  const [weight, setWeight] = useState(exercise.target_weight || 0)

  // Reset seulement si l'exercice change
  useEffect(() => {
    setReps(exercise.target_reps || 0)
    setWeight(exercise.target_weight || 0)
  }, [exercise.id]) // ← Clé importante : seulement l'ID

  const handleSubmit = useCallback(() => {
    onComplete({ 
      reps, 
      weight: weight > 0 ? weight : undefined
    })
  }, [reps, weight, onComplete])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Répétitions</Label>
          <Input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value) || 0)}
            className="text-center text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label>Poids (kg) - Optionnel</Label>
          <Input
            type="number"
            step="0.5"
            value={weight || ''}
            onChange={(e) => setWeight(Number(e.target.value) || 0)}
            className="text-center text-lg"
            placeholder="Laisser vide si poids du corps"
          />
        </div>
      </div>
      <Button 
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Valider la série
      </Button>
    </div>
  )
})

StrengthPerformanceInput.displayName = 'StrengthPerformanceInput'