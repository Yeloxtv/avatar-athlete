import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, Quest, QuestExercise, WorkoutSession } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RewardResult } from '@/types/rpg'
import { useStrengthWorkout } from '@/hooks/useStrengthWorkout'
import { StrengthPerformanceInput } from '@/components/workout/StrengthPerformanceInput'
import WorkoutTimer from '@/components/workout/shared/WorkoutTimer'

interface StrengthWorkoutInterfaceProps {
  quest: Quest & { exercises: QuestExercise[] }
  session: WorkoutSession | null
  time: number
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onFinishWorkout: () => void  // ← AJOUTER
}

export default function StrengthWorkoutInterface({
  quest,
  session,
  time,
  isRunning,
  onStart,
  onPause,
  onReset,
  onFinishWorkout  // ← AJOUTER
}: StrengthWorkoutInterfaceProps) {
  const navigate = useNavigate()
  
  // Hook pour musculation
  const strengthWorkout = useStrengthWorkout({
    exercises: quest?.exercises || [],
    sessionId: session?.id || '',
    restTimeSeconds: 60
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <WorkoutTimer
        time={time}
        isRunning={isRunning}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        isStrengthWorkout={true}
        onFinishWorkout={onFinishWorkout}  // ← Passé depuis Training.tsx
      />

      {/* Progression globale */}
      <Card className="border-accent/30">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm text-muted-foreground">
              {strengthWorkout.state.currentExerciseIndex + 1}/{quest.exercises.length} exercices
            </span>
          </div>
          <Progress value={strengthWorkout.progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Exercice en cours */}
      {strengthWorkout.currentExercise && !strengthWorkout.isWorkoutComplete && (
        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{strengthWorkout.currentExercise.name}</span>
              <Badge variant="outline" className="bg-green-50">
                Série {strengthWorkout.state.currentSet}/{strengthWorkout.totalSets}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Infos de l'exercice */}
            <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {strengthWorkout.currentExercise.target_reps}
                </div>
                <div className="text-xs text-muted-foreground">Répétitions cible</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {strengthWorkout.totalSets}
                </div>
                <div className="text-xs text-muted-foreground">Séries totales</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {strengthWorkout.currentExercise.target_weight ? 
                    `${strengthWorkout.currentExercise.target_weight}kg` : 
                    'Libre'
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {strengthWorkout.currentExercise.target_weight ? 'Charge cible' : 'Poids libre'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {(() => {
                    const prevPerf = strengthWorkout.getCurrentExercisePreviousPerformance()
                    if (!prevPerf) return 'Aucune donnée'
                    return `${prevPerf.reps_completed} @ ${prevPerf.weight_used || 'PDC'}kg`
                  })()}
                </div>
                <div className="text-xs text-muted-foreground">Meilleur précédent</div>
              </div>
            </div>

            {/* Timer de repos */}
            {strengthWorkout.state.isResting ? (
              <Card className="border-blue-200/50 bg-muted/40">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                    {strengthWorkout.state.restTimer}s
                  </div>
                  <div className="text-sm text-blue-600/80 mb-4">Temps de repos</div>
                  <Progress 
                    value={strengthWorkout.exerciseRestTime > 0 ? (strengthWorkout.state.restTimer / strengthWorkout.exerciseRestTime) * 100 : 0} 
                    className="mb-4 bg-muted/60"
                  />
                  <Button 
                    onClick={strengthWorkout.skipRest} 
                    variant="outline"
                    className="border-blue-300/50 hover:bg-blue-50/50"
                  >
                    Passer le repos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Saisie simplifiée des performances
              <StrengthPerformanceInput 
                exercise={strengthWorkout.currentExercise}
                onComplete={strengthWorkout.completeSet}
                disabled={!strengthWorkout.canCompleteSet}
              />
            )}

            {/* Historique des séries */}
            {strengthWorkout.currentExerciseLogs.length > 0 && (
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle className="text-sm">Séries précédentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {strengthWorkout.currentExerciseLogs.map((log, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>Série {log.set_number}</span>
                      <span className="font-medium">
                        {log.reps_completed} reps @ {log.weight_used || 'PDC'}kg
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Liste de tous les exercices avec progression */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span>
            Exercices de la séance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quest.exercises.map((exercise, index) => {
            // Calculer le statut de l'exercice
            const isCurrentExercise = index === strengthWorkout.state.currentExerciseIndex
            const exerciseLogs = strengthWorkout.state.exerciseLogs.filter(log => log.exercise_id === exercise.id)
            const targetSets = exercise.sets_count || 3
            const completedSets = exerciseLogs.length
            const isCompleted = completedSets >= targetSets
            const isPrevious = index < strengthWorkout.state.currentExerciseIndex
            
            // Définir les styles selon le statut
            let cardClasses = "p-4 rounded-lg border transition-all duration-300"
            let statusIcon = ""
            let statusText = ""
            
            if (isCompleted || isPrevious) {
              cardClasses += " border-green-400/60 bg-muted/70 shadow-md ring-1 ring-green-400/30"
              statusIcon = "✅"
              statusText = `${completedSets}/${targetSets} séries - Terminé`
            } else if (isCurrentExercise) {
              cardClasses += " border-yellow-400 bg-muted/40 shadow-lg ring-2 ring-yellow-300/50"
              statusIcon = "🔥"
              statusText = `${completedSets}/${targetSets} séries - En cours`
            } else {
              cardClasses += " border-muted bg-muted/20"
              statusIcon = "⏳"
              statusText = `0/${targetSets} séries - À venir`
            }

            return (
              <div key={exercise.id} className={cardClasses}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{statusIcon}</span>
                      <h4 className={`font-medium ${isCurrentExercise ? 'text-yellow-600' : isCompleted ? 'text-green-300' : 'text-muted-foreground'}`}>
                        {exercise.name}
                      </h4>
                    </div>
                    
                    {/* Infos de l'exercice */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Reps: </span>
                        <span className="font-medium">{exercise.target_reps}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Poids: </span>
                        <span className="font-medium">
                          {exercise.target_weight ? `${exercise.target_weight}kg` : 'Libre'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Repos: </span>
                        <span className="font-medium">{exercise.rest_seconds || 60}s</span>
                      </div>
                    </div>
                    
                    {/* Progression des séries */}
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">Progression</span>
                        <span className="text-xs font-medium">{statusText}</span>
                      </div>
                      <Progress 
                        value={(completedSets / targetSets) * 100} 
                        className={`h-2 ${isCompleted ? '[&>div]:bg-green-400' : isCurrentExercise ? '[&>div]:bg-yellow-400' : ''}`}
                      />
                    </div>

                    {/* Détail des séries réalisées */}
                    {exerciseLogs.length > 0 && (
                      <div className="mt-3 p-3 bg-muted/60 rounded border border-muted/40">
                        <div className="text-xs text-muted-foreground mb-2">Séries réalisées :</div>
                        <div className="flex flex-wrap gap-2">
                          {exerciseLogs.map((log, logIndex) => (
                            <span 
                              key={logIndex}
                              className="text-xs px-2 py-1 rounded-md font-medium bg-purple-600 text-white border border-purple-700"
                            >
                              {log.reps_completed} @ {log.weight_used || 'PDC'}kg
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Statistiques globales */}
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {strengthWorkout.state.completedSets}
                </div>
                <div className="text-muted-foreground">Séries totales</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {quest.exercises.reduce((total, ex) => total + (ex.sets_count || 3), 0)}
                </div>
                <div className="text-muted-foreground">Séries prévues</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fin d'entraînement */}
      {strengthWorkout.isWorkoutComplete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Entraînement terminé !</h2>
            <Button 
              onClick={() => {
                console.log('🔥 Bouton "Valider la séance" cliqué dans StrengthWorkoutInterface')
                onFinishWorkout()
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Valider la séance
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}