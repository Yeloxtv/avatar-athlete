import { useState, useEffect, useCallback } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { supabase } from '@/integrations/supabase/client'
import { Quest, QuestExercise, WorkoutSession } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { RewardResult } from '@/types/rpg'
import { useStrengthWorkout } from '@/hooks/useStrengthWorkout'
import { StrengthPerformanceInput } from '@/components/workout/StrengthPerformanceInput'
import { List, Square, CheckSquare, Flame, Clock, X, RefreshCw, Search, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

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
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onFinishWorkout: () => void
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function formatRestTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  return `0:${secs.toString().padStart(2, '0')}`
}

function playMicroRewardFeedback() {
  if (typeof window === 'undefined') return

  navigator.vibrate?.(35)

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return

    const audioContext = new AudioContextClass()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(990, audioContext.currentTime + 0.08)
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.14)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.15)
  } catch {
    // Le feedback audio est un bonus: on ignore les navigateurs qui le bloquent.
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────

interface SeriesDotsProps {
  total: number
  current: number
  completedLogs: number
}

function SeriesDots({ total, current, completedLogs }: SeriesDotsProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => {
        const setNumber = i + 1
        const isDone = setNumber <= completedLogs
        const isActive = setNumber === current && !isDone

        return (
          <div
            key={i}
            className={cn(
              'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
              isDone && 'bg-accent border-accent text-accent-foreground',
              isActive && 'border-accent ring-2 ring-accent animate-pulse text-accent',
              !isDone && !isActive && 'border-muted text-muted-foreground'
            )}
          >
            {isDone ? '✓' : setNumber}
          </div>
        )
      })}
    </div>
  )
}

interface RestPhaseProps {
  restTimer: number
  exerciseRestTime: number
  nextLabel: string
  onSkip: () => void
  onAdjust: (delta: number) => void
}

function RestPhase({ restTimer, exerciseRestTime, nextLabel, onSkip, onAdjust }: RestPhaseProps) {
  const progressValue = exerciseRestTime > 0 ? (restTimer / exerciseRestTime) * 100 : 0

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Récupération
        </p>
        <p className="text-xs text-muted-foreground">
          Prochain : <span className="text-foreground font-medium">{nextLabel}</span>
        </p>
      </div>

      <div className="relative flex items-center justify-center w-52 h-52">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressValue / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="text-6xl font-mono font-bold text-accent tabular-nums">
          {formatRestTimer(restTimer)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="w-16"
          onClick={() => onAdjust(-30)}
        >
          −30s
        </Button>
        <Button
          onClick={onSkip}
          className="px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          Passer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-16"
          onClick={() => onAdjust(30)}
        >
          +30s
        </Button>
      </div>

      <Progress
        value={progressValue}
        className="w-full h-1.5 bg-muted"
      />
    </div>
  )
}

interface SessionDrawerProps {
  exercises: QuestExercise[]
  currentExerciseIndex: number
  exerciseLogs: Array<{ exercise_id: string }>
  completedSets: number
  onSwitchTo: (index: number) => void
}

function SessionDrawer({
  exercises,
  currentExerciseIndex,
  exerciseLogs,
  completedSets,
  onSwitchTo
}: SessionDrawerProps) {
  const totalSetsPlanned = exercises.reduce((sum, ex) => sum + ((ex as any).sets_count || 3), 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full h-12 gap-2 text-sm font-semibold bg-yellow-400 text-yellow-900 border-0">
          <List className="w-4 h-4" />
          Voir la séance
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto pb-safe">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-base">Programme de la séance</SheetTitle>
        </SheetHeader>

        <div className="space-y-2">
          {exercises.map((exercise, index) => {
            const targetSets = (exercise as any).sets_count || 3
            const done = exerciseLogs.filter(l => l.exercise_id === exercise.id).length
            const isCompleted = done >= targetSets || index < currentExerciseIndex
            const isActive = index === currentExerciseIndex
            const isUpcoming = !isCompleted && !isActive

            return (
              <div
                key={`${exercise.id}-${index}`}
                className={cn(
                  'flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors',
                  isCompleted && 'border-green-500/30 bg-green-500/5',
                  isActive && 'border-accent/50 bg-accent/10',
                  isUpcoming && 'border-muted bg-muted/10'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 text-base">
                    {isCompleted
                      ? <CheckSquare className="w-4 h-4 text-green-500" />
                      : isActive
                        ? <Flame className="w-4 h-4 text-accent" />
                        : <Square className="w-4 h-4 text-muted-foreground" />
                    }
                  </span>
                  <div className="min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      isCompleted && 'text-green-500',
                      isActive && 'text-accent',
                      isUpcoming && 'text-muted-foreground'
                    )}>
                      {exercise.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {done}/{targetSets} séries
                      {(exercise as any).target_reps ? ` · ${(exercise as any).target_reps} reps` : ''}
                    </p>
                  </div>
                </div>

                {isUpcoming && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs h-7 px-2"
                    onClick={() => onSwitchTo(index)}
                  >
                    Faire maintenant
                  </Button>
                )}
                {isActive && (
                  <span className="shrink-0 text-xs text-accent font-medium">En cours</span>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-muted/30">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-accent">{completedSets}</p>
              <p className="text-xs text-muted-foreground">Séries faites</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{totalSetsPlanned}</p>
              <p className="text-xs text-muted-foreground">Séries prévues</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Substitute Drawer ────────────────────────────────────────────────────

interface GlobalExercise {
  id: string
  name: string
  name_fr: string | null
  muscle_group: string
  equipment: string
  level: string
}

const EQUIPMENT_FR: Record<string, string> = {
  barbell: 'Barre', dumbbell: 'Haltères', cable: 'Poulie', machine: 'Machine',
  bodyweight: 'Poids corps', bands: 'Élastiques', kettlebell: 'Kettlebell', other: 'Autre',
}

const EQUIPMENT_COLORS: Record<string, string> = {
  barbell: 'bg-orange-500/20 text-orange-400',
  dumbbell: 'bg-blue-500/20 text-blue-400',
  cable: 'bg-purple-500/20 text-purple-400',
  machine: 'bg-cyan-500/20 text-cyan-400',
  bodyweight: 'bg-emerald-500/20 text-emerald-400',
  bands: 'bg-pink-500/20 text-pink-400',
  kettlebell: 'bg-amber-500/20 text-amber-400',
  other: 'bg-muted/40 text-muted-foreground',
}

interface SubstituteDrawerProps {
  currentExerciseName: string
  muscleGroup: string | null
  onSubstitute: (id: string, name: string, muscleGroup: string) => void
}

function SubstituteDrawer({ currentExerciseName, muscleGroup, onSubstitute }: SubstituteDrawerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [exercises, setExercises] = useState<GlobalExercise[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    let query = supabase
      .from('exercises')
      .select('id, name, name_fr, muscle_group, equipment, level')
      .order('name')
    if (muscleGroup) query = (query as any).eq('muscle_group', muscleGroup)
    ;(query as any).then(({ data }: { data: GlobalExercise[] | null }) => {
      setExercises(data ?? [])
      setLoading(false)
    })
  }, [open, muscleGroup])

  const q = search.trim().toLowerCase()
  const filtered = q.length >= 2
    ? exercises.filter(e =>
        e.name !== currentExerciseName &&
        (e.name.toLowerCase().includes(q) || (e.name_fr ?? '').toLowerCase().includes(q))
      )
    : exercises.filter(e => e.name !== currentExerciseName)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground gap-1 hover:text-foreground"
        >
          <RefreshCw className="w-3 h-3" />
          Remplacer
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] flex flex-col pb-safe">
        <SheetHeader className="mb-3 shrink-0">
          <SheetTitle className="text-base">Remplacer l'exercice</SheetTitle>
          <p className="text-xs text-muted-foreground">
            Remplace <span className="font-medium text-foreground">{currentExerciseName}</span>
            {muscleGroup ? ` · filtre : ${muscleGroup}` : ''}
          </p>
        </SheetHeader>

        <div className="relative shrink-0 mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">Aucun résultat</div>
          ) : (
            filtered.map(ex => (
              <button
                key={ex.id}
                className="w-full flex items-start justify-between px-3 py-3 rounded-lg hover:bg-muted/20 transition-colors text-left"
                onClick={() => {
                  onSubstitute(ex.id, ex.name, ex.muscle_group)
                  setOpen(false)
                  setSearch('')
                }}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm font-medium truncate">{ex.name}</p>
                  {ex.name_fr && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{ex.name_fr}</p>
                  )}
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    ex.level === 'beginner' && 'bg-green-500/20 text-green-400',
                    ex.level === 'intermediate' && 'bg-yellow-500/20 text-yellow-400',
                    ex.level === 'expert' && 'bg-red-500/20 text-red-400',
                  )}>
                    {ex.level === 'beginner' ? 'Débutant' : ex.level === 'intermediate' ? 'Intermédiaire' : 'Expert'}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    EQUIPMENT_COLORS[ex.equipment] ?? EQUIPMENT_COLORS.other
                  )}>
                    {EQUIPMENT_FR[ex.equipment] ?? ex.equipment}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export default function StrengthWorkoutInterface({
  quest,
  session,
  time,
  isRunning,
  onStart,
  onPause,
  onReset,
  onFinishWorkout
}: StrengthWorkoutInterfaceProps) {
  const { profile } = useProfile()
  const { processWorkoutRewards, isProcessingRewards } = useRpgProgress()

  const [showSummary, setShowSummary] = useState(false)
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardResults, setRewardResults] = useState<RewardResult | null>(null)
  const [showPRFlash, setShowPRFlash] = useState(false)
  const [liveXp, setLiveXp] = useState(0)
  const [lastSetXp, setLastSetXp] = useState<number | null>(null)

  const handleSetCompleted = useCallback((event: { xp: number }) => {
    setLiveXp(prev => prev + event.xp)
    setLastSetXp(event.xp)
    playMicroRewardFeedback()

    window.setTimeout(() => {
      setLastSetXp(null)
    }, 900)
  }, [])

  const strengthWorkout = useStrengthWorkout({
    exercises: quest?.exercises || [],
    sessionId: session?.id ?? '',
    restTimeSeconds: 60,
    onSetCompleted: handleSetCompleted
  })


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

  const validateWorkout = async () => {
    if (!quest || !profile || !session || isProcessingRewards) return

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
          user_id: profile.id,
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
          user_id: profile.id,
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
            user_id: profile.id,
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

        <div className="flex items-center gap-2">
          {!isWorkoutComplete && (
            <span className="text-xs text-muted-foreground font-medium">
              Exercice {exerciseNumber}/{exerciseTotal}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
          onClick={finishWorkout}
        >
          <X className="w-4 h-4" />
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

            <div className="relative rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 overflow-hidden">
              {lastSetXp !== null && (
                <div className="absolute right-4 top-2 text-accent font-black text-lg animate-bounce">
                  +{lastSetXp} XP
                </div>
              )}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold">XP live</span>
                </div>
                <span className="text-xl font-black text-accent tabular-nums">{liveXp}</span>
              </div>
              <Progress value={liveXpProgress} className="h-2" />
              <div className="flex justify-between mt-1.5 text-[11px] text-muted-foreground">
                <span>{state.completedSets}/{totalSetsInWorkout} séries validées</span>
                <span>objectif {liveXpTarget} XP</span>
              </div>
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
    </div>
  )
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
