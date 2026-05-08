import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, Plus, Zap } from 'lucide-react'

interface WorkoutTimerProps {
  // Timer principal
  time: number
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onFinishWorkout: () => void
  onAddRound: () => void

  // Pour musculation (simple)
  isStrengthWorkout?: boolean

  // Pour HIIT (complexe)
  quest?: {
    workout_type: string
    total_minutes?: number
    work_seconds?: number
    rest_seconds?: number
    exercises?: Array<{ name: string }>
  }
  workTime?: number
  isWorkPhase?: boolean
  exerciseName?: string
  currentRound?: number
  totalRounds?: number
  exerciseIndex?: number
  liveXp?: number
}

export default function WorkoutTimer({
  time,
  isRunning,
  onStart,
  onPause,
  onReset,
  onFinishWorkout,
  onAddRound,
  isStrengthWorkout = false,
  quest,
  workTime,
  isWorkPhase,
  exerciseName,
  currentRound,
  totalRounds,
  exerciseIndex = 0,
  liveXp = 0,
}: WorkoutTimerProps) {
  const [xpPopup, setXpPopup] = useState<{ id: number; value: number } | null>(null)
  const prevRoundRef = useRef(currentRound)
  const prevLiveXpRef = useRef(liveXp)

  // Déclencher popup XP quand liveXp monte (HIIT: round validé ou cycle complété)
  useEffect(() => {
    if (isStrengthWorkout) return
    const gained = liveXp - prevLiveXpRef.current
    if (gained > 0) {
      setXpPopup({ id: Date.now(), value: gained })
      const t = setTimeout(() => setXpPopup(null), 900)
      prevLiveXpRef.current = liveXp
      return () => clearTimeout(t)
    }
    prevLiveXpRef.current = liveXp
  }, [liveXp, isStrengthWorkout])

  // Déclencher popup XP aussi sur ajout de round AMRAP
  useEffect(() => {
    if (isStrengthWorkout) return
    if (currentRound !== undefined && prevRoundRef.current !== undefined && currentRound > prevRoundRef.current) {
      setXpPopup({ id: Date.now(), value: 15 })
      const t = setTimeout(() => setXpPopup(null), 900)
      prevRoundRef.current = currentRound
      return () => clearTimeout(t)
    }
    prevRoundRef.current = currentRound
  }, [currentRound, isStrengthWorkout])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // LOGIQUE SIMPLE : juste le prochain exercice dans la liste
  const getNextExercise = () => {
    if (!quest?.exercises || exerciseIndex === undefined) return null
    
    const nextIndex = exerciseIndex + 1
    
    // Si il y a un exercice suivant dans la liste
    if (nextIndex < quest.exercises.length) {
      return quest.exercises[nextIndex].name
    }
    
    // Si on est au dernier exercice :
    // - AMRAP : recommence toujours
    // - Autres : recommence sauf si l'entraînement doit s'arrêter
    if (quest.workout_type === 'amrap') {
      return quest.exercises[0]?.name || null
    }
    
    // Pour les autres types, on recommence le circuit
    // (la logique d'arrêt sera gérée ailleurs)
    return quest.exercises[0]?.name || null
  }

  const nextExercise = getNextExercise()

  return (
    <Card className="border-accent/30 shadow-lg">
      <CardHeader className="text-center space-y-4">

        {/* Timer principal + XP popup HIIT */}
        <div className="relative inline-block mx-auto">
          <CardTitle className="text-4xl font-mono">{formatTime(time)}</CardTitle>
          {xpPopup && (
            <div
              key={xpPopup.id}
              className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 text-accent font-black text-lg pointer-events-none"
              style={{ animation: 'xpFloat 0.9s ease-out forwards' }}
            >
              <Zap className="w-4 h-4" />+{xpPopup.value} XP
            </div>
          )}
        </div>

        {/* Compteur XP live HIIT */}
        {!isStrengthWorkout && liveXp > 0 && (
          <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-accent/80">
            <Zap className="w-3.5 h-3.5" />
            <span>{liveXp} XP cette séance</span>
          </div>
        )}
        
        {/* EXERCICE ACTUEL + SUIVANT - Style RPG harmonisé */}
        {!isStrengthWorkout && exerciseName && (
          <Card className={`rpg-card border transition-all duration-300 ${
            (quest?.workout_type === 'tabata' || quest?.workout_type === 'circuit') && isWorkPhase !== undefined
              ? isWorkPhase 
                ? 'border-red-300 bg-red-50/30' 
                : 'border-blue-300 bg-blue-50/30'
              : 'border-accent/30'
          }`}>
            <CardContent className="p-4 space-y-4">
              
              {/* Maintenant */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isWorkPhase === true ? 'bg-red-500' : 
                    isWorkPhase === false ? 'bg-blue-500' : 'bg-accent'
                  }`}></div>
                  Maintenant
                </div>
                
                {/* Phase de repos */}
                {isWorkPhase === false ? (
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 leading-tight flex items-center justify-center gap-2">
                    <span>😌</span> {/* ← AJOUTER l'emoji manquant */}
                    <span>REPOS</span>
                  </div>
                ) : (
                  <div className={`text-2xl sm:text-3xl font-bold leading-tight ${
                    isWorkPhase === true ? 'text-red-600' : 'text-accent'
                  }`}>
                    {isWorkPhase === true && <span className="mr-2">🔥</span>} {/* ← CORRIGER la condition */}
                    {exerciseName}
                  </div>
                )}
              </div>
              
              {/* Ensuite */}
              {nextExercise && (
                <div className="pt-3 border-t border-muted/30">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
                    {isWorkPhase === false ? 'Prochain exercice' : 'Ensuite'}
                  </div>
                  <div className={`text-lg font-medium ${
                    isWorkPhase === false ? 'text-yellow-500' : 'text-muted-foreground'
                  }`}>
                    {nextExercise}
                  </div>
                </div>
              )}
              
              {/* Round pour AMRAP */}
              {quest?.workout_type === 'amrap' && currentRound && (
                <div className="text-center pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-sm font-medium text-accent">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    Round {currentRound}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Progress bars */}
        {!isStrengthWorkout && quest?.workout_type === 'tabata' && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {isWorkPhase ? 'Temps de travail' : 'Temps de repos'}
            </div>
            <Progress
              value={
                isWorkPhase && quest.work_seconds
                  ? ((workTime || 0) % ((quest.work_seconds) + (quest.rest_seconds || 0))) / quest.work_seconds * 100
                  : !isWorkPhase && quest.rest_seconds
                  ? (((workTime || 0) % ((quest.work_seconds || 0) + quest.rest_seconds)) - (quest.work_seconds || 0)) / quest.rest_seconds * 100
                  : 0
              }
              className="h-3"
            />
          </div>
        )}
        
        {!isStrengthWorkout && quest?.workout_type === 'amrap' && (quest.total_minutes ?? 0) > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Temps restant: <span className="font-bold text-accent">{formatTime(Math.max(quest.total_minutes! * 60 - time, 0))}</span>
            </div>
            <Progress value={(time / (quest.total_minutes! * 60)) * 100} className="h-3" />
          </div>
        )}

        {isStrengthWorkout && (
          <div className="text-sm text-muted-foreground">
            Temps total de la séance
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center">
          
          {/* Play/Pause */}
          <Button 
            onClick={isRunning ? onPause : onStart}
            className="bg-green-600 hover:bg-green-700 h-12 px-4 sm:px-6"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Démarrer</span>
              </>
            )}
          </Button>

          {/* Reset */}
          <Button 
            onClick={onReset}
            className="bg-yellow-500 hover:bg-yellow-600 text-black h-12 px-3 sm:px-4"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline text-sm">Reset</span>
          </Button>

          {/* Add Round - AMRAP uniquement */}
          {!isStrengthWorkout && quest?.workout_type === 'amrap' && (
            <Button 
              onClick={onAddRound}
              className="bg-blue-500 hover:bg-blue-600 h-12 px-3 sm:px-4"
              size="sm"
              disabled={!isRunning}
            >
              <Plus className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline text-sm">Round</span>
            </Button>
          )}

          {/* Terminer */}
          <Button 
            onClick={onFinishWorkout}
            className="bg-red-600 hover:bg-red-700 h-12 px-3 sm:px-4 ml-auto sm:ml-2"
            size="sm"
          >
            <span className="text-sm font-medium">Terminer</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}