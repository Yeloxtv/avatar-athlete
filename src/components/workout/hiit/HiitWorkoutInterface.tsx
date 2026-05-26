import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Quest, QuestExercise, WorkoutSession } from '@/types/workout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import WorkoutTimer from '@/components/workout/shared/WorkoutTimer'

interface SessionSummary {
  rounds: number
  totalTime: number
  questTitle?: string
}

interface RoundTime {
  round: number
  startTime: number
  endTime?: number
}

interface HiitWorkoutInterfaceProps {
  quest: Quest & { exercises: QuestExercise[] }
  session: WorkoutSession | null
  time: number
  isRunning: boolean
  workTime: number
  exerciseIndex: number
  isWorkPhase: boolean
  currentRound: number
  totalRounds: number
  roundTimes: RoundTime[]
  liveXp?: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onAddRound: () => void
  onFinishWorkout: () => void
}

export default function HiitWorkoutInterface({
  quest,
  session,
  time,
  isRunning,
  workTime,
  exerciseIndex,
  isWorkPhase,
  currentRound,
  totalRounds,
  roundTimes,
  liveXp = 0,
  onStart,
  onPause,
  onReset,
  onAddRound,
  onFinishWorkout
}: HiitWorkoutInterfaceProps) {
  const { user } = useAuth()
  const [showSummary, setShowSummary] = useState(false)
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const finishWorkout = () => {
    setSessionSummary({
      rounds: quest.workout_type === 'amrap' ? currentRound : 1,
      totalTime: time,
      questTitle: quest?.title,
    })
    setShowSummary(true)
  }

  const validateWorkout = async () => {
    if (!quest || !user || !session || isValidating) return
    setIsValidating(true)
    setShowSummary(false)

    try {
      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({
          is_completed: true,
          ended_at: new Date().toISOString(),
          total_time_seconds: time,
          rounds_completed: currentRound,
        })
        .eq('id', session.id)

      if (sessionError) throw sessionError

      const { error: questStatusError } = await supabase
        .from('user_quests')
        .upsert({
          user_id: user.id,
          quest_id: quest.id,
          status: 'completed',
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,quest_id' })

      if (questStatusError) throw questStatusError

      const { data: nextQuest } = await supabase
        .from('quests')
        .select('id')
        .eq('campaign_id', quest.campaign_id)
        .eq('order_index', quest.order_index + 1)
        .maybeSingle()

      if (nextQuest) {
        await supabase.from('user_quests').upsert(
          { user_id: user.id, quest_id: nextQuest.id, status: 'available' },
          { onConflict: 'user_id,quest_id' }
        )
      }

      onFinishWorkout()

    } catch (error) {
      console.error('Erreur validation HIIT:', error)
      toast({
        title: 'Erreur de validation',
        description: "Impossible de valider l'entraînement. Veuillez réessayer.",
        variant: 'destructive',
      })
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-6">
      <WorkoutTimer
        time={time}
        isRunning={isRunning}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        onFinishWorkout={finishWorkout}
        onAddRound={onAddRound}
        isStrengthWorkout={false}
        quest={quest}
        workTime={workTime}
        isWorkPhase={isWorkPhase}
        exerciseName={quest.exercises[exerciseIndex]?.name || ''}
        currentRound={currentRound}
        totalRounds={totalRounds}
        exerciseIndex={exerciseIndex}
        liveXp={liveXp}
      />

      <Card className="border-accent/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>Circuit ({quest.exercises.length} exercices)</span>
            </div>
            {quest.total_minutes && quest.total_minutes > 0 && (
              <div className="text-sm font-normal text-muted-foreground">
                {quest.total_minutes} min
              </div>
            )}
            {quest.workout_type === 'tabata' && quest.work_seconds && quest.rest_seconds && (
              <div className="text-sm font-normal text-muted-foreground">
                {quest.work_seconds}s / {quest.rest_seconds}s
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quest.exercises.map((exercise, index) => {
            const isCurrentExercise = index === exerciseIndex
            return (
              <div
                key={exercise.id}
                className={`p-2 rounded border transition-all ${
                  isCurrentExercise
                    ? 'border-accent bg-accent/5 shadow-sm'
                    : 'border-muted/40 bg-muted/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm">
                      {isCurrentExercise ? '🔥' : index < exerciseIndex ? '✅' : '⏳'}
                    </span>
                    <span className={`text-sm truncate ${
                      isCurrentExercise ? 'font-medium text-accent' : 'text-muted-foreground'
                    }`}>
                      {exercise.name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {index + 1}/{quest.exercises.length}
                  </div>
                </div>
              </div>
            )
          })}

          <div className="mt-3 p-2 bg-accent/5 rounded border border-accent/20">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm font-bold text-accent">{exerciseIndex + 1}</div>
                <div className="text-xs text-muted-foreground">Actuel</div>
              </div>
              <div>
                <div className="text-sm font-bold text-accent">{quest.exercises.length - exerciseIndex - 1}</div>
                <div className="text-xs text-muted-foreground">Restants</div>
              </div>
              <div>
                {quest.workout_type === 'amrap' ? (
                  <>
                    <div className="text-sm font-bold text-accent">{currentRound}</div>
                    <div className="text-xs text-muted-foreground">Rounds</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-accent">{formatTime(time)}</div>
                    <div className="text-xs text-muted-foreground">Écoulé</div>
                  </>
                )}
              </div>
            </div>
            {((quest.total_minutes && quest.total_minutes > 0) || quest.workout_type === 'tabata') && (
              <div className="mt-2 pt-2 border-t border-accent/20 text-xs text-center text-muted-foreground">
                {quest.workout_type === 'amrap' && quest.total_minutes && (
                  <span>Objectif: {quest.total_minutes} minutes</span>
                )}
                {quest.workout_type === 'tabata' && quest.work_seconds && quest.rest_seconds && (
                  <span>Format: {quest.work_seconds}s travail / {quest.rest_seconds}s repos</span>
                )}
                {quest.workout_type === 'circuit' && quest.total_minutes && (
                  <span>Durée estimée: {quest.total_minutes} minutes</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-sm mx-2">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">🎉 Terminé !</DialogTitle>
            <DialogDescription className="text-center text-sm">
              Séance HIIT complétée !
            </DialogDescription>
          </DialogHeader>
          {sessionSummary && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-accent/5 rounded">
                  <div className="text-lg font-bold text-accent">
                    {formatTime(sessionSummary.totalTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">Temps total</div>
                </div>
                <div className="p-2 bg-accent/5 rounded">
                  <div className="text-lg font-bold text-accent">
                    {quest.workout_type === 'amrap' ? sessionSummary.rounds : quest.exercises.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {quest.workout_type === 'amrap' ? 'Rounds' : 'Exercices'}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={validateWorkout}
                  className="w-full bg-accent hover:bg-accent/90 h-12"
                  disabled={isValidating}
                >
                  {isValidating ? '⏳ Sauvegarde...' : '🚀 Valider la séance'}
                </Button>
                <Button
                  onClick={() => setShowSummary(false)}
                  variant="outline"
                  className="w-full h-12"
                  disabled={isValidating}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
