import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/components/ui/sheet'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, Clock, Dumbbell, FileText, Download, Pencil, Trash2, Zap } from 'lucide-react'

interface ExerciseLog {
  exercise_id: string
  exercise_name: string
  sets: Array<{ set_number: number; reps: number; weight: number }>
  best_weight: number
  total_reps: number
  volume: number
}

interface FinisherData {
  title: string
  workout_type: string
  total_time_seconds: number
  rounds_completed: number
  exercises: Array<{ name: string; target_reps: number; reps_unit: string }>
}

interface SessionDetail {
  id: string
  quest_id: string
  quest_title: string
  started_at: string
  ended_at: string | null
  total_time_seconds: number
  note: string | null
  exercises: ExerciseLog[]
}

type ExerciseLogRow = {
  exercise_id: string
  exercise_name?: string | null
  global_exercise_id?: string | null
  set_number: number
  reps_completed: number
  weight_used: number | null
  quest_exercises?: { name?: string | null } | { name?: string | null }[] | null
}

const getLoggedExerciseName = (log: ExerciseLogRow): string => {
  const relation = Array.isArray(log.quest_exercises) ? log.quest_exercises[0] : log.quest_exercises
  return log.exercise_name || relation?.name || 'Exercice'
}

const getLoggedExerciseKey = (log: ExerciseLogRow): string => {
  const name = getLoggedExerciseName(log).trim().toLowerCase()
  return log.global_exercise_id || `${log.exercise_id}:${name}`
}

const escapeHtml = (value: string | number | null | undefined): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const formatPrintDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const formatPrintTime = (seconds: number) => `${Math.floor(seconds / 60)} min`

const formatPrintVolume = (kg: number) => kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${Math.round(kg)} kg`

const renderSessionPrintHtml = (session: SessionDetail, totalVolume: number, finisher: FinisherData | null): string => `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(session.quest_title)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 28px;
        color: #111827;
        background: #ffffff;
        font-family: Arial, sans-serif;
        line-height: 1.35;
      }
      h1 { margin: 0 0 6px; font-size: 26px; }
      h2 { margin: 28px 0 12px; font-size: 18px; }
      h3 { margin: 0 0 4px; font-size: 16px; }
      .muted { color: #6b7280; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 22px 0; }
      .box { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; }
      .metric { font-size: 22px; font-weight: 800; }
      .exercise { padding: 16px 0; border-top: 1px solid #e5e7eb; break-inside: avoid; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border-bottom: 1px solid #e5e7eb; padding: 8px 0; font-size: 13px; }
      th { color: #6b7280; text-align: left; }
      td:nth-child(2), th:nth-child(2) { text-align: center; }
      td:nth-child(3), th:nth-child(3) { text-align: right; }
      @media print {
        body { padding: 18mm; }
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(session.quest_title)}</h1>
    <div class="muted">${escapeHtml(formatPrintDate(session.started_at))}</div>
    <div class="muted">Exporte depuis PlayAndTrain</div>

    <div class="grid">
      <div class="box"><div class="metric">${escapeHtml(formatPrintTime(session.total_time_seconds))}</div><div class="muted">Duree</div></div>
      <div class="box"><div class="metric">${session.exercises.length}</div><div class="muted">Exercices</div></div>
      <div class="box"><div class="metric">${escapeHtml(formatPrintVolume(totalVolume))}</div><div class="muted">Volume total</div></div>
    </div>

    ${session.note ? `<div class="box"><strong>Note de seance</strong><p class="muted">${escapeHtml(session.note)}</p></div>` : ''}

    ${finisher ? `
    <h2>Finisher — ${escapeHtml(finisher.title)}</h2>
    <p class="muted" style="margin:-8px 0 12px;font-size:13px">${escapeHtml(finisher.workout_type.toUpperCase())}</p>
    <div class="grid" style="grid-template-columns: repeat(2, 1fr)">
      <div class="box"><div class="metric">${escapeHtml(formatPrintTime(finisher.total_time_seconds))}</div><div class="muted">Duree</div></div>
      <div class="box"><div class="metric">${escapeHtml(finisher.rounds_completed)}</div><div class="muted">Tours</div></div>
    </div>
    ${finisher.exercises.length > 0 ? `
    <table style="margin-top:8px">
      <thead><tr><th>#</th><th>Exercice</th><th style="text-align:right">Reps cibles</th></tr></thead>
      <tbody>
        ${finisher.exercises.map((ex, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(ex.name)}</td>
            <td style="text-align:right">${ex.target_reps > 0 ? `${ex.target_reps} ${escapeHtml(ex.reps_unit)}` : '—'}</td>
          </tr>`).join('')}
      </tbody>
    </table>` : ''}` : ''}

    <h2>Detail des exercices</h2>
    ${session.exercises.length === 0
      ? '<p class="muted">Aucun log enregistre pour cette seance</p>'
      : session.exercises.map(ex => `
        <section class="exercise">
          <h3>${escapeHtml(ex.exercise_name)}</h3>
          <div class="muted">
            ${ex.sets.length} series · ${ex.total_reps} reps au total${ex.best_weight > 0 ? ` · ${escapeHtml(ex.best_weight)} kg max` : ''}${ex.volume > 0 ? ` · ${escapeHtml(formatPrintVolume(ex.volume))} volume` : ''}
          </div>
          <table>
            <thead><tr><th>Serie</th><th>Reps</th><th>Charge</th></tr></thead>
            <tbody>
              ${ex.sets.map(set => `
                <tr>
                  <td>Serie ${escapeHtml(set.set_number)}</td>
                  <td>${escapeHtml(set.reps)}</td>
                  <td>${set.weight > 0 ? `${escapeHtml(set.weight)} kg` : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>
      `).join('')}
  </body>
</html>`

export default function SessionDetail() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { user } = useAuth()
  const [session, setSession] = useState<SessionDetail | null>(null)
  const [finisher, setFinisher] = useState<FinisherData | null>(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  // Edit state
  const [showEdit, setShowEdit] = useState(false)
  const [editNote, setEditNote] = useState('')
  const [editMinutes, setEditMinutes] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user && sessionId) loadSession()
  }, [user, sessionId])

  const loadSession = async () => {
    if (!user || !sessionId) return
    try {
      const { data: s } = await supabase
        .from('workout_sessions')
        .select('id, quest_id, started_at, ended_at, total_time_seconds, note, quests(title, day_of_week, campaign_id)')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single()

      if (!s) { navigate('/statistics'); return }

      const { data: logs } = await supabase
        .from('exercise_logs')
        .select('exercise_id, exercise_name, global_exercise_id, set_number, reps_completed, weight_used, quest_exercises(name)')
        .eq('session_id', sessionId)
        .order('exercise_id')
        .order('set_number')
      const sessionLogs = (logs || []) as ExerciseLogRow[]

      const grouped = new Map<string, ExerciseLogRow[]>()
      for (const log of sessionLogs) {
        const key = getLoggedExerciseKey(log)
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)!.push(log)
      }

      const exercises: ExerciseLog[] = Array.from(grouped.entries()).map(([exerciseId, sets]) => {
        const name = getLoggedExerciseName(sets[0])
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

      setSession({
        id: s.id,
        quest_id: s.quest_id,
        quest_title: (s.quests as any)?.title || 'Séance',
        started_at: s.started_at,
        ended_at: (s as any).ended_at || null,
        total_time_seconds: s.total_time_seconds || 0,
        note: (s as any).note || null,
        exercises,
      })

      // Chercher le finisher associé (même campaign + day_of_week, dans les 4h après la fin)
      const questMeta = s.quests as any
      if (questMeta?.day_of_week != null && questMeta?.campaign_id) {
        const { data: finisherQuest } = await supabase
          .from('quests')
          .select('id, title, workout_type')
          .eq('campaign_id', questMeta.campaign_id)
          .eq('day_of_week', questMeta.day_of_week)
          .in('workout_type', ['amrap', 'emom', 'tabata'])
          .limit(1)
          .maybeSingle()

        if (finisherQuest) {
          const muscuEnd = new Date((s as any).ended_at || s.started_at)
          const windowStart = new Date(muscuEnd.getTime() - 10 * 60 * 1000)
          const windowEnd = new Date(muscuEnd.getTime() + 4 * 60 * 60 * 1000)

          const [fSessionResult, fExercisesResult] = await Promise.all([
            supabase
              .from('workout_sessions')
              .select('total_time_seconds, rounds_completed')
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
            setFinisher({
              title: finisherQuest.title,
              workout_type: (finisherQuest as any).workout_type,
              total_time_seconds: fSessionResult.data.total_time_seconds || 0,
              rounds_completed: fSessionResult.data.rounds_completed || 0,
              exercises: (fExercisesResult.data || []).map(e => ({
                name: e.name,
                target_reps: e.target_reps || 0,
                reps_unit: (e as any).reps_unit || 'reps',
              })),
            })
          }
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const openEdit = () => {
    if (!session) return
    setEditNote(session.note || '')
    setEditMinutes(String(Math.floor(session.total_time_seconds / 60)))
    setShowEdit(true)
  }

  const handleSaveEdit = async () => {
    if (!session || !user) return
    setIsSaving(true)
    const newSeconds = Math.max(0, parseInt(editMinutes || '0', 10)) * 60
    const { error } = await supabase
      .from('workout_sessions')
      .update({ note: editNote || null, total_time_seconds: newSeconds })
      .eq('id', session.id)
      .eq('user_id', user.id)
    setIsSaving(false)
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
      return
    }
    setSession({ ...session, note: editNote || null, total_time_seconds: newSeconds })
    setShowEdit(false)
    toast({ title: 'Séance mise à jour' })
  }

  const handleDelete = async () => {
    if (!session || !user) return
    setIsDeleting(true)
    await supabase.from('user_rewards').delete().eq('source_session_id', session.id)
    await supabase.from('user_chests').delete().eq('session_id', session.id)
    await supabase.from('session_rounds').delete().eq('session_id', session.id)
    await supabase.from('exercise_logs').delete().eq('session_id', session.id)
    const { error } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', session.id)
      .eq('user_id', user.id)
    setIsDeleting(false)
    if (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
      return
    }
    toast({ title: 'Séance supprimée' })
    navigate('/statistics')
  }

  const handlePrint = () => {
    if (!session) return

    const html = renderSessionPrintHtml(session, totalVolume, finisher)
    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      window.print()
      return
    }

    let didPrint = false
    const triggerPrint = () => {
      if (didPrint) return
      didPrint = true
      printWindow.focus()
      printWindow.print()
    }

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.addEventListener('load', () => window.setTimeout(triggerPrint, 150), { once: true })
    window.setTimeout(triggerPrint, 500)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    return `${m} min`
  }

  const formatVolume = (kg: number) => kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${Math.round(kg)} kg`

  const totalVolume = session?.exercises.reduce((s, e) => s + e.volume, 0) || 0

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-6 h-6 border-4 border-accent border-t-transparent rounded-full" />
    </div>
  )

  if (!session) return null

  return (
    <>
      {/* Styles d'impression */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-area { padding: 2rem; }
        }
      `}</style>

      <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/statistics')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{session.quest_title}</h1>
              <p className="text-sm text-muted-foreground capitalize">{formatDate(session.started_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={openEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Zone imprimable */}
        <div ref={printRef} className="print-area space-y-6">

          {/* En-tête PDF (visible à l'impression) */}
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold">{session.quest_title}</h1>
            <p className="text-muted-foreground capitalize">{formatDate(session.started_at)}</p>
            <p className="text-sm text-muted-foreground">Exporté depuis PlayAndTrain</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-accent" />
                <div className="text-xl font-bold">{formatTime(session.total_time_seconds)}</div>
                <div className="text-xs text-muted-foreground">Durée</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Dumbbell className="w-5 h-5 mx-auto mb-1 text-accent" />
                <div className="text-xl font-bold">{session.exercises.length}</div>
                <div className="text-xs text-muted-foreground">Exercices</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold">{formatVolume(totalVolume)}</div>
                <div className="text-xs text-muted-foreground">Volume total</div>
              </CardContent>
            </Card>
          </div>

          {/* Note de séance */}
          {session.note && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  Note de séance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">"{session.note}"</p>
              </CardContent>
            </Card>
          )}

          {/* Finisher */}
          {finisher && (
            <Card className="border-orange-400/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-orange-400">
                  <Zap className="w-4 h-4" />
                  Finisher — {finisher.title}
                </CardTitle>
                <p className="text-xs font-medium uppercase tracking-widest text-orange-400/70 mt-0.5">
                  {finisher.workout_type.toUpperCase()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="font-bold">{formatTime(finisher.total_time_seconds)}</div>
                    <div className="text-xs text-muted-foreground">Durée</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="font-bold">{finisher.rounds_completed}</div>
                    <div className="text-xs text-muted-foreground">Tours</div>
                  </div>
                </div>
                {finisher.exercises.length > 0 && (
                  <div className="divide-y divide-muted/20">
                    {finisher.exercises.map((ex, i) => (
                      <div key={i} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-muted-foreground w-5 shrink-0">{i + 1}</span>
                        <span className="flex-1">{ex.name}</span>
                        {ex.target_reps > 0 && (
                          <span className="text-muted-foreground shrink-0">{ex.target_reps} {ex.reps_unit}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Exercices */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Détail des exercices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {session.exercises.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun log enregistré pour cette séance</p>
              ) : (
                session.exercises.map((ex, i) => (
                  <div key={ex.exercise_id}>
                    {i > 0 && <div className="border-t border-muted/30 mb-6" />}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{ex.exercise_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {ex.sets.length} séries · {ex.total_reps} reps au total
                          {ex.best_weight > 0 ? ` · ${ex.best_weight} kg max` : ''}
                          {ex.volume > 0 ? ` · ${formatVolume(ex.volume)} volume` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="grid grid-cols-3 text-xs text-muted-foreground font-medium pb-1 border-b border-muted/20">
                        <span>Série</span>
                        <span className="text-center">Reps</span>
                        <span className="text-right">Charge</span>
                      </div>
                      {ex.sets.map(set => (
                        <div key={set.set_number} className="grid grid-cols-3 text-sm py-1.5 border-b border-muted/10 last:border-0">
                          <span className="text-muted-foreground">Série {set.set_number}</span>
                          <span className="text-center font-medium">{set.reps}</span>
                          <span className="text-right font-medium">{set.weight > 0 ? `${set.weight} kg` : '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Sheet — édition */}
      <Sheet open={showEdit} onOpenChange={setShowEdit}>
        <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 space-y-5">
          <SheetHeader>
            <SheetTitle>Modifier la séance</SheetTitle>
          </SheetHeader>

          <div className="space-y-1.5">
            <Label htmlFor="edit-duration">Durée (minutes)</Label>
            <Input
              id="edit-duration"
              type="number"
              min="0"
              value={editMinutes}
              onChange={e => setEditMinutes(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-note">Note</Label>
            <Textarea
              id="edit-note"
              rows={4}
              placeholder="Sensations, observations..."
              value={editNote}
              onChange={e => setEditNote(e.target.value)}
              className="resize-none"
            />
          </div>

          <SheetFooter className="flex-row gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowEdit(false)}>
              Annuler
            </Button>
            <Button className="flex-1" onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* AlertDialog — suppression */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
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
    </>
  )
}
