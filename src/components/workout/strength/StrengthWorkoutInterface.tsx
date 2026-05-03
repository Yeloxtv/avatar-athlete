import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { supabase } from '@/integrations/supabase/client'
import { Quest, QuestExercise, WorkoutSession } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RewardResult } from '@/types/rpg'
import { useStrengthWorkout } from '@/hooks/useStrengthWorkout'
import { StrengthPerformanceInput } from '@/components/workout/StrengthPerformanceInput'
import WorkoutTimer from '@/components/workout/shared/WorkoutTimer'

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
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { processWorkoutRewards, isProcessingRewards } = useRpgProgress()
  
  const [showSummary, setShowSummary] = useState(false)
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardResults, setRewardResults] = useState<RewardResult | null>(null)

  // Hook pour musculation — session?.id peut changer après startWorkout, le hook se réinit via useEffect interne
  const strengthWorkout = useStrengthWorkout({
    exercises: quest?.exercises || [],
    sessionId: session?.id ?? '',
    restTimeSeconds: 60
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const finishWorkout = () => {
    setSessionSummary({
      rounds: 0, // Pour musculation, pas de rounds
      totalTime: time,
      questTitle: quest?.title,
    })
    setShowSummary(true)
  }

  const validateWorkout = async () => {
    if (!quest || !profile || !session || isProcessingRewards) return
    
    try {
      console.log('🔄 Début de la validation de l\'entraînement musculation...')
      
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
          rounds_completed: 0, // Musculation n'a pas de rounds
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
          intensity: 'MEDIUM', // Pour musculation, intensité moyenne par défaut
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
        
        const { error: nextQuestUnlockError } = await supabase
          .from('user_quests')
          .upsert({
            user_id: profile.id,
            quest_id: nextQuest.id,
            status: 'todo',
          }, {
            onConflict: 'user_id,quest_id'
          })

        if (nextQuestUnlockError) {
          console.error('❌ Erreur déblocage quête suivante:', nextQuestUnlockError)
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
        onAddRound={() => {}}
        isStrengthWorkout={true}
      />

      {/* Progression globale */}
      <Card className="border-accent/30">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm text-muted-foreground">
              {strengthWorkout.state.currentExerciseIndex + 1}/{quest.exercises.length} exercices
            </span>
          </div>
          <Progress value={strengthWorkout.progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Exercice en cours - OPTIMISÉ MOBILE */}
      {strengthWorkout.currentExercise && !strengthWorkout.isWorkoutComplete && (
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center text-base">
              <span className="truncate">{strengthWorkout.currentExercise.name}</span>
              <Badge variant="outline" className="bg-green-50 text-xs">
                {strengthWorkout.state.currentSet}/{strengthWorkout.totalSets}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Infos de l'exercice - GRID 2x2 MOBILE */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {strengthWorkout.currentExercise.target_reps}
                </div>
                <div className="text-xs text-muted-foreground">Reps cible</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {strengthWorkout.totalSets}
                </div>
                <div className="text-xs text-muted-foreground">Séries</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {strengthWorkout.currentExercise.target_weight ? 
                    `${strengthWorkout.currentExercise.target_weight}kg` : 
                    'Libre'
                  }
                </div>
                <div className="text-xs text-muted-foreground">Charge</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {(() => {
                    const prevPerf = strengthWorkout.getCurrentExercisePreviousPerformance()
                    if (!prevPerf) return 'Nouveau'
                    return `${prevPerf.reps_completed} à ${prevPerf.weight_used || 'PDC'}kg`
                  })()}
                </div>
                <div className="text-xs text-muted-foreground">Meilleure série</div>
              </div>
            </div>

            {/* Timer de repos */}
            {strengthWorkout.state.isResting ? (
              <Card className="border-blue-200/50 bg-muted/40">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-mono font-bold text-blue-600 mb-2">
                    {strengthWorkout.state.restTimer}s
                  </div>
                  <div className="text-sm text-blue-600/80 mb-3">Temps de repos</div>
                  <Progress 
                    value={strengthWorkout.exerciseRestTime > 0 ? (strengthWorkout.state.restTimer / strengthWorkout.exerciseRestTime) * 100 : 0} 
                    className="mb-3 bg-muted/60"
                  />
                  <Button 
                    onClick={strengthWorkout.skipRest} 
                    variant="outline"
                    size="sm"
                    className="border-blue-300/50 hover:bg-blue-50/50"
                  >
                    Passer le repos
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Saisie des performances - TAILLE RÉDUITE
              <div className="space-y-3">
                <StrengthPerformanceInput 
                  exercise={strengthWorkout.currentExercise}
                  onComplete={strengthWorkout.completeSet}
                  disabled={!strengthWorkout.canCompleteSet}
                />
              </div>
            )}

            {/* Historique des séries - COMPACT */}
            {strengthWorkout.currentExerciseLogs.length > 0 && (
              <Card className="border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Séries précédentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {strengthWorkout.currentExerciseLogs.map((log, index) => (
                    <div key={index} className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">Série {log.set_number}</span>
                      <span className="font-medium">
                        {log.reps_completed} @ {log.weight_used || 'PDC'}kg
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Liste de tous les exercices avec progression */}
      <Card className="border-accent/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span>📋</span>
            Exercices de la séance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quest.exercises.map((exercise, index) => {
            // Calculer le statut de l'exercice
            const isCurrentExercise = index === strengthWorkout.state.currentExerciseIndex
            const exerciseLogs = strengthWorkout.state.exerciseLogs.filter(log => log.exercise_id === exercise.id)
            const targetSets = exercise.sets_count || 3
            const completedSets = exerciseLogs.length
            const isCompleted = completedSets >= targetSets
            const isPrevious = index < strengthWorkout.state.currentExerciseIndex
            
            // Définir les styles selon le statut
            let cardClasses = "p-3 rounded-lg border transition-all duration-300"
            let statusIcon = ""
            let statusText = ""
            
            if (isCompleted || isPrevious) {
              cardClasses += " border-green-400/60 bg-muted/70 shadow-md ring-1 ring-green-400/30"
              statusIcon = "✅"
              statusText = `${completedSets}/${targetSets} séries - Terminé`
            } else if (isCurrentExercise) {
              cardClasses += " border-yellow-400 bg-muted/40 shadow-lg ring-2 ring-yellow-300/50"
              statusIcon = "🔥"
              statusText = `${completedSets}/${targetSets} séries - En cours`
            } else {
              cardClasses += " border-muted bg-muted/20"
              statusIcon = "⏳"
              statusText = `0/${targetSets} séries - À venir`
            }

            return (
              <div key={exercise.id} className={cardClasses}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{statusIcon}</span>
                      <h4 className={`font-medium text-sm ${isCurrentExercise ? 'text-yellow-600' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {exercise.name}
                      </h4>
                    </div>
                    
                    {/* Infos de l'exercice - COMPACT */}
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-muted-foreground">Reps: </span>
                        <span className="font-medium">{exercise.target_reps}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Poids: </span>
                        <span className="font-medium">
                          {exercise.target_weight ? `${exercise.target_weight}kg` : 'Libre'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Repos: </span>
                        <span className="font-medium">{exercise.rest_seconds || 60}s</span>
                      </div>
                    </div>
                    
                    {/* Progression des séries */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">Progression</span>
                        <span className="text-xs font-medium">{statusText}</span>
                      </div>
                      <Progress 
                        value={(completedSets / targetSets) * 100} 
                        className={`h-2 ${isCompleted ? '[&>div]:bg-green-400' : isCurrentExercise ? '[&>div]:bg-yellow-400' : ''}`}
                      />
                    </div>

                    {/* Détail des séries réalisées - COMPACT */}
                    {exerciseLogs.length > 0 && (
                      <div className="p-2 bg-muted/60 rounded border border-muted/40">
                        <div className="text-xs text-muted-foreground mb-1">Séries réalisées :</div>
                        <div className="flex flex-wrap gap-1">
                          {exerciseLogs.map((log, logIndex) => (
                            <span 
                              key={logIndex}
                              className="text-xs px-2 py-0.5 rounded font-medium bg-purple-600 text-white"
                            >
                              {log.reps_completed}@{log.weight_used || 'PDC'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Statistiques globales - COMPACT */}
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="grid grid-cols-2 gap-4 text-sm text-center">
              <div>
                <div className="text-lg font-bold text-accent">
                  {strengthWorkout.state.completedSets}
                </div>
                <div className="text-xs text-muted-foreground">Séries faites</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">
                  {quest.exercises.reduce((total, ex) => total + (ex.sets_count || 3), 0)}
                </div>
                <div className="text-xs text-muted-foreground">Séries prévues</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fin d'entraînement */}
      {strengthWorkout.isWorkoutComplete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-green-600 mb-4">🎉 Entraînement terminé !</h2>
            <Button 
              onClick={finishWorkout}
              className="bg-green-600 hover:bg-green-700"
            >
              Valider la séance
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Session Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-md mx-4 rpg-card">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Séance terminée !</DialogTitle>
            <DialogDescription className="text-center">
              Séance de musculation complétée !
            </DialogDescription>
          </DialogHeader>

          {sessionSummary && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-accent">
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
                  {isProcessingRewards ? '⏳ Traitement...' : '🚀 Valider la séance'}
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

      {/* Rewards Modal */}
      <Dialog open={showRewardsModal} onOpenChange={handleRewardsModalClose}>
        <DialogContent className="max-w-md mx-4 rpg-card">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Récompenses !</DialogTitle>
          </DialogHeader>
          
          {rewardResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    +{rewardResults.xpGained}
                  </div>
                  <div className="text-xs text-yellow-700">XP gagné</div>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    +{rewardResults.coinsGained}
                  </div>
                  <div className="text-xs text-green-700">Pièces</div>
                </div>
              </div>

              <Button
                onClick={handleRewardsModalClose}
                className="w-full bg-accent hover:bg-accent/90"
              >
                🏠 Retourner à la campagne
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}