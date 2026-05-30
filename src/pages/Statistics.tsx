import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, ChevronRight, Dumbbell, Clock, Trophy, FileText, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SessionLog {
  id: string
  quest_id: string
  quest_title: string
  started_at: string
  total_time_seconds: number
  note: string | null
  exercise_logs: Array<{
    exercise_id: string
    exercise_name: string
    sets: Array<{ set_number: number; reps: number; weight: number }>
    best_weight: number
    total_reps: number
    volume: number
  }>
}

export default function Statistics() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { user } = useAuth()
  const [sessions, setSessions] = useState<SessionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user) loadSessions()
  }, [user])

  const loadSessions = async () => {
    if (!user) return
    try {
      const { data: sessionsData } = await supabase
        .from('workout_sessions')
        .select('id, quest_id, started_at, total_time_seconds, note, quests(title, workout_type)')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .eq('workout_type', 'strength')
        .order('started_at', { ascending: false })
        .limit(50)

      if (!sessionsData?.length) { setLoading(false); return }

      const sessionIds = sessionsData.map(s => s.id)
      const { data: logsData } = await supabase
        .from('exercise_logs')
        .select('session_id, exercise_id, set_number, reps_completed, weight_used, quest_exercises(name)')
        .in('session_id', sessionIds)
        .order('exercise_id')
        .order('set_number')

      // Construire la structure complète
      const result: SessionLog[] = sessionsData.map(s => {
        const sessionLogs = (logsData || []).filter(l => l.session_id === s.id)

        // Grouper par exercice
        const grouped = new Map<string, typeof sessionLogs>()
        for (const log of sessionLogs) {
          if (!grouped.has(log.exercise_id)) grouped.set(log.exercise_id, [])
          grouped.get(log.exercise_id)!.push(log)
        }

        const exercises = Array.from(grouped.entries()).map(([exerciseId, sets]) => {
          const name = (sets[0].quest_exercises as any)?.name || 'Exercice'
          const setsData = sets.map(s => ({
            set_number: s.set_number,
            reps: s.reps_completed,
            weight: Number(s.weight_used) || 0,
          }))
          return {
            exercise_id: exerciseId,
            exercise_name: name,
            sets: setsData,
            best_weight: Math.max(...setsData.map(s => s.weight)),
            total_reps: setsData.reduce((sum, s) => sum + s.reps, 0),
            volume: setsData.reduce((sum, s) => sum + s.reps * s.weight, 0),
          }
        })

        return {
          id: s.id,
          quest_id: s.quest_id,
          quest_title: (s.quests as any)?.title || 'Séance',
          started_at: s.started_at,
          total_time_seconds: s.total_time_seconds || 0,
          note: (s as any).note || null,
          exercise_logs: exercises,
        }
      })

      setSessions(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !user) return
    setIsDeleting(true)
    // Supprimer dans l'ordre des FK : dépendants d'abord
    await supabase.from('user_rewards').delete().eq('source_session_id', deleteTarget)
    await supabase.from('user_chests').delete().eq('session_id', deleteTarget)
    await supabase.from('session_rounds').delete().eq('session_id', deleteTarget)
    await supabase.from('exercise_logs').delete().eq('session_id', deleteTarget)
    const { error } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', deleteTarget)
      .eq('user_id', user.id)
    setIsDeleting(false)
    setDeleteTarget(null)
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
      return
    }
    setSessions(prev => prev.filter(s => s.id !== deleteTarget))
    toast({ title: 'Séance supprimée' })
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const formatVolume = (kg: number) => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`
    return `${Math.round(kg)} kg`
  }

  const totalVolume = sessions.reduce((sum, s) =>
    sum + s.exercise_logs.reduce((sv, e) => sv + e.volume, 0), 0)

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-5">

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Mes séances</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-accent">{sessions.length}</div>
            <div className="text-xs text-muted-foreground">Séances</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-accent">{formatVolume(totalVolume)}</div>
            <div className="text-xs text-muted-foreground">Volume total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-accent">
              {sessions.length > 0
                ? formatTime(Math.round(sessions.reduce((s, se) => s + se.total_time_seconds, 0) / sessions.length))
                : '—'}
            </div>
            <div className="text-xs text-muted-foreground">Durée moy.</div>
          </CardContent>
        </Card>
      </div>

      {/* Historique */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground text-sm">Aucune séance enregistrée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const sessionVolume = session.exercise_logs.reduce((s, e) => s + e.volume, 0)

            return (
              <Card
                key={session.id}
                className="overflow-hidden hover:border-accent/40 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/statistics/session/${session.id}`)}
                    >
                      <div className="font-semibold truncate">{session.quest_title}</div>
                      <div className="text-xs text-muted-foreground capitalize mt-0.5">
                        {formatDate(session.started_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-destructive"
                        onClick={e => { e.stopPropagation(); setDeleteTarget(session.id) }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <ChevronRight
                        className="w-4 h-4 text-muted-foreground cursor-pointer"
                        onClick={() => navigate(`/statistics/session/${session.id}`)}
                      />
                    </div>
                  </div>

                  <div
                    className="flex gap-3 mt-3 text-xs text-muted-foreground cursor-pointer"
                    onClick={() => navigate(`/statistics/session/${session.id}`)}
                  >
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(session.total_time_seconds)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {session.exercise_logs.length} exercices
                    </span>
                    {sessionVolume > 0 && (
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3 h-3" />
                        {formatVolume(sessionVolume)}
                      </span>
                    )}
                    {session.note && (
                      <span className="flex items-center gap-1 text-accent">
                        <FileText className="w-3 h-3" />
                        Note
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette séance ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La séance et tous ses logs seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
