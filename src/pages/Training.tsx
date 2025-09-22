// FILE: src/pages/Training.tsx  (REMPLACEMENT COMPLET DU FICHIER)

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { supabase, Quest, QuestExercise, WorkoutSession } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Check, Info, Timer } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { WorkoutRewardsModal } from '@/components/ui/workout-rewards-modal'
import { LevelDisplay } from '@/components/ui/level-display'
import { RewardResult } from '@/types/rpg'


interface SessionSummary {
  rounds: number
  totalTime: number
  questTitle?: string
}

interface RoundTime {
  roundNumber: number
  duration: number
  timestamp: number
}

export default function Training() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { processWorkoutRewards, isProcessingRewards } = useRpgProgress()

  const [quest, setQuest] = useState<(Quest & { exercises: QuestExercise[] }) | null>(null)
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [workTime, setWorkTime] = useState(0)
  const [isWorkPhase, setIsWorkPhase] = useState(true)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardResults, setRewardResults] = useState<RewardResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [roundTimes, setRoundTimes] = useState<RoundTime[]>([])
  const [roundStartTime, setRoundStartTime] = useState<number>(0)
  const intervalRef = useRef<number | null>(null) // ✅ navigateur → number


  // ------------------------ LOAD QUEST ------------------------
  useEffect(() => {
    if (questId && profile?.user_id) {
      void fetchQuest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questId, profile?.user_id])

  // ------------------------ TIMER -----------------------------
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        // incrémente le temps et vérifie AMRAP avec la valeur fraîche
        setTime(prevTime => {
          const nextTime = prevTime + 1
          if (quest?.workout_type === 'amrap' && (quest?.total_minutes ?? 0) > 0) {
            if (nextTime >= (quest.total_minutes! * 60)) {
              finishWorkout()
            }
          }
          return nextTime
        })

        // logique TABATA protégée par défauts
        if (quest?.workout_type === 'tabata') {
          setWorkTime(prev => {
            const work = quest?.work_seconds ?? 20
            const rest = quest?.rest_seconds ?? 10
            const roundsTarget = quest?.rounds_target ?? 0

            const newTime = prev + 1
            const cycleDuration = work + rest
            const currentCycleTime = cycleDuration > 0 ? newTime % cycleDuration : 0

            if (cycleDuration > 0 && currentCycleTime === 0 && newTime > 0) {
              const exLen = Math.max(quest?.exercises?.length ?? 0, 1)
              setExerciseIndex(prevIdx => (prevIdx + 1) % exLen)
              if (roundsTarget > 0 && (newTime / cycleDuration) >= roundsTarget) {
                finishWorkout()
              }
            }

            setIsWorkPhase(currentCycleTime < work)
            return newTime
          })
        }
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, quest]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchQuest = async () => {
    if (!questId || !profile?.user_id) return
    try {
      // 1) user_quests: pas de blocage si pas de ligne (0 == quête non encore commencée)
      const { error: uqErr } = await supabase
        .from('user_quests')
        .select('status')
        .eq('user_id', profile.user_id)
        .eq('quest_id', questId)
        .limit(1)
      if (uqErr) console.warn('user_quests check:', uqErr)

      // 2) quest + exercises (safeSingle)
      const { data: questRows, error: questError } = await supabase
        .from('quests')
        .select(`
          *,
          quest_exercises(
            id,
            name,
            target_reps,
            order_index,
            notes
          )
        `)
        .eq('id', questId)
        .limit(1)
      if (questError) throw questError
      const row = questRows?.[0]
      if (!row) throw new Error('Quest not found')

      setQuest({
        ...row,
        exercises: row.quest_exercises ?? []
      })

      // 3) reprise de session (safeSingle)
      const { data: sessions, error: sessErr } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', profile.user_id)
        .eq('quest_id', questId)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
      if (!sessErr) {
        const existingSession = sessions?.[0]
        if (existingSession) {
          setSession(existingSession)
          setTime(existingSession.total_time_seconds ?? 0)
          setRounds(existingSession.rounds_completed ?? 0)
          toast({
            title: 'Session reprise',
            description: 'Votre session précédente a été restaurée',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching quest:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la quête',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // ------------------------ CONTROLS --------------------------
  const startCountdown = () => {
    setCountdown(3)
    const countdownInterval = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setIsRunning(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startWorkout = async () => {
    if (!quest || !profile) return
    try {
      // D'abord essayer UPDATE
      const { error: updateError } = await supabase
        .from('user_quests')
        .update({
          status: 'in_progress',
        })
        .eq('user_id', profile.user_id)
        .eq('quest_id', quest.id)

      // Si UPDATE échoue (ligne n'existe pas), faire INSERT
      if (updateError) {
        console.log('⚠️ UPDATE startWorkout échoué, tentative INSERT...')
        const { error: insertError } = await supabase
          .from('user_quests')
          .insert({
            user_id: profile.user_id,
            quest_id: quest.id,
            status: 'in_progress',
          })

        if (insertError) {
          console.error('❌ Erreur INSERT startWorkout:', insertError)
          throw insertError
        }
      }

      if (!session) {
        const { data: newSession, error } = await supabase
          .from('workout_sessions')
          .insert({
            user_id: profile.user_id,
            quest_id: quest.id,
            workout_type: quest.workout_type,
          })
          .select()
          .maybeSingle()
        if (error) throw error
        if (newSession) setSession(newSession)
      }

      setRoundStartTime(time)
      startCountdown()
    } catch (error) {
      console.error('Error starting workout:', error)
      toast({
        title: 'Erreur',
        description: "Impossible de démarrer l'entraînement",
        variant: 'destructive',
      })
    }
  }

  const pauseWorkout = () => {
    setIsRunning(false)
    void saveSession()
  }

  const resetWorkout = async () => {
    setIsRunning(false)
    setTime(0)
    setRounds(0)
    setCurrentRound(1)
    setWorkTime(0)
    setIsWorkPhase(true)
    setExerciseIndex(0)

    if (session) {
      await supabase.from('workout_sessions').delete().eq('id', session.id)
      setSession(null)
    }
  }

  const addRound = async () => {
    const currentTime = time
    const roundDuration = roundStartTime > 0 ? currentTime - roundStartTime : currentTime

    const newRounds = rounds + 1
    setRounds(newRounds)
    setCurrentRound(newRounds + 1)

    const newRoundTime: RoundTime = {
      roundNumber: newRounds,
      duration: roundDuration,
      timestamp: Date.now(),
    }
    setRoundTimes(prev => [...prev, newRoundTime])
    setRoundStartTime(currentTime)

    if (session) {
      await supabase.from('session_rounds').insert({
        session_id: session.id,
        round_no: newRounds,
        duration_seconds: roundDuration,
        reps_total: quest?.exercises.reduce((sum, ex) => sum + (ex.target_reps ?? 0), 0) || 0,
      })
      void saveSession()
    }

    toast({
      title: `Tour ${newRounds} terminé !`,
      description: `Temps: ${formatTime(roundDuration)}`,
    })
  }

  const saveSession = async () => {
    if (!session) return
    await supabase
      .from('workout_sessions')
      .update({
        total_time_seconds: time,
        rounds_completed: rounds,
      })
      .eq('id', session.id)
  }

  const finishWorkout = () => {
    setIsRunning(false)
    setSessionSummary({
      rounds,
      totalTime: time,
      questTitle: quest?.title,
    })
    setShowSummary(true)
  }

 const validateWorkout = async () => {
  if (!quest || !profile || !session || isProcessingRewards) return
  
  try {
    console.log('🔄 Début de la validation de l\'entraînement...')
    console.log('🔍 VALIDATION DEBUG - Données:', {
      user_id: profile.user_id,
      quest_id: quest.id,
      session_id: session.id
    })

    // Fermer la première modal immédiatement
    setShowSummary(false)

    // 1. Marquer la session comme terminée
    console.log('📝 Mise à jour de la session workout...')
    const { error: sessionError } = await supabase
      .from('workout_sessions')
      .update({
        is_completed: true,
        ended_at: new Date().toISOString(),
        total_time_seconds: time,
        rounds_completed: rounds,
      })
      .eq('id', session.id)

    if (sessionError) {
      console.error('❌ Erreur session:', sessionError)
      throw sessionError
    }

    // 2. Marquer la quête comme terminée avec UPSERT
    console.log('✅ Mise à jour du statut de la quête...')
    console.log('🔍 VALIDATION DEBUG - Tentative de sauvegarde:', {
      user_id: profile.user_id,
      quest_id: quest.id,
      status: 'completed'
    })

    const { error: questStatusError } = await supabase
      .from('user_quests')
      .upsert({
        user_id: profile.user_id,
        quest_id: quest.id,
        status: 'completed',
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,quest_id'
      })

    if (questStatusError) {
      console.error('❌ ERREUR lors de la sauvegarde:', questStatusError)
      throw questStatusError
    } else {
      console.log('✅ Statut sauvegardé avec succès')
    }

    // 3. Calculer les récompenses (ne doit pas bloquer si échec)
    console.log('🎁 Calcul des récompenses...')
    let rewards = null
    try {
      rewards = await processWorkoutRewards({
        durationMin: Math.ceil(time / 60),
        workoutType: quest.workout_type,
        intensity:
          rounds >= (quest.rounds_target ?? 0)
            ? 'HIGH'
            : rounds >= Math.ceil((quest.rounds_target ?? 0) * 0.7)
            ? 'MEDIUM'
            : 'LOW',
      })

      if (rewards) {
        setRewardResults(rewards)
        setTimeout(() => setShowRewardsModal(true), 500)
      }
    } catch (rewardError) {
      console.warn('⚠️ Erreur lors du calcul des récompenses (non bloquant):', rewardError)
    }

    // 4. Enregistrer l'audit XP (ne doit pas bloquer si échec)
    console.log('📊 Enregistrement de l\'audit XP...')
    try {
      const { error: auditError } = await supabase.from('audit_xp').insert({
        user_id: profile.user_id,
        quest_id: quest.id,
        delta_force: quest.xp_force,
        delta_endurance: quest.xp_endurance,
        delta_agilite: quest.xp_agilite,
        delta_mental: quest.xp_mental,
        delta_total: quest.xp_force + quest.xp_endurance + quest.xp_agilite + quest.xp_mental,
      })

      if (auditError) {
        console.warn('⚠️ Erreur audit XP (non bloquant):', auditError)
      }
    } catch (auditError) {
      console.warn('⚠️ Erreur audit XP (non bloquant):', auditError)
    }

    // 5. Vérifier et débloquer la quête suivante
    console.log('🔍 Recherche de la quête suivante...')
    const { data: nextQuest, error: nextQuestError } = await supabase
      .from('quests')
      .select('id, title')
      .eq('campaign_id', quest.campaign_id)
      .eq('order_index', quest.order_index + 1)
      .maybeSingle()

    if (nextQuestError) {
      console.warn('⚠️ Erreur recherche quête suivante:', nextQuestError)
    }

    if (nextQuest) {
      console.log('🔓 Déblocage de la quête suivante:', nextQuest.title)
      
      const { error: nextQuestError } = await supabase
        .from('user_quests')
        .upsert({
          user_id: profile.user_id,
          quest_id: nextQuest.id,
          status: 'todo',
        }, {
          onConflict: 'user_id,quest_id'
        })

      if (nextQuestError) {
        console.error('❌ Erreur déblocage quête suivante:', nextQuestError)
      } else {
        console.log('✅ Quête suivante débloquée avec succès')
      }
    } else {
      console.log('ℹ️ Aucune quête suivante trouvée (fin de campagne)')
    }

    // 6. Vérifier les badges (ne doit JAMAIS bloquer la validation)
    console.log('🏆 Vérification des badges...')
    try {
      await checkBadgeUnlocks()
      console.log('✅ Vérification des badges terminée')
    } catch (badgeError) {
      console.warn('⚠️ Erreur lors de la vérification des badges (non bloquant):', badgeError)
    }

    console.log('🎉 Validation terminée avec succès !')
    toast({
      title: "✅ Validation réussie",
      description: "Votre entraînement a été enregistré !",
    })

    // Si pas de récompenses à afficher, ouvrir directement la modal des récompenses
    if (!rewards) {
      setTimeout(() => setShowRewardsModal(true), 500)
    }

  } catch (error) {
    console.error('❌ Erreur critique lors de la validation:', error)
    toast({
      title: 'Erreur de validation',
      description: "Impossible de valider l'entraînement. Veuillez réessayer.",
      variant: 'destructive',
    })
  }
}

const checkBadgeUnlocks = async () => {
  if (!profile || !quest) {
    console.log('ℹ️ Pas de profil ou quête, skip badges')
    return
  }

  try {
    console.log('🏆 Début de la vérification des badges...')
    
    const { data: completedSessions, error: sessionsError } = await supabase
      .from('user_quests')
      .select('id')
      .eq('user_id', profile.user_id)
      .eq('status', 'completed')
    
    if (sessionsError) {
      console.warn('⚠️ Erreur lors de la récupération des sessions:', sessionsError)
      return
    }
    
    const completedCount = (completedSessions?.length || 0) + 1
    console.log(`📊 Nombre de quêtes complétées: ${completedCount}`)

    let badgesEarned = 0

    // Badge Novice (3 quêtes complétées)
    if (completedCount >= 3) {
      console.log('🔍 Vérification du badge novice...')
      const success = await unlockBadgeIfNotExists('novice-sans-cardio', 'Badge novice (3 quêtes)')
      if (success) badgesEarned++
    }

    // Badge Superset
    if (quest.title.toLowerCase().includes('superset')) {
      console.log('🔍 Vérification du badge superset...')
      const success = await unlockBadgeIfNotExists('superset-slayer', 'Badge superset slayer')
      if (success) badgesEarned++
    }

    // Badge Boss Final
    if (quest.title.toLowerCase().includes('boss final') || quest.type === 'boss') {
      console.log('🔍 Vérification du badge boss final...')
      const success = await unlockBadgeIfNotExists('boss-final-vaincu', 'Badge boss final')
      if (success) badgesEarned++
    }

    if (badgesEarned === 0) {
      console.log('ℹ️ Aucun nouveau badge débloqué pour cette quête')
    } else {
      console.log(`🎉 ${badgesEarned} nouveau(x) badge(s) débloqué(s) !`)
    }

  } catch (error) {
    console.warn('⚠️ Erreur dans checkBadgeUnlocks (non critique):', error)
    // Ne pas propager l'erreur pour ne pas bloquer la validation
  }
}

// Fonction helper pour débloquer un badge
const unlockBadgeIfNotExists = async (badgeSlug: string, badgeName: string): Promise<boolean> => {
  try {
    // 1. Récupérer le badge par son slug
    const { data: badge, error: badgeError } = await supabase
      .from('badges')
      .select('id, name')
      .eq('slug', badgeSlug)
      .maybeSingle()
    
    if (badgeError || !badge) {
      console.warn(`⚠️ Badge ${badgeSlug} non trouvé ou erreur:`, badgeError)
      return false
    }

    // 2. Vérifier si l'utilisateur a déjà ce badge
    const { data: existingBadge, error: checkError } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', profile!.user_id)
      .eq('badge_id', badge.id)
      .maybeSingle()

    if (checkError) {
      console.warn(`⚠️ Erreur lors de la vérification du badge ${badgeSlug}:`, checkError)
      return false
    }

    if (existingBadge) {
      console.log(`ℹ️ Badge ${badgeName} déjà possédé`)
      return false
    }

    // 3. Débloquer le badge
    const { error: insertError } = await supabase
      .from('user_badges')
      .insert({
        user_id: profile!.user_id,
        badge_id: badge.id,
        earned_at: new Date().toISOString()
      })
    
    if (insertError) {
      console.warn(`⚠️ Erreur lors du déblocage du badge ${badgeSlug}:`, insertError)
      return false
    }

    console.log(`🎉 Badge débloqué avec succès: ${badgeName}`)
    
    // Afficher une notification
    toast({
      title: "🏆 Nouveau badge !",
      description: `Vous avez débloqué: ${badge.name}`,
    })

    return true

  } catch (error) {
    console.warn(`⚠️ Erreur générale pour le badge ${badgeSlug}:`, error)
    return false
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
        // Force un rechargement complet de la page au lieu d'une simple navigation
        window.location.href = `/campaign/${campaign.slug}`
        return
      }
    }

    // Si on arrive ici, redirection par défaut avec rechargement
    window.location.href = '/campaign'
  } catch (error) {
    console.error('Erreur lors de la redirection:', error)
    window.location.href = '/campaign'
  }
}


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case 'simple': return 'Simple'
      case 'for_time': return 'For Time'
      case 'tabata': return 'Tabata'
      case 'amrap': return 'AMRAP'
      case 'emom': return 'EMOM'
      default: return type
    }
  }

  // ------------------------ RENDER ----------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">⚙️</div>
          <p className="text-muted-foreground">Préparation de l'entraînement...</p>
        </div>
      </div>
    )
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <p className="text-muted-foreground">Quête introuvable</p>
          <Button onClick={() => navigate('/campaign')}>Retour aux quêtes</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/campaign')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>{quest.type === 'boss' ? '👑' : '⚔️'}</span>
              {quest.title}
            </h1>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">{getWorkoutTypeLabel(quest.workout_type)}</Badge>
              {quest.type === 'boss' && (
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Boss Fight</Badge>
              )}
            </div>
          </div>
          <LevelDisplay variant="compact" className="hidden md:block" />
        </div>

        {/* Level Display Mobile */}
        <div className="md:hidden mb-4">
          <LevelDisplay variant="compact" />
        </div>

        {/* Countdown Overlay */}
        {countdown > 0 && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-8xl font-bold text-white animate-pulse">{countdown}</div>
              <p className="text-white text-xl mt-4">Prépare-toi !</p>
            </div>
          </div>
        )}

        {/* Timer & Controls */}
        <Card className="border-accent/30 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-mono">{formatTime(time)}</CardTitle>
            {quest.workout_type === 'tabata' && (
              <div className="space-y-2">
                <div className="text-lg font-semibold">{isWorkPhase ? '🔥 TRAVAIL' : '😌 REPOS'}</div>
                <div className="text-sm text-muted-foreground">Exercice: {quest.exercises[exerciseIndex]?.name}</div>
                <Progress
                  value={
                    isWorkPhase
                      ? ((workTime % (quest.work_seconds + quest.rest_seconds)) / (quest.work_seconds || 1)) * 100
                      : (((workTime % (quest.work_seconds + quest.rest_seconds)) - quest.work_seconds) / (quest.rest_seconds || 1)) * 100
                  }
                  className="h-2"
                />
              </div>
            )}
            {quest.workout_type === 'amrap' && (quest.total_minutes ?? 0) > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Temps restant: {formatTime(Math.max(quest.total_minutes! * 60 - time, 0))}
                </div>
                <Progress value={(time / (quest.total_minutes! * 60)) * 100} className="h-2" />
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-4">
              {!isRunning && time === 0 ? (
                <Button onClick={startWorkout} size="lg" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-5 h-5 mr-2" />
                  Commencer
                </Button>
              ) : !isRunning ? (
                <Button onClick={() => setIsRunning(true)} size="lg" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-5 h-5 mr-2" />
                  Reprendre
                </Button>
              ) : (
                <Button onClick={pauseWorkout} size="lg" variant="outline">
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}

              <Button onClick={resetWorkout} size="lg" variant="destructive">
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {time > 0 && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-lg">
                    Tours complétés: <span className="font-bold text-accent">{rounds}</span>
                    {quest.rounds_target > 0 && ` / ${quest.rounds_target}`}
                  </div>

                  <Button
                    onClick={addRound}
                    size="sm"
                    className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Round Times History */}
                {roundTimes.length > 0 && (
                  <Card className="mt-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        Temps par tour
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {roundTimes.map((roundTime) => (
                          <div key={roundTime.roundNumber} className="flex justify-between text-sm">
                            <span>Tour {roundTime.roundNumber}</span>
                            <span className="font-mono">{formatTime(roundTime.duration)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={finishWorkout} className="bg-purple-600 hover:bg-purple-700">
                  <Check className="w-4 h-4 mr-2" />
                  Terminer la séance
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercises List */}
        <Card>
          <CardHeader>
            <CardTitle>Exercices de la quête</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quest.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`p-3 rounded-lg border transition-all ${
                    quest.workout_type === 'tabata' && index === exerciseIndex
                      ? 'border-accent bg-accent/10'
                      : 'border-muted bg-muted/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{exercise.name}</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                            <Info className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{exercise.name}</DialogTitle>
                            <DialogDescription>Instructions pour bien réaliser l&apos;exercice</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            {exercise.target_reps > 0 && (
                              <div className="text-sm">
                                <strong>Répétitions cibles:</strong> {exercise.target_reps}
                              </div>
                            )}
                            {exercise.notes && (
                              <div className="text-sm">
                                <strong>Notes:</strong> {exercise.notes}
                              </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                              <strong>Conseils généraux:</strong>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Concentrez-vous sur la forme plutôt que la vitesse</li>
                                <li>Respirez de manière contrôlée</li>
                                <li>Engagez votre core</li>
                                <li>Arrêtez si vous ressentez une douleur</li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {exercise.target_reps > 0 && (
                      <span className="text-sm text-muted-foreground">{exercise.target_reps} reps</span>
                    )}
                  </div>
                  {exercise.notes && <p className="text-xs text-muted-foreground mt-1">{exercise.notes}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-xl">⚠️</div>
              <div className="space-y-1">
                <h4 className="font-semibold text-yellow-600">Conseils sécurité</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Échauffez-vous avant de commencer</li>
                  <li>• Hydratez-vous régulièrement</li>
                  <li>• Arrêtez en cas de douleur</li>
                  <li>• Respectez votre rythme</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Summary Dialog */}
        <Dialog open={showSummary} onOpenChange={setShowSummary}>
          <DialogContent className="max-w-md rpg-card">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">🎉 Séance terminée !</DialogTitle>
              <DialogDescription className="text-center">Félicitations pour cette séance !</DialogDescription>
            </DialogHeader>

            {sessionSummary && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">{formatTime(sessionSummary.totalTime)}</div>
                  <div className="text-muted-foreground">{sessionSummary.rounds} tours complétés</div>
                </div>

                <div className="space-y-3">
                  <div className="text-center text-muted-foreground">
                    Prêt à valider cette séance et gagner des récompenses RPG ?
                  </div>
                  <div className="text-sm text-center text-accent">⚡ Calcul automatique des XP et progression</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={validateWorkout}
                    className="flex-1 hero-gradient text-white font-semibold"
                    disabled={isProcessingRewards}
                  >
                    {isProcessingRewards ? 'Traitement...' : 'Valider et Progresser'}
                  </Button>
                  <Button
                    onClick={() => setShowSummary(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isProcessingRewards}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* RPG Rewards Modal */}
        <WorkoutRewardsModal
          isOpen={showRewardsModal}
          onClose={handleRewardsModalClose}
          rewards={rewardResults}
          sessionData={sessionSummary}
        />
      </div>
    </div>
  )
}
