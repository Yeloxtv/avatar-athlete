// FILE: src/pages/Training.tsx  (REMPLACEMENT COMPLET DU FICHIER)

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { supabase, Quest, QuestExercise, WorkoutSession } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { WorkoutRewardsModal } from '@/components/ui/workout-rewards-modal'
import { useStrengthWorkout } from '@/hooks/useStrengthWorkout'
import { useWorkoutValidation } from '@/hooks/useWorkoutValidation'
import { useWorkoutSession } from '@/hooks/useWorkoutSession'
import { useHiitTimer } from '@/hooks/useHiitTimer'
import WorkoutHeader from '@/components/workout/shared/WorkoutHeader'
import StrengthWorkoutInterface from '@/components/workout/strength/StrengthWorkoutInterface'
import HiitWorkoutInterface from '@/components/workout/hiit/HiitWorkoutInterface'
import SessionSummaryModal from '@/components/workout/SessionSummaryModal'


export default function Training() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()

  const [quest, setQuest] = useState<(Quest & { exercises: QuestExercise[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(0)
  
  // ✨ NOUVEAUX STATES pour le récapitulatif
  const [showSessionSummary, setShowSessionSummary] = useState(false)

  // Détection du type d'entraînement
  const isStrengthWorkout = quest?.workout_type === 'strength'

  // 🎯 HOOKS MÉTIER
  const workoutSession = useWorkoutSession({ quest })
  const workoutValidation = useWorkoutValidation({
    quest,
    session: workoutSession.session,
    time: workoutSession.time,
    rounds: workoutSession.rounds
  })
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
    restTimeSeconds: 60
  })

  // ------------------------ LOAD QUEST ------------------------
  useEffect(() => {
    if (questId && profile?.user_id) {
      void fetchQuest()
    }
  }, [questId, profile?.user_id])

  const fetchQuest = async () => {
    if (!questId || !profile?.user_id) return
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

      // 🏋️ Pour musculation : utiliser le hook pour créer la session
      if (questData.workout_type === 'strength') {
        console.log('🏋️ Création session musculation via hook...')
        // Pas besoin de créer manuellement, on utilisera startWorkout du hook
      } else {
        // Pour HIIT : vérifier session existante
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
            // Pour HIIT, on peut restaurer la session
            console.log('📱 Session HIIT existante trouvée, restauration...')
            // La logique de restauration sera gérée par le hook
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
    const countdownInterval = window.setInterval(() => {
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
      // Mise à jour user_quests
      const { error: updateError } = await supabase
        .from('user_quests')
        .update({ status: 'available' })
        .eq('user_id', profile.user_id)
        .eq('quest_id', quest.id)

      if (updateError) {
        await supabase
          .from('user_quests')
          .insert({
            user_id: profile.user_id,
            quest_id: quest.id,
            status: 'available',
          })
      }

      // 🏋️ Pour musculation : créer session via hook
      if (isStrengthWorkout) {
        console.log('🏋️ Démarrage musculation avec création de session...')
        await workoutSession.startWorkout() // Crée la session automatiquement
        toast({
          title: "Séance de musculation démarrée",
          description: "Bonne séance ! Le timer est lancé.",
        })
      } else {
        // ⚡ Pour HIIT : countdown
        await workoutSession.startWorkout()
        startCountdown()
      }
    } catch (error) {
      console.error('Error starting workout:', error)
      toast({
        title: 'Erreur',
        description: "Impossible de démarrer l'entraînement",
        variant: 'destructive',
      })
    }
  }

  const finishWorkout = async () => {
    console.log('🏁 finishWorkout appelée dans Training.tsx')
    
    // Arrêter le workout
    workoutSession.setIsRunning(false)
    
    // Sauvegarder la session avant de naviguer
    if (workoutSession.session) {
      try {
        await supabase
          .from('workout_sessions')
          .update({
            total_time_seconds: workoutSession.time,
            rounds_completed: workoutSession.rounds,
            updated_at: new Date().toISOString(),
          })
          .eq('id', workoutSession.session.id)
      } catch (error) {
        console.warn('⚠️ Erreur sauvegarde session:', error)
      }
    }
    
    // Naviguer vers la page de récapitulatif
    console.log('🚀 Navigation vers le récapitulatif...')
    navigate(`/training/${questId}/summary`)
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
          <Button onClick={() => navigate('/campaign')}>Retour aux quêtes</Button>
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
            onBack={() => navigate('/campaign')} 
            showLevelDisplay={false}
          />

          <StrengthWorkoutInterface
            quest={quest}
            session={workoutSession.session}
            time={workoutSession.time}
            isRunning={workoutSession.isRunning}
            onStart={startWorkout}
            onPause={workoutSession.pauseWorkout}
            onReset={workoutSession.resetWorkout}
            onFinishWorkout={finishWorkout}
          />

          <WorkoutRewardsModal
            isOpen={workoutValidation.showRewardsModal}
            onClose={workoutValidation.handleRewardsModalClose}
            rewards={workoutValidation.rewardResults}
            sessionData={{
              rounds: workoutSession.rounds,
              totalTime: workoutSession.time,
              questTitle: quest?.title
            }}
          />
        </div>
      </div>
    )
  }

  // ⚡ Interface HIIT
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <WorkoutHeader 
          quest={quest} 
          onBack={() => navigate('/campaign')} 
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
          totalRounds={quest.rounds || 1} // ← S'assurer qu'on passe le bon nombre de tours
          roundTimes={hiitTimer.roundTimes}
          onStart={startWorkout}
          onPause={workoutSession.pauseWorkout}
          onReset={workoutSession.resetWorkout}
          onAddRound={hiitTimer.addRound}
          onFinishWorkout={finishWorkout}
        />

        {/* RPG Rewards Modal - Affichage après validation */}
        <WorkoutRewardsModal
          isOpen={workoutValidation.showRewardsModal}
          onClose={workoutValidation.handleRewardsModalClose}
          rewards={workoutValidation.rewardResults}
          sessionData={{
            rounds: workoutSession.rounds,
            totalTime: workoutSession.time,
            questTitle: quest?.title
          }}
        />
      </div>
    </div>
  )
}
