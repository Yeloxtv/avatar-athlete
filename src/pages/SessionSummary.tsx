import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useSessionSummary } from '@/hooks/useSessionSummary'
import { useWorkoutValidation } from '@/hooks/useWorkoutValidation'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { WorkoutRewardsModal } from '@/components/ui/workout-rewards-modal'
import { ArrowLeft, Clock, Dumbbell, Trophy, Zap, Flame, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

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

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Séance terminée 🎉</h1>
          <p className="text-sm text-muted-foreground">{quest.title}</p>
        </div>
      </div>

      {summaryLoading && (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-accent" />
          <p className="text-sm text-muted-foreground">Calcul du récapitulatif...</p>
        </div>
      )}

      {summary && (
        <>
          {/* Stats rapides */}
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

          {/* Exercices réalisés */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent" />
                Exercices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {summary.exercises.map((ex) => (
                <div key={ex.exercise_id} className="rounded-lg border border-muted/40 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/20 transition-colors"
                    onClick={() => setExpandedExercise(expandedExercise === ex.exercise_id ? null : ex.exercise_id)}
                  >
                    <div>
                      <div className="font-medium text-sm">{ex.exercise_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {ex.sets.length} séries · {ex.best_weight > 0 ? `${ex.best_weight}kg max` : `${ex.total_reps} reps`}
                        {ex.volume > 0 ? ` · ${formatVolume(ex.volume)}` : ''}
                      </div>
                    </div>
                    {expandedExercise === ex.exercise_id
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    }
                  </button>

                  {expandedExercise === ex.exercise_id && (
                    <div className="px-3 pb-3 space-y-1 border-t border-muted/30 pt-2">
                      {ex.sets.map((set) => (
                        <div key={set.set_number} className="flex items-center justify-between text-sm py-1">
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

          {/* XP gagné */}
          {summary.xp.total > 0 && (
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="font-semibold">XP gagné</span>
                </div>
                <span className="text-xl font-bold text-accent">+{summary.xp.total}</span>
              </CardContent>
            </Card>
          )}

          {/* Streak */}
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-medium">Cette semaine</span>
              </div>
              <span className="font-bold">{summary.streak.thisWeek} séance{summary.streak.thisWeek > 1 ? 's' : ''}</span>
            </CardContent>
          </Card>

          {/* Note de séance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Note de séance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="Comment s'est passée la séance ? Douleurs, sensations, objectifs pour la prochaine fois..."
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

          {/* Valider */}
          <Button
            onClick={handleValidate}
            className="w-full h-12 text-base"
            disabled={isValidating}
          >
            {isValidating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Validation...</>
            ) : (
              <><Trophy className="w-4 h-4 mr-2" />Valider et récolter les récompenses</>
            )}
          </Button>

          <Button variant="ghost" className="w-full" onClick={() => navigate(`/training/${questId}`)}>
            Reprendre l'entraînement
          </Button>
        </>
      )}

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
