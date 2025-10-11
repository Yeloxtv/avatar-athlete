import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { supabase, Quest, QuestExercise, WorkoutSession } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { WorkoutRewardsModal } from '@/components/ui/workout-rewards-modal'
import { RewardResult } from '@/types/rpg'
import WorkoutTimer from '@/components/workout/shared/WorkoutTimer'
import { Plus, Minus } from 'lucide-react'

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
  roundTimes: RoundTime[]  // ← AJOUTER
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onNextExercise: () => void
  onPrevExercise: () => void
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
  roundTimes,  // ← AJOUTER
  onStart,
  onPause,
  onReset,
  onNextExercise,
  onPrevExercise,
  onAddRound,
  onFinishWorkout
}: HiitWorkoutInterfaceProps) {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { processWorkoutRewards, isProcessingRewards } = useRpgProgress()
  
  const [showSummary, setShowSummary] = useState(false)
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardResults, setRewardResults] = useState<RewardResult | null>(null)
  const [roundTimesState, setRoundTimesState] = useState<RoundTime[]>(roundTimes)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const finishWorkout = () => {
    setSessionSummary({
      rounds: totalRounds,
      totalTime: time,
      questTitle: quest?.title,
    })
    setShowSummary(true)
  }

  const validateWorkout = async () => {
    if (!quest || !profile || !session || isProcessingRewards) return
    
    try {
      console.log('🔄 Début de la validation de l\'entraînement HIIT...')
      
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
          rounds_completed: totalRounds,
        })
        .eq('id', session.id)

      if (sessionError) {
        console.error('❌ Erreur session:', sessionError)
        throw sessionError
      }

      // 2. Marquer la quête comme terminée avec UPSERT
      console.log('✅ Mise à jour du statut de la quête...')
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

      // 3. Calculer les récompenses
      console.log('🎁 Calcul des récompenses...')
      let rewards = null
      try {
        rewards = await processWorkoutRewards({
          durationMin: Math.ceil(time / 60),
          workoutType: quest.workout_type,
          intensity: 'HIGH', // HIIT est généralement intensif
        })

        if (rewards) {
          setRewardResults(rewards)
          setTimeout(() => setShowRewardsModal(true), 500)
        }
      } catch (rewardError) {
        console.warn('⚠️ Erreur lors du calcul des récompenses (non bloquant):', rewardError)
      }

      // 4. Enregistrer l'audit XP
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

      // 5. Débloquer la quête suivante
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
          window.location.href = `/campaign/${campaign.slug}`
          return
        }
      }
      window.location.href = '/campaign'
    } catch (error) {
      console.error('Erreur lors de la redirection:', error)
      window.location.href = '/campaign'
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
        isStrengthWorkout={false}
        quest={quest}
        workTime={workTime}
        isWorkPhase={isWorkPhase}
        exerciseName={quest.exercises[exerciseIndex]?.name}
        currentRound={currentRound}
        onAddRound={onAddRound}
        onFinishWorkout={onFinishWorkout}
        roundTimes={roundTimes}         // ← AJOUTER
      />

      {/* Liste des exercices - Style cohérent avec musculation */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span>
            Circuit d'exercices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quest.exercises.map((exercise, index) => {
            const isCurrentExercise = index === exerciseIndex
            const isCompleted = false // Pour HIIT, pas de notion de "complété"
            const isPrevious = false
            
            // Style cohérent avec musculation
            let cardClasses = "p-4 rounded-lg border transition-all duration-300"
            let statusIcon = ""
            let statusText = ""
            
            if (isCurrentExercise) {
              cardClasses += " border-accent bg-accent/5 shadow-md ring-2 ring-accent/20"
              statusIcon = "🔥"
              statusText = "En cours"
            } else {
              cardClasses += " border-muted bg-muted/20"
              statusIcon = "⏳"
              statusText = "En attente"
            }

            return (
              <div key={exercise.id} className={cardClasses}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{statusIcon}</span>
                      <h4 className={`font-medium ${isCurrentExercise ? 'text-accent' : 'text-foreground'}`}>
                        {exercise.name}
                      </h4>
                    </div>
                    
                    {/* Description si disponible */}
                    {exercise.description && (
                      <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                    )}
                    
                    {/* Infos de l'exercice pour HIIT */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Position: </span>
                        <span className="font-medium">{index + 1}/{quest.exercises.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Statut: </span>
                        <span className={`font-medium ${isCurrentExercise ? 'text-accent' : 'text-muted-foreground'}`}>
                          {statusText}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Badge de statut */}
                  {isCurrentExercise && (
                    <Badge className="bg-accent/20 text-accent border-accent/30 animate-pulse">
                      {statusIcon} {statusText}
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
          
          {/* Statistiques globales du circuit */}
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {quest.exercises.length}
                </div>
                <div className="text-muted-foreground">Exercices</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {exerciseIndex + 1}
                </div>
                <div className="text-muted-foreground">En cours</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {quest.exercises.length - exerciseIndex - 1}
                </div>
                <div className="text-muted-foreground">Restants</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-md rpg-card">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">🎉 Entraînement terminé !</DialogTitle>
            <DialogDescription className="text-center">Félicitations pour cette séance HIIT !</DialogDescription>
          </DialogHeader>

          {sessionSummary && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">{formatTime(sessionSummary.totalTime)}</div>
                <div className="text-muted-foreground">{sessionSummary.rounds} rounds complétés</div>
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
  )
}