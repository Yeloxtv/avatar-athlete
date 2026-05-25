import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/types/workout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Clock, Dumbbell, Loader2, ChevronDown, ChevronUp, Trophy } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function SessionSummary() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()

  const [quest, setQuest] = useState<Quest | null>(null)
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [exerciseLogs, setExerciseLogs] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      if (!questId || !profile?.id) return
      try {
        const { data: questData, error: questError } = await supabase
          .from('quests')
          .select('*, quest_exercises(id, name, target_reps, order_index, sets_count, target_weight)')
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

        const { data: logs } = await supabase
          .from('exercise_logs')
          .select('*')
          .eq('session_id', sessionData.id)
          .order('set_number', { ascending: true })
        setExerciseLogs(logs || [])
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

  const handleSaveNote = async () => {
    if (!session) return
    const { error } = await supabase
      .from('workout_sessions')
      .update({ note })
      .eq('id', session.id)
    if (!error) setNoteSaved(true)
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

  const totalSets = exerciseLogs.length
  const totalVolume = exerciseLogs.reduce((s, l) => s + (l.reps_completed * (Number(l.weight_used) || 0)), 0)

  // Grouper les logs par exercise_id pour l'affichage
  const logsByExercise = exerciseLogs.reduce<Record<string, any[]>>((acc, log) => {
    const key = log.quest_exercise_id || log.exercise_id || 'unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(log)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-5">

      {/* HERO */}
      <div className="text-center py-7 space-y-2">
        <div className="mx-auto w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-accent" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-black">Séance terminée</p>
        <h1 className="text-2xl font-black leading-tight">{quest.title}</h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-accent" />
            <div className="font-bold text-sm">{formatTime(session.total_time_seconds || 0)}</div>
            <div className="text-xs text-muted-foreground">Durée</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Dumbbell className="w-4 h-4 mx-auto mb-1 text-accent" />
            <div className="font-bold text-sm">{totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}t` : `${totalSets} séries`}</div>
            <div className="text-xs text-muted-foreground">{totalVolume > 0 ? 'Volume' : 'Séries'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg mb-0.5">💪</div>
            <div className="font-bold text-sm">{totalSets}</div>
            <div className="text-xs text-muted-foreground">Séries</div>
          </CardContent>
        </Card>
      </div>

      {/* EXERCICES */}
      {Object.keys(logsByExercise).length > 0 && (
        <Card>
          <CardContent className="p-0">
            {Object.entries(logsByExercise).map(([key, logs], i) => {
              const exName = logs[0]?.exercise_name || logs[0]?.name || `Exercice ${i + 1}`
              const bestWeight = Math.max(...logs.map(l => Number(l.weight_used) || 0))
              const totalReps = logs.reduce((s, l) => s + (l.reps_completed || 0), 0)
              return (
                <div key={key} className={i > 0 ? 'border-t border-muted/20' : ''}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/20 transition-colors"
                    onClick={() => setExpandedExercise(expandedExercise === key ? null : key)}
                  >
                    <div>
                      <div className="font-medium text-sm">{exName}</div>
                      <div className="text-xs text-muted-foreground">
                        {logs.length} séries · {bestWeight > 0 ? `${bestWeight}kg max` : `${totalReps} reps`}
                      </div>
                    </div>
                    {expandedExercise === key
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                  </button>
                  {expandedExercise === key && (
                    <div className="px-4 pb-3 space-y-1 border-t border-muted/20 pt-2">
                      {logs.map((log, j) => (
                        <div key={j} className="flex items-center justify-between text-sm py-0.5">
                          <span className="text-muted-foreground">Série {log.set_number ?? j + 1}</span>
                          <span className="font-medium">
                            {log.reps_completed} reps{Number(log.weight_used) > 0 ? ` × ${log.weight_used}kg` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* NOTE */}
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

      {/* CTA */}
      <Button onClick={() => navigate('/')} className="w-full h-12 text-base font-bold">
        <Trophy className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>
    </div>
  )
}
