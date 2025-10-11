import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, Plus } from 'lucide-react'

interface WorkoutTimerProps {
  // Timer principal
  time: number
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  
  // Pour musculation (simple)
  isStrengthWorkout?: boolean
  
  // Pour HIIT (complexe)
  quest?: {
    workout_type: string
    total_minutes?: number
    work_seconds?: number
    rest_seconds?: number
  }
  workTime?: number
  isWorkPhase?: boolean
  exerciseName?: string
  currentRound?: number
  onAddRound?: () => void
  onFinishWorkout?: () => void
  roundTimes?: Array<{
    roundNumber: number
    duration: number
    timestamp: number
  }>
}

export default function WorkoutTimer({
  time,
  isRunning,
  onStart,
  onPause,
  onReset,
  isStrengthWorkout = false,
  quest,
  workTime = 0,
  isWorkPhase = true,
  exerciseName = '',
  currentRound = 1,
  onAddRound = () => {},
  onFinishWorkout = () => {},
  roundTimes = []
}: WorkoutTimerProps) {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="border-accent/30 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-mono">{formatTime(time)}</CardTitle>
        
        {/* HIIT - Affichage spécialisé */}
        {!isStrengthWorkout && quest?.workout_type === 'tabata' && (
          <div className="space-y-2">
            <div className="text-lg font-semibold">{isWorkPhase ? '🔥 TRAVAIL' : '😌 REPOS'}</div>
            <div className="text-sm text-muted-foreground">Exercice: {exerciseName}</div>
            <Progress
              value={
                isWorkPhase
                  ? ((workTime % ((quest.work_seconds || 0) + (quest.rest_seconds || 0))) / (quest.work_seconds || 1)) * 100
                  : (((workTime % ((quest.work_seconds || 0) + (quest.rest_seconds || 0))) - (quest.work_seconds || 0)) / (quest.rest_seconds || 1)) * 100
              }
              className="h-2"
            />
          </div>
        )}
        
        {!isStrengthWorkout && quest?.workout_type === 'amrap' && (quest.total_minutes ?? 0) > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Temps restant: {formatTime(Math.max(quest.total_minutes! * 60 - time, 0))}
            </div>
            <Progress value={(time / (quest.total_minutes! * 60)) * 100} className="h-2" />
          </div>
        )}

        {/* Musculation - Affichage simple */}
        {isStrengthWorkout && (
          <div className="text-sm text-muted-foreground">
            Temps total de la séance
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-4">
          {!isRunning && time === 0 ? (
            <Button onClick={onStart} size="lg" className="bg-green-600 hover:bg-green-700">
              <Play className="w-5 h-5 mr-2" />
              Commencer
            </Button>
          ) : !isRunning ? (
            <Button onClick={onStart} size="lg" className="bg-green-600 hover:bg-green-700">
              <Play className="w-5 h-5 mr-2" />
              Reprendre
            </Button>
          ) : (
            <Button onClick={onPause} size="lg" variant="outline">
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}

          {/* Bouton spécifique selon le type */}
          {isStrengthWorkout ? (
            <Button onClick={onReset} size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          ) : (
            <Button onClick={onAddRound} size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold" disabled={!isRunning}>
              <Plus className="w-5 h-5 mr-2" />
              +1 Round
            </Button>
          )}

          {/* Bouton Terminer - Rouge pour tous */}
          <Button 
            onClick={onFinishWorkout}
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Terminer
          </Button>
        </div>

        {/* Affichage Round + temps pour HIIT */}
        {!isStrengthWorkout && (
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Round {currentRound} - Temps du round: {formatTime(workTime)}
            </div>
            
            {/* Historique des rounds */}
            {roundTimes && roundTimes.length > 0 && (
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="font-medium">Rounds précédents:</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {roundTimes.map((round, index) => (
                    <span key={index} className="px-2 py-1 bg-muted/40 rounded text-xs">
                      R{round.roundNumber}: {formatTime(round.duration)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}