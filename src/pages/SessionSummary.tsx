import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useSessionSummary } from '@/hooks/useSessionSummary'
import { useWorkoutValidation } from '@/hooks/useWorkoutValidation'
import { supabase, Quest, WorkoutSession } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { WorkoutRewardsModal } from '@/components/ui/workout-rewards-modal'
import { ArrowLeft, Clock, TrendingUp, Trophy, Zap, Target, Star, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function SessionSummary() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()

  const [quest, setQuest] = useState<Quest | null>(null)
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [isValidating, setIsValidating] = useState(false)

  // Hook pour le récapitulatif
  const { 
    summary, 
    loading: summaryLoading, 
    generateSummary, 
    formatVolume, 
    getIntensityEmoji, 
    getProgressionMessage 
  } = useSessionSummary({ quest, session, time: session?.total_time_seconds || 0 })

  // Hook pour la validation (après génération du récap)
  const workoutValidation = useWorkoutValidation({
    quest,
    session,
    time: session?.total_time_seconds || 0,
    rounds: session?.rounds_completed || 0
  })

  // Récupérer les données de session depuis sessionStorage ou API
  useEffect(() => {
    const loadSessionData = async () => {
      if (!questId || !profile?.user_id) return

      try {
        // 1. Récupérer la quest
        const { data: questData, error: questError } = await supabase
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
          .single()

        if (questError) throw questError
        
        const questWithExercises = {
          ...questData,
          exercises: questData.quest_exercises || []
        }
        setQuest(questWithExercises)

        // 2. Récupérer la session la plus récente pour cette quest
        const { data: sessionData, error: sessionError } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', profile.user_id)
          .eq('quest_id', questId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (sessionError) throw sessionError
        setSession(sessionData)

        console.log('✅ Données de session chargées:', { quest: questWithExercises, session: sessionData })

      } catch (error) {
        console.error('❌ Erreur chargement session:', error)
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données de la séance',
          variant: 'destructive',
        })
        navigate('/campaign')
      } finally {
        setLoading(false)
      }
    }

    loadSessionData()
  }, [questId, profile?.user_id, navigate])

  // Générer le récapitulatif dès que les données sont disponibles
  useEffect(() => {
    if (quest && session && !summaryLoading && !summary) {
      console.log('🚀 Génération automatique du récapitulatif...')
      generateSummary()
    }
  }, [quest, session, summaryLoading, summary, generateSummary])

  const handleValidate = async () => {
    if (!quest || !session) return

    setIsValidating(true)
    console.log('✅ Validation depuis le récapitulatif...')
    
    try {
      await workoutValidation.validateWorkout()
    } catch (error) {
      console.error('❌ Erreur validation:', error)
      toast({
        title: 'Erreur de validation',
        description: 'Une erreur est survenue lors de la validation',
        variant: 'destructive',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleBack = () => {
    navigate(`/training/${questId}`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
          <p className="text-muted-foreground">Chargement du récapitulatif...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (!quest || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <p className="text-muted-foreground">Données de séance introuvables</p>
          <Button onClick={() => navigate('/campaign')}>Retour aux quêtes</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Récapitulatif de séance</h1>
            <p className="text-muted-foreground">{quest.title}</p>
          </div>
        </div>

        {/* Loading Summary */}
        {summaryLoading && (
          <Card className="border-accent/30">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Génération du récapitulatif...</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Content */}
        {summary && (
          <div className="space-y-6">
            
            {/* Header - Félicitations - Style cohérent */}
            <Card className="border-accent/30">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="text-2xl font-bold mb-2">
                  Séance terminée !
                </h2>
                <p className="text-muted-foreground mb-6">
                  {quest.title} • {formatTime(summary.totalTime)}
                </p>
                
                {/* Stats rapides - Grid propre */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-bold text-accent">
                      {formatTime(summary.totalTime)}
                    </div>
                    <div className="text-xs text-muted-foreground">Temps</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <Target className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-bold text-accent">
                      {formatVolume(summary.totalVolume)}
                    </div>
                    <div className="text-xs text-muted-foreground">Volume</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <Trophy className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <div className="text-lg font-bold text-accent">
                      {summary.exercises.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Exercices</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl mb-1">
                      {getIntensityEmoji(summary.intensity)}
                    </div>
                    <div className="text-sm font-medium text-accent">
                      {summary.intensity}
                    </div>
                    <div className="text-xs text-muted-foreground">Intensité</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Colonne gauche : Exercices + Validation */}
              <div className="space-y-6">
                
                {/* Exercices détaillés */}
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent" />
                      Exercices réalisés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {summary.exercises.map((exercise, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-lg">{exercise.exercise_name}</h4>
                          {summary.progression.newRecords.includes(exercise.exercise_name) && (
                            <Badge className="bg-yellow-500 text-white">
                              🏆 Record !
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-2 bg-background/50 rounded">
                            <div className="text-xs text-muted-foreground">Séries</div>
                            <div className="text-xl font-bold text-accent">{exercise.sets_count}</div>
                          </div>
                          <div className="text-center p-2 bg-background/50 rounded">
                            <div className="text-xs text-muted-foreground">Reps</div>
                            <div className="text-xl font-bold text-accent">{exercise.reps_performed}</div>
                          </div>
                          <div className="text-center p-2 bg-background/50 rounded">
                            <div className="text-xs text-muted-foreground">Poids</div>
                            <div className="text-xl font-bold text-accent">{exercise.weight_used}kg</div>
                          </div>
                        </div>
                        
                        {exercise.volume > 0 && (
                          <div className="mt-3 pt-3 border-t border-muted/40 text-center">
                            <span className="text-sm text-muted-foreground">Volume: </span>
                            <span className="text-sm font-bold text-accent">
                              {formatVolume(exercise.volume)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Actions - Bloc validation sous les exercices */}
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent" />
                      Validation de la séance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🎁</div>
                      <h3 className="text-lg font-semibold mb-2">
                        Prêt à valider cette séance ?
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Validez pour recevoir vos récompenses et débloquer la suite !
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleValidate}
                        className="w-full bg-accent hover:bg-accent/90"
                        size="lg"
                        disabled={isValidating}
                      >
                        {isValidating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Validation...
                          </>
                        ) : (
                          <>
                            <Trophy className="w-5 h-5 mr-2" />
                            Valider et recevoir les récompenses
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="w-full"
                        disabled={isValidating}
                      >
                        Reprendre l'entraînement
                      </Button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                      🎁 Des badges et récompenses vous attendent !
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite : Stats et progression */}
              <div className="space-y-6">
                
                {/* Progression */}
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Progression
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <div className="text-sm font-medium text-accent mb-1">
                        {getProgressionMessage(summary.progression)}
                      </div>
                      {summary.progression.newRecords.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          🏆 {summary.progression.newRecords.length} nouveau(x) record(s) !
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Streak */}
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent" />
                      Dynamique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Cette semaine</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-accent">{summary.streak.thisWeek}</span>
                          <span className="text-sm text-muted-foreground">séance(s)</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Streak actuel</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-accent">{summary.streak.consecutive}</span>
                          <span className="text-sm text-muted-foreground">jour(s)</span>
                          {summary.streak.consecutive >= 3 && <span>🔥</span>}
                        </div>
                      </div>

                      {/* Barre de progression de la semaine */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Objectif semaine</span>
                          <span>{Math.min(summary.streak.thisWeek, 4)}/4</span>
                        </div>
                        <Progress 
                          value={(Math.min(summary.streak.thisWeek, 4) / 4) * 100} 
                          className="h-3"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* XP gagnée */}
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-accent" />
                      Expérience gagnée
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <div className="text-3xl font-bold text-accent mb-1">
                        +{summary.xp.total} XP
                      </div>
                      <div className="text-sm text-muted-foreground">Total gagné</div>
                    </div>
                    
                    <div className="space-y-2">
                      {summary.xp.force > 0 && (
                        <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                          <span className="text-sm text-muted-foreground">💪 Force</span>
                          <span className="font-bold text-accent">+{summary.xp.force}</span>
                        </div>
                      )}
                      {summary.xp.endurance > 0 && (
                        <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                          <span className="text-sm text-muted-foreground">🏃 Endurance</span>
                          <span className="font-bold text-accent">+{summary.xp.endurance}</span>
                        </div>
                      )}
                      {summary.xp.agilite > 0 && (
                        <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                          <span className="text-sm text-muted-foreground">⚡ Agilité</span>
                          <span className="font-bold text-accent">+{summary.xp.agilite}</span>
                        </div>
                      )}
                      {summary.xp.mental > 0 && (
                        <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                          <span className="text-sm text-muted-foreground">🧠 Mental</span>
                          <span className="font-bold text-accent">+{summary.xp.mental}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* RPG Rewards Modal */}
            <WorkoutRewardsModal
              isOpen={workoutValidation.showRewardsModal}
              onClose={workoutValidation.handleRewardsModalClose}
              rewards={workoutValidation.rewardResults}
              sessionData={{
                rounds: session?.rounds_completed || 0,
                totalTime: session?.total_time_seconds || 0,
                questTitle: quest?.title
              }}
            />
          </div>
        )}

        {/* RPG Rewards Modal */}
        <WorkoutRewardsModal
          isOpen={workoutValidation.showRewardsModal}
          onClose={workoutValidation.handleRewardsModalClose}
          rewards={workoutValidation.rewardResults}
          sessionData={{
            rounds: session?.rounds_completed || 0,
            totalTime: session?.total_time_seconds || 0,
            questTitle: quest?.title
          }}
        />
      </div>
    </div>
  )
}