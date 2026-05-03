import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { supabase } from '@/integrations/supabase/client'
import { Quest, QuestExercise, WorkoutSession } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { WorkoutRewardsModal } from '@/components/ui/workout-rewards-modal'
import { RewardResult } from '@/types/rpg'
import WorkoutTimer from '@/components/workout/shared/WorkoutTimer'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Plus, CheckCircle } from 'lucide-react'

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
      rounds: quest.workout_type === 'amrap' ? currentRound : 1, // Rounds seulement pour AMRAP
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
          rounds_completed: currentRound,  // ← Utiliser currentRound
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
          user_id: profile.id,
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
          user_id: profile.id,
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
            user_id: profile.id,
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

  return (
    <div className="space-y-6">
      <WorkoutTimer
        time={time}
        isRunning={isRunning}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        onFinishWorkout={onFinishWorkout}
        onAddRound={onAddRound}
        isStrengthWorkout={false}
        quest={quest}
        workTime={workTime}
        isWorkPhase={isWorkPhase}
        exerciseName={quest.exercises[exerciseIndex]?.name || ''}
        currentRound={currentRound}
        totalRounds={totalRounds} // ← AJOUTER cette prop
        exerciseIndex={exerciseIndex}
      />

      {/* Liste des exercices - Version mobile ultra-compacte */}
      <Card className="border-accent/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>Circuit ({quest.exercises.length} exercices)</span>
            </div>
            
            {/* Temps défini pour l'entraînement */}
            {quest.total_minutes && quest.total_minutes > 0 && (
              <div className="text-sm font-normal text-muted-foreground">
                {quest.total_minutes} min
              </div>
            )}
            
            {/* Pour Tabata : afficher work/rest */}
            {quest.workout_type === 'tabata' && quest.work_seconds && quest.rest_seconds && (
              <div className="text-sm font-normal text-muted-foreground">
                {quest.work_seconds}s / {quest.rest_seconds}s
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quest.exercises.map((exercise, index) => {
            const isCurrentExercise = index === exerciseIndex
            
            return (
              <div 
                key={exercise.id} 
                className={`p-2 rounded border transition-all ${
                  isCurrentExercise 
                    ? 'border-accent bg-accent/5 shadow-sm' 
                    : 'border-muted/40 bg-muted/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm">
                      {isCurrentExercise ? '🔥' : index < exerciseIndex ? '✅' : '⏳'}
                    </span>
                    <span className={`text-sm truncate ${
                      isCurrentExercise ? 'font-medium text-accent' : 'text-muted-foreground'
                    }`}>
                      {exercise.name}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground shrink-0">
                    {index + 1}/{quest.exercises.length}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Stats mini en bas - Avec infos timing */}
          <div className="mt-3 p-2 bg-accent/5 rounded border border-accent/20">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm font-bold text-accent">{exerciseIndex + 1}</div>
                <div className="text-xs text-muted-foreground">Actuel</div>
              </div>
              <div>
                <div className="text-sm font-bold text-accent">{quest.exercises.length - exerciseIndex - 1}</div>
                <div className="text-xs text-muted-foreground">Restants</div>
              </div>
              <div>
                {quest.workout_type === 'amrap' ? (
                  <>
                    <div className="text-sm font-bold text-accent">{currentRound}</div>
                    <div className="text-xs text-muted-foreground">Rounds</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-accent">{formatTime(time)}</div>
                    <div className="text-xs text-muted-foreground">Écoulé</div>
                  </>
                )}
              </div>
            </div>
            
            {/* Ligne d'infos supplémentaires selon le type */}
            {(quest.total_minutes && quest.total_minutes > 0) || (quest.workout_type === 'tabata') ? (
              <div className="mt-2 pt-2 border-t border-accent/20 text-xs text-center text-muted-foreground">
                {quest.workout_type === 'amrap' && quest.total_minutes && (
                  <span>Objectif: {quest.total_minutes} minutes • </span>
                )}
                {quest.workout_type === 'tabata' && quest.work_seconds && quest.rest_seconds && (
                  <span>Format: {quest.work_seconds}s travail / {quest.rest_seconds}s repos</span>
                )}
                {quest.workout_type === 'circuit' && quest.total_minutes && (
                  <span>Durée estimée: {quest.total_minutes} minutes</span>
                )}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Session Summary Dialog - Version mobile */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-sm mx-2 rpg-card">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">🎉 Terminé !</DialogTitle>
            <DialogDescription className="text-center text-sm">
              Séance HIIT complétée !
            </DialogDescription>
          </DialogHeader>

          {sessionSummary && (
            <div className="space-y-4">
              
              {/* Stats compactes - Adaptées selon le type */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-accent/5 rounded">
                  <div className="text-lg font-bold text-accent">
                    {formatTime(sessionSummary.totalTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">Temps total</div>
                </div>
                <div className="p-2 bg-accent/5 rounded">
                  <div className="text-lg font-bold text-accent">
                    {quest.workout_type === 'amrap' ? sessionSummary.rounds : quest.exercises.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {quest.workout_type === 'amrap' ? 'Rounds' : 'Exercices'}
                  </div>
                </div>
              </div>

              {/* Message motivant */}
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Prêt à valider et gagner des XP ?
                </div>
                <div className="text-xs text-accent">⚡ Progression automatique</div>
              </div>

              {/* Boutons mobiles */}
              <div className="space-y-2">
                <Button
                  onClick={validateWorkout}
                  className="w-full bg-accent hover:bg-accent/90 h-12"
                  disabled={isProcessingRewards}
                >
                  {isProcessingRewards ? '⏳ Traitement...' : '🚀 Valider la séance'}
                </Button>
                <Button
                  onClick={() => setShowSummary(false)}
                  variant="outline"
                  className="w-full h-12"
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