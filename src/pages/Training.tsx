import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { supabase, Quest, QuestExercise, WorkoutSession } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface SessionSummary {
  rounds: number
  totalTime: number
  xpGained: {
    force: number
    endurance: number
    agilite: number
    mental: number
    total: number
  }
}

export default function Training() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
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
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (questId && profile) {
      fetchQuest()
    }
  }, [questId, profile])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1)
        
        if (quest?.workout_type === 'tabata') {
          setWorkTime(prev => {
            const newTime = prev + 1
            const cycleDuration = quest.work_seconds + quest.rest_seconds
            const currentCycleTime = newTime % cycleDuration
            
            if (currentCycleTime === 0 && newTime > 0) {
              setExerciseIndex(prev => (prev + 1) % quest.exercises.length)
              if ((newTime / cycleDuration) >= quest.rounds_target) {
                finishWorkout()
              }
            }
            
            setIsWorkPhase(currentCycleTime < quest.work_seconds)
            return newTime
          })
        } else if (quest?.workout_type === 'amrap' && quest.total_minutes > 0) {
          if (time >= quest.total_minutes * 60) {
            finishWorkout()
          }
        }
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, quest])

  const fetchQuest = async () => {
    if (!questId || !profile) return

    try {
      // Check if quest is available
      const { data: userQuest, error: userQuestError } = await supabase
        .from('user_quests')
        .select('status')
        .eq('user_id', profile.id)
        .eq('quest_id', questId)
        .single()

      if (userQuestError || userQuest?.status !== 'available') {
        toast({
          title: "Quête non disponible",
          description: "Cette quête n'est pas encore débloquée",
          variant: "destructive",
        })
        navigate('/campaign')
        return
      }

      // Fetch quest details
      const { data: questData, error: questError } = await supabase
        .from('quests')
        .select(`
          *,
          quest_exercises(*)
        `)
        .eq('id', questId)
        .single()

      if (questError) throw questError

      setQuest({
        ...questData,
        exercises: questData.quest_exercises || []
      })

      // Check for existing session
      const { data: existingSession } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', profile.id)
        .eq('quest_id', questId)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (existingSession) {
        setSession(existingSession)
        setTime(existingSession.total_time_seconds)
        setRounds(existingSession.rounds_completed)
        toast({
          title: "Session reprise",
          description: "Votre session précédente a été restaurée",
        })
      }

    } catch (error) {
      console.error('Error fetching quest:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger la quête",
        variant: "destructive",
      })
      navigate('/campaign')
    } finally {
      setLoading(false)
    }
  }

  const startCountdown = () => {
    setCountdown(3)
    const countdownInterval = setInterval(() => {
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
      if (!session) {
        const { data: newSession, error } = await supabase
          .from('workout_sessions')
          .insert({
            user_id: profile.id,
            quest_id: quest.id,
            workout_type: quest.workout_type,
          })
          .select()
          .single()

        if (error) throw error
        setSession(newSession)
      }

      startCountdown()
    } catch (error) {
      console.error('Error starting workout:', error)
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'entraînement",
        variant: "destructive",
      })
    }
  }

  const pauseWorkout = () => {
    setIsRunning(false)
    saveSession()
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
      await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', session.id)
      setSession(null)
    }
  }

  const addRound = async () => {
    const newRounds = rounds + 1
    setRounds(newRounds)
    setCurrentRound(newRounds + 1)

    if (session) {
      await supabase
        .from('session_rounds')
        .insert({
          session_id: session.id,
          round_no: newRounds,
          duration_seconds: time,
          reps_total: quest?.exercises.reduce((sum, ex) => sum + ex.target_reps, 0) || 0
        })

      saveSession()
    }
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
      xpGained: {
        force: quest?.xp_force || 0,
        endurance: quest?.xp_endurance || 0,
        agilite: quest?.xp_agilite || 0,
        mental: quest?.xp_mental || 0,
        total: quest?.xp_total || 0,
      }
    })
    setShowSummary(true)
  }

  const validateWorkout = async () => {
    if (!quest || !profile || !session) return

    try {
      // Mark session as completed
      await supabase
        .from('workout_sessions')
        .update({
          is_completed: true,
          ended_at: new Date().toISOString(),
          total_time_seconds: time,
          rounds_completed: rounds,
        })
        .eq('id', session.id)

      // Mark quest as completed
      await supabase
        .from('user_quests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('user_id', profile.id)
        .eq('quest_id', quest.id)

      // Update profile stats
      const newStats = {
        xp_total: profile.xp_total + quest.xp_total,
        stat_force: profile.stat_force + quest.xp_force,
        stat_endurance: profile.stat_endurance + quest.xp_endurance,
        stat_agilite: profile.stat_agilite + quest.xp_agilite,
        stat_mental: profile.stat_mental + quest.xp_mental,
      }

      await updateProfile(newStats)

      // Log XP audit
      await supabase
        .from('audit_xp')
        .insert({
          user_id: profile.id,
          quest_id: quest.id,
          delta_force: quest.xp_force,
          delta_endurance: quest.xp_endurance,
          delta_agilite: quest.xp_agilite,
          delta_mental: quest.xp_mental,
          delta_total: quest.xp_total,
        })

      // Unlock next quest
      const { data: nextQuest } = await supabase
        .from('quests')
        .select('id')
        .eq('campaign_id', quest.campaign_id)
        .eq('order_index', quest.order_index + 1)
        .single()

      if (nextQuest) {
        await supabase
          .from('user_quests')
          .update({ status: 'available' })
          .eq('user_id', profile.id)
          .eq('quest_id', nextQuest.id)
      }

      // Check for badge unlocks
      await checkBadgeUnlocks()

      toast({
        title: "🔥 Quête terminée !",
        description: `+${quest.xp_total} XP gagnés ! Nouvelle quête débloquée !`,
      })

      navigate('/campaign')

    } catch (error) {
      console.error('Error validating workout:', error)
      toast({
        title: "Erreur",
        description: "Impossible de valider l'entraînement",
        variant: "destructive",
      })
    }
  }

  const checkBadgeUnlocks = async () => {
    if (!profile || !quest) return

    // Check completed sessions count
    const { data: completedSessions } = await supabase
      .from('user_quests')
      .select('id')
      .eq('user_id', profile.id)
      .eq('status', 'completed')

    const completedCount = (completedSessions?.length || 0) + 1 // +1 for current quest

    // Check min_sessions badge
    if (completedCount >= 3) {
      const { data: badge } = await supabase
        .from('badges')
        .select('id')
        .eq('slug', 'novice-sans-cardio')
        .single()

      if (badge) {
        await supabase
          .from('user_badges')
          .upsert({
            user_id: profile.id,
            badge_id: badge.id
          })
      }
    }

    // Check superset badge
    if (quest.title.toLowerCase().includes('superset')) {
      const { data: badge } = await supabase
        .from('badges')
        .select('id')
        .eq('slug', 'superset-slayer')
        .single()

      if (badge) {
        await supabase
          .from('user_badges')
          .upsert({
            user_id: profile.id,
            badge_id: badge.id
          })
      }
    }

    // Check final boss badge
    if (quest.title.toLowerCase().includes('boss final')) {
      const { data: badge } = await supabase
        .from('badges')
        .select('id')
        .eq('slug', 'boss-final-vaincu')
        .single()

      if (badge) {
        await supabase
          .from('user_badges')
          .upsert({
            user_id: profile.id,
            badge_id: badge.id
          })
      }
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
          <Button onClick={() => navigate('/campaign')}>
            Retour aux quêtes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/campaign')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>{quest.type === 'boss' ? '👑' : '⚔️'}</span>
              {quest.title}
            </h1>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">
                {getWorkoutTypeLabel(quest.workout_type)}
              </Badge>
              {quest.type === 'boss' && (
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  Boss Fight
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Countdown Overlay */}
        {countdown > 0 && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-8xl font-bold text-white animate-pulse">
                {countdown}
              </div>
              <p className="text-white text-xl mt-4">Prépare-toi !</p>
            </div>
          </div>
        )}

        {/* Timer & Controls */}
        <Card className="border-accent/30 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-mono">
              {formatTime(time)}
            </CardTitle>
            {quest.workout_type === 'tabata' && (
              <div className="space-y-2">
                <div className="text-lg font-semibold">
                  {isWorkPhase ? '🔥 TRAVAIL' : '😌 REPOS'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Exercice: {quest.exercises[exerciseIndex]?.name}
                </div>
                <Progress 
                  value={isWorkPhase ? 
                    ((workTime % (quest.work_seconds + quest.rest_seconds)) / quest.work_seconds) * 100 :
                    (((workTime % (quest.work_seconds + quest.rest_seconds)) - quest.work_seconds) / quest.rest_seconds) * 100
                  } 
                  className="h-2" 
                />
              </div>
            )}
            {quest.workout_type === 'amrap' && quest.total_minutes > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Temps restant: {formatTime(quest.total_minutes * 60 - time)}
                </div>
                <Progress 
                  value={(time / (quest.total_minutes * 60)) * 100} 
                  className="h-2" 
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-4">
              {!isRunning && time === 0 ? (
                <Button 
                  onClick={startWorkout}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Commencer
                </Button>
              ) : !isRunning ? (
                <Button 
                  onClick={() => setIsRunning(true)}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Reprendre
                </Button>
              ) : (
                <Button 
                  onClick={pauseWorkout}
                  size="lg"
                  variant="outline"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button 
                onClick={resetWorkout}
                size="lg"
                variant="destructive"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {time > 0 && (
              <div className="text-center space-y-4">
                <div className="text-lg">
                  Tours complétés: <span className="font-bold text-accent">{rounds}</span>
                  {quest.rounds_target > 0 && ` / ${quest.rounds_target}`}
                </div>
                
                {(quest.workout_type === 'for_time' || quest.workout_type === 'amrap') && (
                  <Button 
                    onClick={addRound}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un tour
                  </Button>
                )}

                <Button 
                  onClick={finishWorkout}
                  className="bg-purple-600 hover:bg-purple-700"
                >
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
                    <span className="font-medium">{exercise.name}</span>
                    {exercise.target_reps > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {exercise.target_reps} reps
                      </span>
                    )}
                  </div>
                  {exercise.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {exercise.notes}
                    </p>
                  )}
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                🎉 Séance terminée !
              </DialogTitle>
              <DialogDescription className="text-center">
                Félicitations pour cette séance !
              </DialogDescription>
            </DialogHeader>
            
            {sessionSummary && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">
                    {formatTime(sessionSummary.totalTime)}
                  </div>
                  <div className="text-muted-foreground">
                    {sessionSummary.rounds} tours complétés
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">XP à gagner :</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sessionSummary.xpGained.force > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>💪</span>
                        <span className="text-red-500">+{sessionSummary.xpGained.force} Force</span>
                      </div>
                    )}
                    {sessionSummary.xpGained.endurance > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>🏃</span>
                        <span className="text-green-500">+{sessionSummary.xpGained.endurance} Endurance</span>
                      </div>
                    )}
                    {sessionSummary.xpGained.agilite > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>⚡</span>
                        <span className="text-blue-500">+{sessionSummary.xpGained.agilite} Agilité</span>
                      </div>
                    )}
                    {sessionSummary.xpGained.mental > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>🧠</span>
                        <span className="text-purple-500">+{sessionSummary.xpGained.mental} Mental</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center font-bold text-lg border-t pt-2">
                    Total: +{sessionSummary.xpGained.total} XP
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={validateWorkout}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Valider et gagner l'XP
                  </Button>
                  <Button 
                    onClick={() => setShowSummary(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}