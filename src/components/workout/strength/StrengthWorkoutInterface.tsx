import { useState, useEffect, useRef } from 'react'
import { triggerHaptic } from '@/platform/haptics'
import { playSuccessSound } from '@/platform/sound'
import { supabase } from '@/integrations/supabase/client'
import { Quest, QuestExercise, WorkoutSession } from '@/types/workout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useStrengthWorkout } from '@/hooks/useStrengthWorkout'
import { StrengthPerformanceInput } from '@/components/workout/StrengthPerformanceInput'
import { Clock, StopCircle, Zap, Link2, Unlink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SeriesDots } from './SeriesDots'
import { RestPhase } from './RestPhase'
import { SessionDrawer } from './SessionDrawer'
import { SubstituteDrawer } from './SubstituteDrawer'

type StrengthWorkoutReturn = ReturnType<typeof useStrengthWorkout>

interface StrengthWorkoutInterfaceProps {
  quest: Quest & { exercises: QuestExercise[] }
  session: WorkoutSession | null
  time: number
  isRunning: boolean
  strengthWorkout: StrengthWorkoutReturn
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onFinishWorkout: () => void
  onCancelWorkout: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function playMicroRewardFeedback() {
  triggerHaptic(35)
  playSuccessSound()
}

function Chip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      'flex flex-col items-center px-3 py-1.5 rounded-lg border text-center min-w-[64px]',
      accent
        ? 'bg-accent/10 border-accent/40 text-accent'
        : 'bg-muted/20 border-muted/40 text-foreground'
    )}>
      <span className="text-base font-bold leading-tight">{value}</span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{label}</span>
    </div>
  )
}

export default function StrengthWorkoutInterface({
  quest,
  session,
  time,
  isRunning,
  strengthWorkout,
  onStart,
  onPause,
  onReset,
  onFinishWorkout,
  onCancelWorkout
}: StrengthWorkoutInterfaceProps) {
  const [showSummary, setShowSummary] = useState(false)
  const [showStopConfirm, setShowStopConfirm] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [showPRFlash, setShowPRFlash] = useState(false)
  const [liveXp, setLiveXp] = useState(0)
  const [lastSetXp, setLastSetXp] = useState<number | null>(null)

  const prevCompletedSets = useRef(strengthWorkout.state.completedSets)
  useEffect(() => {
    const prev = prevCompletedSets.current
    const curr = strengthWorkout.state.completedSets
    if (curr > prev) {
      playMicroRewardFeedback()
      const xp = 18
      setLiveXp(v => v + xp)
      setLastSetXp(xp)
      window.setTimeout(() => setLastSetXp(null), 900)
    }
    prevCompletedSets.current = curr
  }, [strengthWorkout.state.completedSets])

  useEffect(() => {
    if (strengthWorkout.lastPR) {
      setShowPRFlash(true)
      const t = setTimeout(() => {
        setShowPRFlash(false)
        strengthWorkout.clearPR()
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [strengthWorkout.lastPR])

  const finishWorkout = () => {
    setShowSummary(true)
  }

  const stopAndSave = async () => {
    if (!session) return
    setIsStopping(true)
    try {
      await supabase
        .from('workout_sessions')
        .update({
          is_completed: true,
          ended_at: new Date().toISOString(),
          total_time_seconds: time,
          rounds_completed: strengthWorkout.state.completedSets,
        })
        .eq('id', session.id)
    } catch {
      // non bloquant
    } finally {
      setIsStopping(false)
      setShowStopConfirm(false)
    }
    onFinishWorkout()
  }

  const {
    state, currentExercise, exercises, isWorkoutComplete, totalSets, exerciseRestTime,
    currentExerciseIndex, currentSet, currentBlock, currentBlockExercises, totalSetsInWorkout,
    positionInBlock, canGroupWithNext, canUngroupCurrent, nextBlockName,
  } = strengthWorkout
  const sessionReady = !!session?.id

  const isSuperset = (currentBlock?.exerciseIndices.length ?? 1) > 1
  const roundWord = isSuperset ? 'Tour' : 'Série'

  const exerciseNumber = currentExerciseIndex + 1
  const exerciseTotal = exercises.length
  const liveXpTarget = Math.max(totalSetsInWorkout * 18, liveXp || 1)
  const liveXpProgress = Math.min(100, Math.round((liveXp / liveXpTarget) * 100))

  const nextLabel = (() => {
    if (currentExercise) {
      return `${roundWord} ${currentSet}/${totalSets} — ${currentExercise.name ?? ''}`
    }
    const nextEx = exercises[currentExerciseIndex + 1]
    return nextEx ? nextEx.name : 'Dernière série'
  })()

  const previousPerf = strengthWorkout.getCurrentExercisePreviousPerformance()

  return (
    <div className="flex flex-col min-h-0 bg-background">

      {showPRFlash && strengthWorkout.lastPR && (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 pointer-events-none px-4">
          <div className="bg-yellow-400 text-yellow-900 font-bold text-base px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
            <span>NOUVEAU RECORD !</span>
            <span>
              {strengthWorkout.lastPR.weight > 0 ? `${strengthWorkout.lastPR.weight}kg × ` : ''}
              {strengthWorkout.lastPR.reps} reps
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-muted/30">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-sm font-mono tabular-nums">{formatTime(time)}</span>
        </div>
        {!isWorkoutComplete && (
          <span className="text-xs text-muted-foreground font-medium">
            Exercice {exerciseNumber}/{exerciseTotal}
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 gap-1 text-xs font-medium"
          onClick={() => setShowStopConfirm(true)}
        >
          <StopCircle className="w-3.5 h-3.5" />
          Arrêter
        </Button>
      </div>

      {/* Corps */}
      <div className="flex-1 overflow-y-auto">

        {state.isResting && currentExercise && !isWorkoutComplete && (
          <RestPhase
            restTimer={state.restTimer}
            exerciseRestTime={exerciseRestTime}
            nextLabel={nextLabel}
            onSkip={strengthWorkout.skipRest}
            onAdjust={strengthWorkout.adjustRest}
          />
        )}

        {!state.isResting && currentExercise && !isWorkoutComplete && (
          <div className="px-4 py-5 space-y-5">

            {isSuperset && currentBlock && (
              <div className="rounded-xl border-2 border-accent/40 bg-accent/5 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wide">
                    <Link2 className="w-3.5 h-3.5" /> Superset · Tour {currentSet}/{totalSets}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {positionInBlock + 1}/{currentBlockExercises.length}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {currentBlockExercises.map((ex, i) => (
                    <div
                      key={ex.id}
                      className={cn(
                        'flex items-center gap-2 text-sm px-2 py-1 rounded-lg',
                        i === positionInBlock ? 'bg-accent/15 text-accent font-semibold' : 'text-muted-foreground'
                      )}
                    >
                      <span className="w-5 text-center font-bold">{String.fromCharCode(65 + i)}</span>
                      <span className="truncate">{ex.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight leading-tight">
                {currentExercise.name}
              </h2>
              <div className="flex justify-center">
                <SubstituteDrawer
                  currentExerciseName={currentExercise.name}
                  muscleGroup={(currentExercise as any).muscle_group ?? null}
                  onSubstitute={strengthWorkout.substituteExercise}
                />
              </div>
            </div>

            {/* Superset à la volée */}
            {(canGroupWithNext || canUngroupCurrent) && (
              <div className="flex justify-center flex-wrap gap-2">
                {canGroupWithNext && (
                  <button
                    type="button"
                    onClick={strengthWorkout.groupWithNext}
                    className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors border border-accent/30 rounded-lg px-3 py-1.5"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Superset avec {nextBlockName ?? 'le suivant'}
                  </button>
                )}
                {canUngroupCurrent && (
                  <button
                    type="button"
                    onClick={strengthWorkout.ungroupCurrent}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-muted/40 rounded-lg px-3 py-1.5"
                  >
                    <Unlink className="w-3.5 h-3.5" /> Dégrouper
                  </button>
                )}
              </div>
            )}

            {(currentExercise as any).gif_url && (
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-xl overflow-hidden bg-muted/20 border border-muted/30">
                  <img
                    src={(currentExercise as any).gif_url}
                    alt={currentExercise.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Chip label="Reps" value={String((currentExercise as any).target_reps ?? '—')} />
              <Chip label={roundWord} value={`${currentSet}/${totalSets}`} accent />
              <Chip
                label="Charge"
                value={(currentExercise as any).target_weight
                  ? `${(currentExercise as any).target_weight}kg`
                  : 'Libre'
                }
              />
              <Chip label="Repos" value={`${exerciseRestTime}s`} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {state.completedSets}/{totalSetsInWorkout} séries
                </span>
                <span className={lastSetXp !== null ? 'text-accent font-bold transition-opacity' : 'opacity-0'}>
                  +{lastSetXp} XP
                </span>
              </div>
              <Progress value={liveXpProgress} className="h-1" />
            </div>

            <SeriesDots
              total={totalSets}
              current={currentSet}
              completedLogs={strengthWorkout.currentExerciseLogs.length}
            />

            <div className="border-t border-muted/20" />

            {!sessionReady ? (
              <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground text-sm">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Préparation de la séance...
              </div>
            ) : (
              <StrengthPerformanceInput
                exercise={currentExercise as any}
                previousPerf={previousPerf}
                onComplete={strengthWorkout.completeSet}
                disabled={!strengthWorkout.canCompleteSet}
              />
            )}

            <SessionDrawer
              exercises={exercises}
              blocks={strengthWorkout.blocks}
              currentBlockIndex={state.currentBlockIndex}
              currentExerciseIndex={currentExerciseIndex}
              exerciseLogs={state.exerciseLogs}
              completedSets={state.completedSets}
              onSwitchTo={strengthWorkout.switchToExercise}
              onReorder={strengthWorkout.reorderExercises}
            />
          </div>
        )}

        {isWorkoutComplete && (
          <div className="flex flex-col items-center justify-center px-6 py-16 gap-6 text-center">
            <div className="text-5xl">🏆</div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Entraînement terminé !</h2>
              <p className="text-muted-foreground text-sm">
                {state.completedSets} séries réalisées en {formatTime(time)}
              </p>
            </div>
            <Button
              onClick={finishWorkout}
              className="h-14 text-lg font-bold bg-green-600 hover:bg-green-700 w-full max-w-xs"
            >
              Terminer la séance
            </Button>
          </div>
        )}
      </div>

      {/* Barre progression */}
      {!isWorkoutComplete && (
        <div className="px-4 pb-4 pt-2 border-t border-muted/20">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-muted-foreground">Progression</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {state.completedSets} / {totalSetsInWorkout} séries
            </span>
          </div>
          <Progress value={strengthWorkout.progressPercentage} className="h-1.5" />
        </div>
      )}

      {/* Dialog résumé */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-md mx-4 rpg-card">
          <DialogHeader>
            <DialogTitle className="text-center">Séance terminée !</DialogTitle>
            <DialogDescription className="text-center">
              {state.completedSets} séries en {formatTime(time)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            <Button onClick={onFinishWorkout} className="w-full bg-accent hover:bg-accent/90">
              Valider la séance
            </Button>
            <Button onClick={() => setShowSummary(false)} variant="outline" className="w-full">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog arrêt */}
      <Dialog open={showStopConfirm} onOpenChange={setShowStopConfirm}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Arrêter la séance ?</DialogTitle>
            <DialogDescription>
              {state.completedSets > 0
                ? `Tes ${state.completedSets} série${state.completedSets > 1 ? 's' : ''} effectuée${state.completedSets > 1 ? 's' : ''} seront sauvegardées.`
                : "La séance sera enregistrée même si elle n'est pas terminée."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={stopAndSave} disabled={isStopping} variant="destructive" className="w-full">
              {isStopping ? 'Sauvegarde...' : 'Arrêter et sauvegarder'}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowStopConfirm(false)} disabled={isStopping}>
              Continuer la séance
            </Button>
            <Button
              variant="ghost"
              className="w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 text-sm"
              onClick={onCancelWorkout}
              disabled={isStopping}
            >
              Annuler et supprimer la séance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
