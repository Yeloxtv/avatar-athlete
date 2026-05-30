import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/types/workout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Clock, Dumbbell, Loader2, ChevronDown, ChevronUp, Trophy, Zap, Gift } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useChestReward } from '@/hooks/useChestReward'
import { ChestOpeningModal } from '@/components/loot/ChestOpeningModal'
import { RarityBadge } from '@/components/loot/RarityBadge'
import { CHEST_EMOJI } from '@/types/loot'

export default function SessionSummary() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [quest, setQuest] = useState<Quest | null>(null)
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [exerciseLogs, setExerciseLogs] = useState<any[]>([])

  // Finisher
  const [finisherSession, setFinisherSession] = useState<any | null>(null)
  const [finisherLogs, setFinisherLogs] = useState<any[]>([])
  const [finisherExercises, setFinisherExercises] = useState<Array<{ name: string; target_reps: number; reps_unit: string }>>([])
  const [expandedFinisherExercise, setExpandedFinisherExercise] = useState<string | null>(null)

  // Loot
  const { pendingChest, earnChest } = useChestReward()
  const [showChestModal, setShowChestModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!questId || !user?.id) return
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
          .eq('user_id', user.id)
          .eq('quest_id', questId)
          .eq('is_completed', true)
          .order('ended_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (sessionError) throw sessionError
        if (!sessionData) throw new Error('Session introuvable')
        setSession(sessionData)
        setNote((sessionData as any).note || '')

        const { data: logs } = await supabase
          .from('exercise_logs')
          .select('*')
          .eq('session_id', sessionData.id)
          .order('set_number', { ascending: true })
        setExerciseLogs(logs || [])

        // Attribuer un coffre si pas encore fait pour cette session
        const sessionLogs = logs || []
        const totalVolume = sessionLogs.reduce((s: number, l: any) => s + (l.reps_completed * (Number(l.weight_used) || 0)), 0)
        earnChest(sessionData.id, {
          total_time_seconds: sessionData.total_time_seconds || 0,
          total_volume: totalVolume,
          sets_count: sessionLogs.length,
          has_pr: false,
          streak: 0,
          with_finisher: false,
        })

        // Chercher le finisher du même jour dans la même campagne
        if (questData.day_of_week != null && questData.campaign_id) {
          const { data: finisherQuest } = await supabase
            .from('quests')
            .select('id, title')
            .eq('campaign_id', questData.campaign_id)
            .eq('day_of_week', questData.day_of_week)
            .in('workout_type', ['amrap', 'emom', 'tabata'])
            .limit(1)
            .maybeSingle()

          if (finisherQuest) {
            const muscuEnd = new Date(sessionData.ended_at || sessionData.started_at)
            const windowStart = new Date(muscuEnd.getTime() - 10 * 60 * 1000)
            const windowEnd = new Date(muscuEnd.getTime() + 4 * 60 * 60 * 1000)

            const [fSessionResult, fExercisesResult] = await Promise.all([
              supabase
                .from('workout_sessions')
                .select('*')
                .eq('user_id', user.id)
                .eq('quest_id', finisherQuest.id)
                .eq('is_completed', true)
                .gte('started_at', windowStart.toISOString())
                .lte('started_at', windowEnd.toISOString())
                .order('ended_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
              supabase
                .from('quest_exercises')
                .select('name, target_reps, reps_unit, order_index')
                .eq('quest_id', finisherQuest.id)
                .order('order_index'),
            ])

            if (fSessionResult.data) {
              setFinisherSession({ ...fSessionResult.data, title: finisherQuest.title })
              const { data: fLogs } = await supabase
                .from('exercise_logs')
                .select('*')
                .eq('session_id', fSessionResult.data.id)
                .order('set_number', { ascending: true })
              setFinisherLogs(fLogs || [])
              setFinisherExercises((fExercisesResult.data || []).map(e => ({
                name: e.name,
                target_reps: e.target_reps || 0,
                reps_unit: (e as any).reps_unit || 'reps',
              })))
            }
          }
        }
      } catch (error) {
        console.error(error)
        toast({ title: 'Erreur', description: 'Impossible de charger la séance', variant: 'destructive' })
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [questId, user?.id])

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

  const groupLogsByExercise = (logs: any[]) =>
    logs.reduce<Record<string, any[]>>((acc, log) => {
      const key = log.exercise_name || log.exercise_id || 'unknown'
      if (!acc[key]) acc[key] = []
      acc[key].push(log)
      return acc
    }, {})

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
  const logsByExercise = groupLogsByExercise(exerciseLogs)

  const finisherLogsByExercise = groupLogsByExercise(finisherLogs)
  const finisherTotalReps = finisherLogs.reduce((s, l) => s + (l.reps_completed || 0), 0)

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

      {/* EXERCICES MUSCULATION */}
      {Object.keys(logsByExercise).length > 0 && (
        <Card>
          <CardContent className="p-0">
            {Object.entries(logsByExercise).map(([key, logs], i) => {
              const exName = logs[0]?.exercise_name || `Exercice ${i + 1}`
              const bestWeight = Math.max(...logs.map((l: any) => Number(l.weight_used) || 0))
              const totalReps = logs.reduce((s: number, l: any) => s + (l.reps_completed || 0), 0)
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
                      {logs.map((log: any, j: number) => (
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

      {/* FINISHER */}
      {finisherSession && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-400 uppercase tracking-wide">Finisher</span>
            <span className="text-xs text-muted-foreground">{finisherSession.title}</span>
          </div>
          <Card className="border-orange-400/30">
            <CardContent className="p-0">
              {/* Stats finisher */}
              <div className="grid grid-cols-2 gap-px bg-muted/20 border-b border-muted/20">
                <div className="p-3 text-center bg-background">
                  <div className="font-bold text-sm">{formatTime(finisherSession.total_time_seconds || 0)}</div>
                  <div className="text-xs text-muted-foreground">Durée</div>
                </div>
                <div className="p-3 text-center bg-background">
                  <div className="font-bold text-sm">{finisherSession.rounds_completed ?? '—'} rounds</div>
                  <div className="text-xs text-muted-foreground">{finisherTotalReps > 0 ? `${finisherTotalReps} reps total` : 'Complété'}</div>
                </div>
              </div>

              {/* Exercices finisher */}
              {Object.entries(finisherLogsByExercise).map(([key, logs], i) => {
                const exName = (logs as any[])[0]?.exercise_name || `Exercice ${i + 1}`
                const totalReps = (logs as any[]).reduce((s, l) => s + (l.reps_completed || 0), 0)
                return (
                  <div key={key} className={i > 0 ? 'border-t border-muted/20' : ''}>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/20 transition-colors"
                      onClick={() => setExpandedFinisherExercise(expandedFinisherExercise === key ? null : key)}
                    >
                      <div>
                        <div className="font-medium text-sm">{exName}</div>
                        <div className="text-xs text-muted-foreground">{totalReps} reps total</div>
                      </div>
                      {expandedFinisherExercise === key
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      }
                    </button>
                    {expandedFinisherExercise === key && (
                      <div className="px-4 pb-3 space-y-1 border-t border-muted/20 pt-2">
                        {(logs as any[]).map((log, j) => (
                          <div key={j} className="flex items-center justify-between text-sm py-0.5">
                            <span className="text-muted-foreground">Série {log.set_number ?? j + 1}</span>
                            <span className="font-medium">{log.reps_completed} reps</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {Object.keys(finisherLogsByExercise).length === 0 && finisherExercises.length > 0 && (
                <div className="divide-y divide-muted/20">
                  {finisherExercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
                      <span className="flex-1">{ex.name}</span>
                      {ex.target_reps > 0 && (
                        <span className="text-muted-foreground shrink-0">{ex.target_reps} {ex.reps_unit}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {Object.keys(finisherLogsByExercise).length === 0 && finisherExercises.length === 0 && (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  {finisherSession.rounds_completed > 0
                    ? `${finisherSession.rounds_completed} rounds complétés`
                    : 'Finisher complété'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* COFFRE GAGNÉ */}
      {pendingChest && (
        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="text-4xl shrink-0">
              {CHEST_EMOJI[(pendingChest.chest?.rarity ?? 'common') as any]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">{pendingChest.chest?.name ?? 'Coffre'}</div>
              <RarityBadge rarity={(pendingChest.chest?.rarity ?? 'common') as any} size="sm" className="mt-1" />
            </div>
            <Button size="sm" className="shrink-0 gap-1" onClick={() => setShowChestModal(true)}>
              <Gift className="w-4 h-4" />
              Ouvrir
            </Button>
          </CardContent>
        </Card>
      )}

      {pendingChest && showChestModal && (
        <ChestOpeningModal
          userChest={pendingChest}
          open={showChestModal}
          onClose={() => setShowChestModal(false)}
        />
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
