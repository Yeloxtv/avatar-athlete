import { useState, useEffect, useRef } from 'react'
import { triggerHaptic } from '@/platform/haptics'
import { playSuccessSound } from '@/platform/sound'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { supabase } from '@/integrations/supabase/client'
import { Quest, QuestExercise, WorkoutSession } from '@/types/workout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RewardResult } from '@/types/rpg'
import { useStrengthWorkout } from '@/hooks/useStrengthWorkout'
import { StrengthPerformanceInput } from '@/components/workout/StrengthPerformanceInput'

type StrengthWorkoutReturn = ReturnType<typeof useStrengthWorkout>
// useStrengthWorkout est importé uniquement pour typer ReturnType — l'instance est gérée dans Training.tsx
import { Clock, StopCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SeriesDots } from './SeriesDots'
import { RestPhase } from './RestPhase'
import { SessionDrawer } from './SessionDrawer'
import { SubstituteDrawer } from './SubstituteDrawer'

interface SessionSummary {
  rounds: number
  totalTime: number
  questTitle?: string
}

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

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function playMicroRewardFeedback() {
  triggerHaptic(35)
  playSuccessSound()
}

// ─── Chip helper ────────────────────────────────────────────────────────────

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

// ─── Main component ────────────────────────────────────────────────────────

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
  const { profile } = useProfile()
  const { user } = useAuth()
  const { processWorkoutRewards, isProcessingRewards } = useRpgProgress()

  const [showSummary, setShowSummary] = useState(false)
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null)
  const [showStopConfirm, setShowStopConfirm] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardResults, setRewardResults] = useState<RewardResult | null>(null)
  const [showPRFlash, setShowPRFlash] = useState(false)
  const [liveXp, setLiveXp] = useState(0)
  const [lastSetXp, setLastSetXp] = useState<number | null>(null)

  // Écouter les nouvelles séries complétées pour le feedback XP live
  const prevCompletedSets = useRef(strengthWorkout.state.completedSets)
  useEffect(() => {
    const prev = prevCompletedSets.current
    const curr = strengthWorkout.state.completedSets
    if (curr > prev) {
      playMicroRewardFeedback()
      // XP approximatif par série (sera affiné si onSetCompleted passe le vrai XP)
      const xp = 18
      setLiveXp(v => v + xp)
      setLastSetXp(xp)
      window.setTimeout(() => setLastSetXp(null), 900)
    }
    prevCompletedSets.current = curr
  }, [strengthWorkout.state.completedSets])


  // Flash PR — 3s puis disparaît
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
    setSessionSummary({
      rounds: 0,
      totalTime: time,
      questTitle: quest?.title,
    })
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

  const validateWorkout = async () => {
    if (!quest || !profile || !user || !session || isProcessingRewards) return

    try {
      setShowSummary(false)

      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({
          is_completed: true,
          ended_at: new Date().toISOString(),
          total_time_seconds: time,
          rounds_completed: 0,
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
        }, {
          onConflict: 'user_id,quest_id'
        })

      if (questStatusError) throw questStatusError

      let rewards = null
      try {
        rewards = await processWorkoutRewards({
          durationMin: Math.ceil(time / 60),
          workoutType: quest.workout_type,
          intensity: 'MEDIUM',
        })

        if (rewards) {
          setRewardResults(rewards)
          setTimeout(() => setShowRewardsModal(true), 500)
        }
      } catch {
        // erreur non bloquante
      }

      try {
        await supabase.from('audit_xp').insert({
          user_id: user.id,
          quest_id: quest.id,
          delta_force: quest.xp_force,
          delta_endurance: quest.xp_endurance,
          delta_agilite: quest.xp_agilite,
          delta_mental: quest.xp_mental,
          delta_total: quest.xp_force + quest.xp_endurance + quest.xp_agilite + quest.xp_mental,
        })
      } catch {
        // erreur non bloquante
      }

      const { data: nextQuest } = await supabase
        .from('quests')
        .select('id, title')
        .eq('campaign_id', quest.campaign_id)
        .eq('order_index', quest.order_index + 1)
        .maybeSingle()

      if (nextQuest) {
        await supabase
          .from('user_quests')
          .upsert({
            user_id: user.id,
            quest_id: nextQuest.id,
            status: 'todo',
          }, {
            onConflict: 'user_id,quest_id'
          })
      }

      toast({
        title: "Validation réussie",
        description: "Votre entraînement a été enregistré !",
      })

      if (!rewards) {
        setTimeout(() => setShowRewardsModal(true), 500)
      }

    } catch (error) {
      console.error('Erreur lors de la validation:', error)
      toast({
        title: 'Erreur de validation',
        description: "Impossible de valider l'entraînement. Veuillez réessayer.",
        variant: 'destructive',
      })
    }
  }

  const handleRewardsModalClose = async () => {
    setShowRewardsModal(false)
    setRewardResults(null)

    try {
      if (quest?.campaign_id) {
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('slug')
          .eq('id', quest.campaign_id)
          .maybeSingle()

        if (campaign?.slug) {
          window.location.href = '/'
          return
        }
      }
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur lors de la redirection:', error)
      window.location.href = '/'
    }
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  const { state, currentExercise, exercises, isWorkoutComplete, totalSets, exerciseRestTime } = strengthWorkout
  const sessionReady = !!session?.id

  const exerciseNumber = state.currentExerciseIndex + 1
  const exerciseTotal = exercises.length
  const totalSetsInWorkout = exercises.reduce((s, ex) => s + ((ex as any).sets_count || 3), 0)
  const liveXpTarget = Math.max(totalSetsInWorkout * 18, liveXp || 1)
  const liveXpProgress = Math.min(100, Math.round((liveXp / liveXpTarget) * 100))

  const nextLabel = (() => {
    if (state.isResting && currentExercise) {
      return `Série ${state.currentSet}/${totalSets} — ${currentExercise.name ?? ''}`
    }
    if (state.currentSet < totalSets) {
      return `Série ${state.currentSet + 1}/${totalSets} — ${currentExercise?.name ?? ''}`
    }
    const nextEx = exercises[state.currentExerciseIndex + 1]
    return nextEx ? nextEx.name : 'Dernière série'
  })()

  const previousPerf = strengthWorkout.getCurrentExercisePreviousPerformance()

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-0 bg-background">

      {/* PR Flash — position fixe en haut */}
      {showPRFlash && strengthWorkout.lastPR && (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 pointer-events-none px-4">
          <div className="bg-yellow-400 text-yellow-900 font-bold text-base px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
            <span>NOUVEAU RECORD !</span>
            <span>
              {strengthWorkout.lastPR.weight > 0
                ? `${strengthWorkout.lastPR.weight}kg × `
                : ''}
              {strengthWorkout.lastPR.reps} reps
            </span>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
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

      {/* ── Corps principal ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Phase repos */}
        {state.isResting && currentExercise && !isWorkoutComplete && (
          <RestPhase
            restTimer={state.restTimer}
            exerciseRestTime={exerciseRestTime}
            nextLabel={nextLabel}
            onSkip={strengthWorkout.skipRest}
            onAdjust={strengthWorkout.adjustRest}
          />
        )}

        {/* Phase exercice actif */}
        {!state.isResting && currentExercise && !isWorkoutComplete && (
          <div className="px-4 py-5 space-y-5">

            {/* Nom de l'exercice */}
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

            {/* GIF démonstration */}
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

            {/* Chips de données */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Chip label="Reps" value={String((currentExercise as any).target_reps ?? '—')} />
              <Chip
                label="Série"
                value={`${state.currentSet}/${totalSets}`}
                accent
              />
              <Chip
                label="Charge"
                value={(currentExercise as any).target_weight
                  ? `${(currentExercise as any).target_weight}kg`
                  : 'Libre'
                }
              />
              <Chip
                label="Repos"
                value={`${exerciseRestTime}s`}
              />
            </div>

            {/* XP live — barre discrète */}
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

            {/* Indicateurs de séries */}
            <SeriesDots
              total={totalSets}
              current={state.currentSet}
              completedLogs={strengthWorkout.currentExerciseLogs.length}
            />

            {/* Séparateur */}
            <div className="border-t border-muted/20" />

            {/* Saisie performances */}
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

            {/* Bouton voir la séance */}
            <SessionDrawer
              exercises={exercises}
              currentExerciseIndex={state.currentExerciseIndex}
              exerciseLogs={state.exerciseLogs}
              completedSets={state.completedSets}
              onSwitchTo={strengthWorkout.switchToExercise}
            />
          </div>
        )}

        {/* Fin d'entraînement */}
        {isWorkoutComplete && (
          <div className="flex flex-col items-center justify-center px-6 py-16 gap-6 text-center">
            <div className="text-5xl">🏆</div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Entraînement terminé !</h2>
              <p className="text-muted-foreground text-sm">
                {state.completedSets} séries réalisées en {formatTime(time)}
              </p>
              <p className="text-accent font-black text-2xl">+{liveXp} XP live</p>
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

      {/* ── Barre de progression globale ───────────────────────────────────── */}
      {!isWorkoutComplete && (
        <div className="px-4 pb-4 pt-2 border-t border-muted/20">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-muted-foreground">Progression</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {state.completedSets} / {exercises.reduce((s, ex) => s + ((ex as any).sets_count || 3), 0)} séries
            </span>
          </div>
          <Progress value={strengthWorkout.progressPercentage} className="h-1.5" />
        </div>
      )}

      {/* ── Dialog résumé séance ────────────────────────────────────────────── */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-md mx-4 rpg-card">
          <DialogHeader>
            <DialogTitle className="text-center">Séance terminée !</DialogTitle>
            <DialogDescription className="text-center">
              Séance de musculation complétée
            </DialogDescription>
          </DialogHeader>

          {sessionSummary && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-accent font-mono">
                  {formatTime(sessionSummary.totalTime)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Temps total d'entraînement
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={validateWorkout}
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={isProcessingRewards}
                >
                  {isProcessingRewards ? 'Traitement...' : 'Valider la séance'}
                </Button>
                <Button
                  onClick={() => setShowSummary(false)}
                  variant="outline"
                  className="w-full"
                  disabled={isProcessingRewards}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog récompenses ──────────────────────────────────────────────── */}
      <Dialog open={showRewardsModal} onOpenChange={handleRewardsModalClose}>
        <DialogContent className="max-w-md mx-4 rpg-card">
          <DialogHeader>
            <DialogTitle className="text-center">Récompenses !</DialogTitle>
          </DialogHeader>

          {rewardResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-500">
                    +{rewardResults.gainedXpGlobal}
                  </div>
                  <div className="text-xs text-muted-foreground">XP gagné</div>
                </div>
                {rewardResults.gainedStats && (
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="text-2xl font-bold text-accent">
                      +{Object.values(rewardResults.gainedStats).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Stats gagnées</div>
                  </div>
                )}
              </div>

              {rewardResults.dailyQuestCompleted && (
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold">Quête du jour accomplie</div>
                    <div className="text-xs text-muted-foreground">{rewardResults.dailyQuestCompleted.title}</div>
                  </div>
                  <div className="text-lg font-black text-accent">
                    +{rewardResults.dailyQuestCompleted.bonusXp} XP
                  </div>
                </div>
              )}

              <Button
                onClick={handleRewardsModalClose}
                className="w-full bg-accent hover:bg-accent/90"
              >
                Retourner à la campagne
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Dialog arrêt séance ─────────────────────────────────────────────── */}
      <Dialog open={showStopConfirm} onOpenChange={setShowStopConfirm}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Arrêter la séance ?</DialogTitle>
            <DialogDescription>
              {state.completedSets > 0
                ? `Tes ${state.completedSets} série${state.completedSets > 1 ? 's' : ''} effectuée${state.completedSets > 1 ? 's' : ''} seront sauvegardées.`
                : 'La séance sera enregistrée même si elle n\'est pas terminée.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={stopAndSave}
              disabled={isStopping}
              variant="destructive"
              className="w-full"
            >
              {isStopping ? 'Sauvegarde...' : 'Arrêter et sauvegarder'}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowStopConfirm(false)}
              disabled={isStopping}
            >
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
