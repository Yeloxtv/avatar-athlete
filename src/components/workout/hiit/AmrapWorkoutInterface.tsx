import { useState } from 'react'
import { Quest, QuestExercise, WorkoutSession } from '@/types/workout'
import { Button } from '@/components/ui/button'
import { Play, Pause, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AmrapWorkoutInterfaceProps {
  quest: Quest & { exercises: QuestExercise[] }
  session: WorkoutSession | null
  time: number
  isRunning: boolean
  currentRound: number
  onStart: () => void
  onPause: () => void
  onAddRound: () => void
  onFinishWorkout: () => void
}

export default function AmrapWorkoutInterface({
  quest,
  time,
  isRunning,
  currentRound,
  onStart,
  onPause,
  onAddRound,
  onFinishWorkout,
}: AmrapWorkoutInterfaceProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const timeRemaining = quest.total_minutes
    ? Math.max(quest.total_minutes * 60 - time, 0)
    : null

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-6 gap-5">

      {/* CHRONO */}
      <div className="text-center space-y-1">
        <div className="text-7xl font-mono font-black tracking-tight">{formatTime(time)}</div>
        {timeRemaining !== null && (
          <div className="text-sm text-muted-foreground">
            Temps restant : <span className="font-bold text-accent">{formatTime(timeRemaining)}</span>
          </div>
        )}
        {quest.total_minutes && quest.total_minutes > 0 && (
          <div className="w-full bg-muted/30 rounded-full h-1.5 mt-2">
            <div
              className="bg-accent h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min((time / (quest.total_minutes * 60)) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* TOURS */}
      <div className="text-center">
        <div className="text-8xl font-black text-accent leading-none">{currentRound}</div>
        <div className="text-sm uppercase tracking-widest text-muted-foreground mt-1">
          {currentRound <= 1 ? 'tour' : 'tours'}
        </div>
      </div>

      {/* BOUTON + TOUR */}
      <button
        onClick={onAddRound}
        disabled={!isRunning}
        className="flex items-center justify-center gap-3 w-full rounded-2xl bg-accent text-accent-foreground h-20 text-2xl font-black disabled:opacity-40 active:scale-95 transition-transform select-none"
      >
        <Plus className="w-8 h-8" />
        1 TOUR
      </button>

      {/* EXERCICES */}
      <div className="rounded-xl border border-muted/30 bg-muted/5 divide-y divide-muted/20">
        {quest.exercises.map((exercise, i) => (
          <div key={exercise.id} className="flex items-center gap-3 px-4 py-3">
            <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
            <span className="text-sm font-medium">{exercise.name}</span>
            {exercise.target_reps ? (
              <span className="ml-auto text-xs text-muted-foreground shrink-0">{exercise.target_reps} reps</span>
            ) : null}
          </div>
        ))}
      </div>

      {/* CONTROLES */}
      <div className="flex gap-3">
        <Button
          onClick={isRunning ? onPause : onStart}
          variant="outline"
          className="flex-1 h-12 gap-2"
        >
          {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Démarrer</>}
        </Button>
        <Button
          onClick={() => setShowConfirm(true)}
          variant="destructive"
          className="flex-1 h-12"
        >
          Terminer
        </Button>
      </div>

      {/* DIALOG CONFIRMATION */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm mx-2">
          <DialogHeader>
            <DialogTitle className="text-center">Finir le finisher ?</DialogTitle>
            <DialogDescription className="text-center text-sm">
              {currentRound} tour{currentRound > 1 ? 's' : ''} · {formatTime(time)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            <Button onClick={() => { setShowConfirm(false); onFinishWorkout() }} className="w-full h-12">
              ✓ Valider et voir le récap
            </Button>
            <Button onClick={() => setShowConfirm(false)} variant="outline" className="w-full h-12">
              Continuer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
