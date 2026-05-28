import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Quest, QuestExercise, WorkoutSession } from '@/types/workout'
import { useWorkoutSessionContext } from '@/contexts/WorkoutSessionContext'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useStrengthWorkout } from '@/hooks/useStrengthWorkout'
import { useWorkoutSession } from '@/hooks/useWorkoutSession'
import { useHiitTimer } from '@/hooks/useHiitTimer'
import WorkoutHeader from '@/components/workout/shared/WorkoutHeader'
import StrengthWorkoutInterface from '@/components/workout/strength/StrengthWorkoutInterface'
import HiitWorkoutInterface from '@/components/workout/hiit/HiitWorkoutInterface'
import AmrapWorkoutInterface from '@/components/workout/hiit/AmrapWorkoutInterface'


export default function Training() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { user } = useAuth()
  const { startLiveSession, updateLiveSession, clearLiveSession } = useWorkoutSessionContext()

  const [quest, setQuest] = useState<(Quest & { exercises: QuestExercise[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [showSessionSummary, setShowSessionSummary] = useState(false)
  const [finisherQuestId, setFinisherQuestId] = useState<string | null>(null)
  const [showFinisherDialog, setShowFinisherDialog] = useState(false)

  // Détection du type d'entraînement
  const isStrengthWorkout = quest?.workout_type === 'strength'

  // 🎯 HOOKS MÉTIER
  const workoutSession = useWorkoutSession({ quest })
  const hiitTimer = useHiitTimer({
    quest,
    isStrengthWorkout,
    isRunning: workoutSession.isRunning,
    time: workoutSession.time,
    setTime: workoutSession.setTime,
    workTime: workoutSession.workTime,
    setWorkTime: workoutSession.setWorkTime
  })
  
  // Hook musculation (TOUJOURS appelé)
  const strengthWorkout = useStrengthWorkout({
    exercises: isStrengthWorkout ? (quest?.exercises || []) : [],
    sessionId: workoutSession.session?.id || '',
    restTimeSeconds: 60,
  })

  // Sync la LiveWorkoutBar quand l'état strength est restauré depuis Supabase
  useEffect(() => {
    if (!quest || !isStrengthWorkout) return
    const exercises = quest.exercises ?? []
    const idx = strengthWorkout.state.currentExerciseIndex
    updateLiveSession({
      currentExerciseName: exercises[idx]?.name ?? '',
      currentExerciseIndex: idx,
      progressPercentage: strengthWorkout.progressPercentage,
      totalExercises: exercises.length,
    })
  }, [strengthWorkout.state.currentExerciseIndex, strengthWorkout.progressPercentage])

  // ------------------------ LOAD QUEST ------------------------
  useEffect(() => {
    if (questId && profile?.id && user?.id) {
      void fetchQuest()
    }
  }, [questId, profile?.id, user?.id])

  const fetchQuest = async () => {
    if (!questId || !profile?.id || !user?.id) return
    try {
      const { data: questRows, error: questError } = await supabase
        .from('quests')
        .select(`
          *,
          quest_exercises(
            id,
            name,
            target_reps,
            order_index,
            notes,
            sets_count,
            target_weight,
            rest_seconds
          )
        `)
        .eq('id', questId)
        .limit(1)
      
      if (questError) throw questError
      const row = questRows?.[0]
      if (!row) throw new Error('Quest not found')

      const questData = {
        ...row,
        exercises: row.quest_exercises ?? []
      }

      setQuest(questData)

      if (questData.workout_type !== 'strength') {
        // Créer la session HIIT au chargement
        const { data: newSession } = await supabase
          .from('workout_sessions')
          .insert({
            user_id: user.id,
            quest_id: questId,
            workout_type: questData.workout_type,
            started_at: new Date().toISOString(),
            is_completed: false,
            total_time_seconds: 0,
            rounds_completed: 0,
          })
          .select()
          .single()

        if (newSession) {
          workoutSession.setSession(newSession)
          startLiveSession({
            sessionId: newSession.id,
            questId: questId!,
            questTitle: questData.title,
            currentExerciseName: questData.exercises[0]?.name ?? '',
            currentExerciseIndex: 0,
            totalExercises: questData.exercises.length,
            progressPercentage: 0,
          })
        }
      }

      if (questData.workout_type === 'strength') {
        // Réutiliser la session incomplète existante si elle existe
        const { data: existingSession } = await supabase
          .from('workout_sessions')
          .select()
          .eq('user_id', user.id)
          .eq('quest_id', questId)
          .eq('is_completed', false)
          .order('started_at', { ascending: false })
          .limit(1)
          .single()

        if (existingSession) {
          workoutSession.setSession(existingSession)
          // Restaurer le chrono depuis la session sauvegardée
          workoutSession.setTime(existingSession.total_time_seconds ?? 0)
          workoutSession.setIsRunning(true)
          startLiveSession({
            sessionId: existingSession.id,
            questId: questId!,
            questTitle: questData.title,
            currentExerciseName: questData.exercises[0]?.name ?? '',
            currentExerciseIndex: 0,
            totalExercises: questData.exercises.length,
            progressPercentage: 0,
          })
        } else {
          const { data: newSession, error: sessErr } = await supabase
            .from('workout_sessions')
            .insert({
              user_id: user.id,
              quest_id: questId,
              workout_type: 'strength',
              started_at: new Date().toISOString(),
              is_completed: false,
              total_time_seconds: 0,
              rounds_completed: 0,
            })
            .select()
            .single()

          if (!sessErr && newSession) {
            workoutSession.setSession(newSession)
            workoutSession.setIsRunning(true)
            startLiveSession({
              sessionId: newSession.id,
              questId: questId!,
              questTitle: questData.title,
              currentExerciseName: questData.exercises[0]?.name ?? '',
              currentExerciseIndex: 0,
              totalExercises: questData.exercises.length,
              progressPercentage: 0,
            })
          }
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
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          workoutSession.setIsRunning(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startWorkout = async () => {
    if (!quest || !profile) return
    try {
      await workoutSession.startWorkout()
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

  const cancelWorkout = async () => {
    workoutSession.setIsRunning(false)
    if (workoutSession.session) {
      try {
        await supabase
          .from('workout_sessions')
          .delete()
          .eq('id', workoutSession.session.id)
      } catch (error) {
        console.warn('⚠️ Erreur annulation session:', error)
      }
    }
    clearLiveSession()
    navigate('/')
  }

  const finishWorkout = async () => {
    workoutSession.setIsRunning(false)

    if (workoutSession.session) {
      try {
        await supabase
          .from('workout_sessions')
          .update({
            is_completed: true,
            ended_at: new Date().toISOString(),
            total_time_seconds: workoutSession.time,
            rounds_completed: workoutSession.rounds,
          })
          .eq('id', workoutSession.session.id)
      } catch (error) {
        console.warn('⚠️ Erreur sauvegarde session:', error)
      }
    }

    clearLiveSession()

    // Check for a finisher quest only after a strength workout
    if (quest?.workout_type === 'strength' && quest?.day_of_week != null && quest?.campaign_id) {
      try {
        const { data: finisher } = await supabase
          .from('quests')
          .select('id')
          .eq('campaign_id', quest.campaign_id)
          .eq('day_of_week', quest.day_of_week)
          .in('workout_type', ['amrap', 'emom', 'tabata'])
          .limit(1)
          .maybeSingle()

        if (finisher?.id) {
          setFinisherQuestId(finisher.id)
          setShowFinisherDialog(true)
          return
        }
      } catch { /* silencieux */ }
    }

    navigate(`/train/${questId}/summary`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
          <Button onClick={() => navigate('/')}>Retour aux quêtes</Button>
        </div>
      </div>
    )
  }

  // 🏋️ Interface Musculation
  if (isStrengthWorkout && quest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <WorkoutHeader 
            quest={quest} 
            onBack={() => navigate('/')} 
            showLevelDisplay={false}
          />

          <StrengthWorkoutInterface
            quest={quest}
            session={workoutSession.session}
            time={workoutSession.time}
            isRunning={workoutSession.isRunning}
            strengthWorkout={strengthWorkout}
            onStart={startWorkout}
            onPause={workoutSession.pauseWorkout}
            onReset={workoutSession.resetWorkout}
            onFinishWorkout={finishWorkout}
            onCancelWorkout={cancelWorkout}
          />

          <Dialog open={showFinisherDialog} onOpenChange={setShowFinisherDialog}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Finisher disponible</DialogTitle>
                <DialogDescription>
                  Un finisher HIIT est prévu pour cette séance. Tu veux l'enchaîner maintenant ?
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                <Button
                  onClick={() => {
                    setShowFinisherDialog(false)
                    navigate(`/train/${finisherQuestId}`)
                  }}
                >
                  Lancer le finisher
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFinisherDialog(false)
                    navigate(`/train/${questId}/summary`)
                  }}
                >
                  Passer, aller au résumé
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  // ⚡ Interface AMRAP dédiée
  if (quest.workout_type === 'amrap') {
    return (
      <AmrapWorkoutInterface
        quest={quest}
        session={workoutSession.session}
        time={workoutSession.time}
        isRunning={workoutSession.isRunning}
        currentRound={hiitTimer.currentRound}
        onStart={startWorkout}
        onPause={workoutSession.pauseWorkout}
        onAddRound={hiitTimer.addRound}
        onFinishWorkout={finishWorkout}
      />
    )
  }

  // ⚡ Interface HIIT (tabata, emom, circuit…)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <WorkoutHeader
          quest={quest}
          onBack={() => navigate('/')}
          showLevelDisplay={true}
        />

        <HiitWorkoutInterface
          quest={quest}
          session={workoutSession.session}
          time={workoutSession.time}
          isRunning={workoutSession.isRunning}
          workTime={hiitTimer.workTime}
          exerciseIndex={hiitTimer.exerciseIndex}
          isWorkPhase={hiitTimer.isWorkPhase}
          currentRound={hiitTimer.currentRound}
          totalRounds={quest.rounds || 1}
          roundTimes={hiitTimer.roundTimes}
          liveXp={hiitTimer.liveXp}
          onStart={startWorkout}
          onPause={workoutSession.pauseWorkout}
          onReset={workoutSession.resetWorkout}
          onAddRound={hiitTimer.addRound}
          onFinishWorkout={finishWorkout}
        />

      </div>
    </div>
  )
}
