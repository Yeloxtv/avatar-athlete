import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useSessionSummary } from '@/hooks/useSessionSummary'
import { useWorkoutValidation } from '@/hooks/useWorkoutValidation'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { WorkoutRewardsModal } from '@/components/ui/workout-rewards-modal'
import { ConfettiEffect } from '@/components/ConfettiEffect'
import { Clock, Dumbbell, Zap, Flame, Loader2, ChevronDown, ChevronUp, Trophy, Crown, Sparkles, Target, Gift } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { XpService } from '@/services/xpService'
import { StreakService } from '@/services/streakService'

// ─── Sons ──────────────────────────────────────────────────────────────────

function playSound(type: 'levelUp' | 'questComplete' | 'statGain') {
  if (typeof window === 'undefined') return
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const gain = ctx.createGain()
    gain.connect(ctx.destination)

    const notes: number[] = type === 'levelUp'
      ? [523, 659, 784, 1047]   // Do Mi Sol Do — accord montant triomphant
      : type === 'questComplete'
      ? [659, 784, 1047]        // Mi Sol Do
      : [880, 1047]             // La Do — bref et doux

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = type === 'levelUp' ? 'triangle' : 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.12)
      g.gain.exponentialRampToValueAtTime(type === 'levelUp' ? 0.12 : 0.07, ctx.currentTime + i * 0.12 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.18)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.2)
    })

    if (type === 'levelUp') navigator.vibrate?.([50, 30, 80])
  } catch {
    // ignoré silencieusement
  }
}

export default function SessionSummary() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()

  const [quest, setQuest] = useState<Quest | null>(null)
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [xpDisplayed, setXpDisplayed] = useState(0)
  const [showConfetti, setShowConfetti] = useState(true)
  const [showLevelUpBurst, setShowLevelUpBurst] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const xpAnimRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const soundsFiredRef = useRef(false)

  const { summary, loading: summaryLoading, generateSummary, formatVolume, getIntensityEmoji } = useSessionSummary({
    quest,
    session,
    time: session?.total_time_seconds || 0,
  })

  const workoutValidation = useWorkoutValidation({
    quest,
    session,
    time: session?.total_time_seconds || 0,
    rounds: session?.rounds_completed || 0,
  })

  useEffect(() => {
    const load = async () => {
      if (!questId || !profile?.id) return
      try {
        const { data: questData, error: questError } = await supabase
          .from('quests')
          .select('*, quest_exercises(id, name, target_reps, order_index, notes, sets_count, target_weight, rest_seconds)')
          .eq('id', questId)
          .single()
        if (questError) throw questError
        setQuest({ ...questData, exercises: questData.quest_exercises || [] })

        const { data: sessionData, error: sessionError } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', profile.id)
          .eq('quest_id', questId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        if (sessionError) throw sessionError
        setSession(sessionData)
        setNote((sessionData as any).note || '')
      } catch (error) {
        console.error(error)
        toast({ title: 'Erreur', description: 'Impossible de charger la séance', variant: 'destructive' })
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [questId, profile?.id])

  useEffect(() => {
    if (quest && session && !summaryLoading && !summary) {
      generateSummary()
    }
  }, [quest, session, summaryLoading, summary])

  // Animation XP + sons déclenchés après le count-up
  useEffect(() => {
    if (!summary || summary.xp.total === 0) return
    soundsFiredRef.current = false
    const target = summary.xp.total
    const duration = 1200
    const steps = 40
    const increment = target / steps
    let current = 0
    // Calculer levelUp ici pour la closure
    const curXp = profile?.xp_total || 0
    const projXp = curXp + target
    const isLevelUp = XpService.calculateLevelFromXp(projXp) > XpService.calculateLevelFromXp(curXp)

    xpAnimRef.current = setInterval(() => {
      current += increment
      if (current >= target) {
        setXpDisplayed(target)
        clearInterval(xpAnimRef.current!)
        if (!soundsFiredRef.current) {
          soundsFiredRef.current = true
          if (isLevelUp) {
            setShowLevelUpBurst(true)
            playSound('levelUp')
            setTimeout(() => setShowLevelUpBurst(false), 1200)
          } else if (summary.dailyQuest.isComplete) {
            playSound('questComplete')
          }
          setTimeout(() => setStatsVisible(true), 200)
        }
      } else {
        setXpDisplayed(Math.round(current))
      }
    }, duration / steps)
    return () => clearInterval(xpAnimRef.current!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary?.xp.total])

  const handleSaveNote = async () => {
    if (!session) return
    const { error } = await supabase
      .from('workout_sessions')
      .update({ note })
      .eq('id', session.id)
    if (!error) setNoteSaved(true)
  }

  const handleValidate = async () => {
    if (!quest || !session) return
    setIsValidating(true)
    try {
      await workoutValidation.validateWorkout()
    } catch (error) {
      toast({ title: 'Erreur de validation', variant: 'destructive' })
    } finally {
      setIsValidating(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}min${secs > 0 ? ` ${secs}s` : ''}`
  }

  const currentXp = profile?.xp_total || 0
  const previewXp = summary?.xp.total || 0
  const projectedXp = currentXp + previewXp
  const currentProgress = XpService.getLevelProgress(currentXp)
  const projectedProgress = XpService.getLevelProgress(projectedXp)
  const currentLevel = currentProgress.currentLevel
  const projectedLevel = XpService.calculateLevelFromXp(projectedXp)
  const levelProgress = Math.round(projectedProgress.percentage)
  const levelUpPreview = projectedLevel > currentLevel
  const streakBonusRate = StreakService.getXpBonusRate(summary?.streak.consecutive || 0)
  const streakBonusActive = streakBonusRate > 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!quest || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Données de séance introuvables</p>
        <Button onClick={() => navigate('/')}>Retour</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-5">
      <ConfettiEffect trigger={showConfetti && !!summary} onComplete={() => setShowConfetti(false)} />

      {summaryLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Calcul des récompenses...</p>
        </div>
      ) : summary ? (
        <>
          {/* HERO — Victoire */}
          <div className="text-center py-7 space-y-2">
            <div className="mx-auto w-20 h-20 rounded-full hero-gradient flex items-center justify-center animate-pulse-glow">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-black">Mission accomplie</p>
            <h1 className="text-2xl font-black leading-tight">{quest.title}</h1>
            <p className="text-muted-foreground text-sm">Ta run est prête. Récolte les récompenses.</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <RewardPill label="XP" value={`+${summary.xp.total}`} icon={<Zap className="w-4 h-4" />} />
            <RewardPill label="Streak" value={`${summary.streak.consecutive}j`} icon={<Flame className="w-4 h-4" />} />
            <RewardPill
              label="Quête"
              value={summary.dailyQuest.isComplete ? `+${summary.dailyQuest.rewardXp}` : `${summary.dailyQuest.percentage}%`}
              icon={<Target className="w-4 h-4" />}
            />
          </div>

          {/* PRs de la séance */}
          {summary.prs.length > 0 && (
            <div className="rounded-2xl border border-yellow-400/40 bg-yellow-400/10 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-yellow-500">
                <span>🔥</span> Nouveaux records
              </div>
              <div className="space-y-1">
                {summary.prs.map((pr, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{pr.exercise_name}</span>
                    <span className="font-bold text-yellow-500">
                      {pr.weight > 0 ? `${pr.weight}kg × ` : ''}{pr.reps} reps
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Clock className="w-4 h-4 mx-auto mb-1 text-accent" />
                <div className="font-bold text-sm">{formatTime(summary.totalTime)}</div>
                <div className="text-xs text-muted-foreground">Durée</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Dumbbell className="w-4 h-4 mx-auto mb-1 text-accent" />
                <div className="font-bold text-sm">{formatVolume(summary.totalVolume)}</div>
                <div className="text-xs text-muted-foreground">Volume</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg mb-0.5">{getIntensityEmoji(summary.intensity)}</div>
                <div className="font-bold text-sm">{summary.intensity}</div>
                <div className="text-xs text-muted-foreground">Intensité</div>
              </CardContent>
            </Card>
          </div>

          {/* XP animé */}
          {summary.xp.total > 0 && (
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="font-semibold">XP gagné</span>
                </div>
                <span className="text-3xl font-black text-accent">+{xpDisplayed}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Niveau {currentLevel}</span>
                  <span>{levelUpPreview ? `Niveau ${projectedLevel} débloqué` : `${projectedProgress.remaining} XP restants`}</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>

              {levelUpPreview && (
                <div
                  className="rounded-xl border-2 border-accent bg-accent/15 p-4 flex items-center gap-3 text-accent font-black"
                  style={showLevelUpBurst ? { animation: 'levelUpBurst 0.5s ease-out forwards' } : {}}
                >
                  <div className="relative shrink-0">
                    <Crown className={`w-6 h-6 ${showLevelUpBurst ? 'animate-spin' : ''}`} />
                    {showLevelUpBurst && (
                      <div className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-accent/70 font-bold">Level Up !</div>
                    <div className="text-base">{XpService.getLevelTitle(projectedLevel)}</div>
                  </div>
                  {showLevelUpBurst && (
                    <Sparkles className="w-5 h-5 ml-auto animate-bounce text-accent" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Stats RPG — apparition décalée */}
          <div className="grid grid-cols-4 gap-2">
            {([
              { label: 'Force',     value: summary.xp.force,     className: 'text-stats-force',     delay: 0 },
              { label: 'Endurance', value: summary.xp.endurance, className: 'text-stats-endurance', delay: 80 },
              { label: 'Agilité',   value: summary.xp.agilite,   className: 'text-stats-agilite',   delay: 160 },
              { label: 'Mental',    value: summary.xp.mental,    className: 'text-stats-mental',    delay: 240 },
            ] as const).map(({ label, value, className, delay }) => (
              <StatReward
                key={label}
                label={label}
                value={value}
                className={className}
                visible={statsVisible}
                delay={delay}
              />
            ))}
          </div>

          {/* Streak semaine */}
          <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-medium">Cette semaine</span>
            </div>
            <span className="font-bold text-orange-400">
              {summary.streak.thisWeek} séance{summary.streak.thisWeek > 1 ? 's' : ''}
            </span>
          </div>

          {/* Mini récompense */}
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-bold">Récompense de run</p>
                <p className="text-xs text-muted-foreground">
                  {streakBonusActive ? `${summary.streak.consecutive} jours de streak : bonus actif` : 'Reviens demain pour activer le bonus de streak'}
                </p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-black text-primary">
              {streakBonusActive ? `+${Math.round(streakBonusRate * 100)}% XP` : 'À activer'}
            </span>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Target className="w-5 h-5 text-accent shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold">Quête du jour</p>
                  <p className="text-xs text-muted-foreground truncate">{summary.dailyQuest.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent font-black shrink-0">
                <Gift className="w-4 h-4" />
                +{summary.dailyQuest.rewardXp} XP
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{summary.dailyQuest.progress}/{summary.dailyQuest.target} {summary.dailyQuest.unit}</span>
                <span>{summary.dailyQuest.isComplete ? 'Accomplie' : `${summary.dailyQuest.percentage}%`}</span>
              </div>
              <Progress value={summary.dailyQuest.percentage} className="h-2" />
            </div>
          </div>

          {/* Exercices — collapsible */}
          <Card>
            <CardContent className="p-0">
              {summary.exercises.map((ex, i) => (
                <div key={ex.exercise_id} className={i > 0 ? 'border-t border-muted/20' : ''}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/20 transition-colors"
                    onClick={() => setExpandedExercise(expandedExercise === ex.exercise_id ? null : ex.exercise_id)}
                  >
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {ex.exercise_name}
                        {summary.prs.some(p => p.exercise_name === ex.exercise_name) && (
                          <span className="text-xs bg-yellow-400/20 text-yellow-500 font-bold px-1.5 py-0.5 rounded">PR</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ex.sets.length} séries · {ex.best_weight > 0 ? `${ex.best_weight}kg max` : `${ex.total_reps} reps`}
                        {ex.volume > 0 ? ` · ${formatVolume(ex.volume)}` : ''}
                      </div>
                    </div>
                    {expandedExercise === ex.exercise_id
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                  </button>
                  {expandedExercise === ex.exercise_id && (
                    <div className="px-4 pb-3 space-y-1 border-t border-muted/20 pt-2">
                      {ex.sets.map((set) => (
                        <div key={set.set_number} className="flex items-center justify-between text-sm py-0.5">
                          <span className="text-muted-foreground">Série {set.set_number}</span>
                          <span className="font-medium">
                            {set.reps} reps{set.weight > 0 ? ` × ${set.weight}kg` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Note */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-medium">Note de séance</p>
              <Textarea
                placeholder="Sensations, douleurs, objectifs pour la prochaine fois..."
                value={note}
                onChange={(e) => { setNote(e.target.value); setNoteSaved(false) }}
                rows={3}
                className="resize-none text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveNote}
                disabled={noteSaved}
                className="w-full"
              >
                {noteSaved ? '✓ Note enregistrée' : 'Enregistrer la note'}
              </Button>
            </CardContent>
          </Card>

          {/* CTA principal */}
          <Button
            onClick={handleValidate}
            className="w-full h-12 text-base font-bold"
            disabled={isValidating}
          >
            {isValidating
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Validation...</>
              : <><Trophy className="w-4 h-4 mr-2" />Récolter les récompenses</>
            }
          </Button>

          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate(`/training/${questId}`)}>
            Reprendre l'entraînement
          </Button>
        </>
      ) : null}

      <WorkoutRewardsModal
        isOpen={workoutValidation.showRewardsModal}
        onClose={workoutValidation.handleRewardsModalClose}
        rewards={workoutValidation.rewardResults}
        sessionData={{
          rounds: session?.rounds_completed || 0,
          totalTime: session?.total_time_seconds || 0,
          questTitle: quest?.title,
        }}
      />
    </div>
  )
}

function StatReward({
  label,
  value,
  className,
  visible = true,
  delay = 0,
}: {
  label: string
  value: number
  className: string
  visible?: boolean
  delay?: number
}) {
  const [displayed, setDisplayed] = useState(0)
  const ran = useRef(false)

  useEffect(() => {
    if (!visible || ran.current || value === 0) return
    ran.current = true
    const timer = setTimeout(() => {
      playSound('statGain')
      const steps = 12
      const duration = 400
      let step = 0
      const id = setInterval(() => {
        step++
        setDisplayed(Math.round((value * step) / steps))
        if (step >= steps) clearInterval(id)
      }, duration / steps)
    }, delay)
    return () => clearTimeout(timer)
  }, [visible, value, delay])

  return (
    <div
      className="rounded-xl border border-muted/30 bg-muted/10 p-2 text-center min-w-0 transition-all duration-300"
      style={visible
        ? { animation: `statCountUp 0.35s ease-out ${delay}ms both` }
        : { opacity: 0, transform: 'translateY(6px)' }}
    >
      <div className={`text-lg font-black ${className}`}>+{displayed}</div>
      <div className="text-[10px] text-muted-foreground truncate">{label}</div>
    </div>
  )
}

function RewardPill({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-accent/20 bg-muted/10 p-3 text-center min-w-0">
      <div className="flex justify-center text-accent mb-1">{icon}</div>
      <div className="text-base font-black text-foreground truncate">{value}</div>
      <div className="text-[10px] uppercase text-muted-foreground tracking-wide">{label}</div>
    </div>
  )
}
