import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useCampaignManager } from '@/hooks/useCampaignManager'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, ArrowRight, Plus, Trash2, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExerciseDraft {
  id?: string
  name: string
  sets_count: number
  target_reps: number
  target_weight: number | null
  rest_seconds: number
}

interface SessionDraft {
  questId?: string
  name: string
  exercises: ExerciseDraft[]
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function emptyExercise(): ExerciseDraft {
  return { name: '', sets_count: 3, target_reps: 8, target_weight: null, rest_seconds: 90 }
}

function emptySession(dayIndex: number): SessionDraft {
  return { name: DAYS[dayIndex], exercises: [emptyExercise()] }
}

// ─── Step indicators ──────────────────────────────────────────────────────────

function StepBar({ step }: { step: number }) {
  const steps = ['Nom', 'Jours', 'Séances']
  return (
    <div className="space-y-2 px-4 pt-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {steps.map((s, i) => (
          <span key={s} className={cn('font-medium', i + 1 === step && 'text-accent')}>{s}</span>
        ))}
      </div>
      <Progress value={((step - 1) / 2) * 100} className="h-1.5" />
    </div>
  )
}

// ─── Step 1 — Program name ────────────────────────────────────────────────────

function Step1({
  programName,
  onChange,
  onNext,
}: {
  programName: string
  onChange: (v: string) => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-6 px-4 pt-8 pb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black">Mon programme</h1>
        <p className="text-sm text-muted-foreground">Comment s'appelle ton programme ?</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prog-name">Nom du programme</Label>
        <Input
          id="prog-name"
          value={programName}
          onChange={e => onChange(e.target.value)}
          placeholder="Ex : Push Pull Legs, PPL, Full Body…"
          className="h-12 text-base"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && programName.trim() && onNext()}
        />
      </div>

      <Button
        onClick={onNext}
        disabled={!programName.trim()}
        className="w-full h-12 font-bold text-base"
      >
        Suivant <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}

// ─── Step 2 — Active days ─────────────────────────────────────────────────────

function Step2({
  activeDays,
  onToggle,
  onBack,
  onNext,
}: {
  activeDays: Set<number>
  onToggle: (day: number) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-6 px-4 pt-8 pb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-black">Jours d'entraînement</h2>
        <p className="text-sm text-muted-foreground">Sélectionne les jours où tu t'entraînes.</p>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((day, i) => {
          const active = activeDays.has(i)
          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggle(i)}
              className={cn(
                'flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold transition-all',
                active
                  ? 'bg-accent text-accent-foreground border-accent shadow-md'
                  : 'border-muted/40 text-muted-foreground hover:border-accent/40'
              )}
            >
              <span>{day}</span>
              {active && <Check className="w-3 h-3" />}
            </button>
          )
        })}
      </div>

      {activeDays.size > 0 && (
        <p className="text-xs text-accent font-medium text-center">
          {activeDays.size} jour{activeDays.size > 1 ? 's' : ''} sélectionné{activeDays.size > 1 ? 's' : ''}
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="h-12 px-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          onClick={onNext}
          disabled={activeDays.size === 0}
          className="flex-1 h-12 font-bold"
        >
          Suivant <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

// ─── Exercise card ────────────────────────────────────────────────────────────

function ExerciseCard({
  exercise,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  exercise: ExerciseDraft
  index: number
  onChange: (field: keyof ExerciseDraft, value: string | number | null) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <div className="rounded-xl border border-muted/40 bg-muted/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Exercice {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-destructive/60 hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <Input
        value={exercise.name}
        onChange={e => onChange('name', e.target.value)}
        placeholder="Nom de l'exercice"
        className="h-11 text-base"
      />

      <div className="grid grid-cols-4 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Séries</Label>
          <Input
            type="number"
            min={1}
            value={exercise.sets_count}
            onChange={e => onChange('sets_count', parseInt(e.target.value) || 1)}
            className="h-10 text-center text-base font-bold px-1"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Reps</Label>
          <Input
            type="number"
            min={1}
            value={exercise.target_reps}
            onChange={e => onChange('target_reps', parseInt(e.target.value) || 1)}
            className="h-10 text-center text-base font-bold px-1"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Poids kg</Label>
          <Input
            type="number"
            min={0}
            step={0.5}
            value={exercise.target_weight ?? ''}
            onChange={e => onChange('target_weight', e.target.value === '' ? null : parseFloat(e.target.value))}
            placeholder="—"
            className="h-10 text-center text-base font-bold px-1"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Repos s</Label>
          <Input
            type="number"
            min={0}
            step={5}
            value={exercise.rest_seconds}
            onChange={e => onChange('rest_seconds', parseInt(e.target.value) || 0)}
            className="h-10 text-center text-base font-bold px-1"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Step 3 — Sessions ────────────────────────────────────────────────────────

function Step3({
  activeDays,
  sessions,
  onSessionChange,
  onBack,
  onSave,
  saving,
}: {
  activeDays: Set<number>
  sessions: Record<number, SessionDraft>
  onSessionChange: (day: number, session: SessionDraft) => void
  onBack: () => void
  onSave: () => void
  saving: boolean
}) {
  const sortedDays = [...activeDays].sort((a, b) => a - b)
  const [activeDayTab, setActiveDayTab] = useState(sortedDays[0])

  const session = sessions[activeDayTab]
  if (!session) return null

  const updateSession = (updates: Partial<SessionDraft>) => {
    onSessionChange(activeDayTab, { ...session, ...updates })
  }

  const updateExercise = (idx: number, field: keyof ExerciseDraft, value: string | number | null) => {
    const newExercises = session.exercises.map((ex, i) =>
      i === idx ? { ...ex, [field]: value } : ex
    )
    updateSession({ exercises: newExercises })
  }

  const addExercise = () => {
    updateSession({ exercises: [...session.exercises, emptyExercise()] })
  }

  const removeExercise = (idx: number) => {
    updateSession({ exercises: session.exercises.filter((_, i) => i !== idx) })
  }

  const currentTabIdx = sortedDays.indexOf(activeDayTab)

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Day tabs */}
      <div className="px-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveDayTab(sortedDays[currentTabIdx - 1])}
          disabled={currentTabIdx === 0}
          className="p-2 rounded-lg border border-muted/40 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar">
          {sortedDays.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDayTab(day)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
                day === activeDayTab
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'border-muted/40 text-muted-foreground hover:border-accent/40'
              )}
            >
              {DAYS[day]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setActiveDayTab(sortedDays[currentTabIdx + 1])}
          disabled={currentTabIdx === sortedDays.length - 1}
          className="p-2 rounded-lg border border-muted/40 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Session name */}
      <div className="px-4 space-y-1">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Nom de la séance</Label>
        <Input
          value={session.name}
          onChange={e => updateSession({ name: e.target.value })}
          placeholder={`Ex : Dos/Biceps, Push, Full Body…`}
          className="h-11 text-base"
        />
      </div>

      {/* Exercises */}
      <div className="px-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Exercices ({session.exercises.length})
        </p>
        {session.exercises.map((ex, idx) => (
          <ExerciseCard
            key={idx}
            exercise={ex}
            index={idx}
            onChange={(field, value) => updateExercise(idx, field, value)}
            onRemove={() => removeExercise(idx)}
            canRemove={session.exercises.length > 1}
          />
        ))}
      </div>

      {/* Add exercise */}
      <div className="px-4">
        <Button
          type="button"
          variant="outline"
          onClick={addExercise}
          className="w-full h-11 border-dashed border-accent/40 text-accent hover:bg-accent/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un exercice
        </Button>
      </div>

      {/* Navigation */}
      <div className="px-4 flex gap-3 pt-2 border-t border-muted/20 mt-2">
        <Button variant="outline" onClick={onBack} className="h-12 px-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          onClick={onSave}
          disabled={saving}
          className="flex-1 h-12 font-bold bg-green-600 hover:bg-green-700 text-white"
        >
          {saving ? 'Sauvegarde…' : '✓ Sauvegarder le programme'}
        </Button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MyProgram() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { saveCampaign } = useCampaignManager()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [programName, setProgramName] = useState('')
  const [activeDays, setActiveDays] = useState<Set<number>>(new Set())
  const [sessions, setSessions] = useState<Record<number, SessionDraft>>({})
  const [existingCampaignId, setExistingCampaignId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(true)

  // Load existing program if any
  useEffect(() => {
    if (!profile?.id) return
    const loadProgram = async () => {
      try {
        const { data: campaign } = await supabase
          .from('campaigns')
          .select(`
            id, title,
            quests(
              id, title, day_of_week,
              quest_exercises(id, name, sets_count, target_reps, target_weight, rest_seconds, order_index)
            )
          `)
          .eq('owner_user_id', profile.id)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle()

        if (campaign) {
          setExistingCampaignId(campaign.id)
          setProgramName(campaign.title)

          const days = new Set<number>()
          const sessionMap: Record<number, SessionDraft> = {}

          for (const quest of campaign.quests ?? []) {
            if (quest.day_of_week == null) continue
            days.add(quest.day_of_week)
            const exercises: ExerciseDraft[] = (quest.quest_exercises ?? [])
              .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
              .map((ex: any) => ({
                id: ex.id,
                name: ex.name,
                sets_count: ex.sets_count ?? 3,
                target_reps: ex.target_reps ?? 8,
                target_weight: ex.target_weight ?? null,
                rest_seconds: ex.rest_seconds ?? 90,
              }))
            sessionMap[quest.day_of_week] = {
              questId: quest.id,
              name: quest.title,
              exercises: exercises.length > 0 ? exercises : [emptyExercise()],
            }
          }

          setActiveDays(days)
          setSessions(sessionMap)
        }
      } finally {
        setLoadingExisting(false)
      }
    }
    loadProgram()
  }, [profile?.id])

  const toggleDay = (day: number) => {
    setActiveDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) {
        next.delete(day)
        setSessions(s => {
          const n = { ...s }
          delete n[day]
          return n
        })
      } else {
        next.add(day)
        setSessions(s => ({
          ...s,
          [day]: s[day] ?? emptySession(day),
        }))
      }
      return next
    })
  }

  const goToStep2 = () => setStep(2)

  const goToStep3 = () => {
    // Ensure sessions exist for all active days
    setSessions(prev => {
      const next = { ...prev }
      activeDays.forEach(day => {
        if (!next[day]) next[day] = emptySession(day)
      })
      return next
    })
    setStep(3)
  }

  const handleSave = async () => {
    if (!profile?.id) return
    setSaving(true)
    try {
      let campaignId = existingCampaignId

      if (!campaignId) {
        // Create new campaign
        campaignId = await saveCampaign(
          {
            title: programName,
            slug: '',
            description: '',
            is_active: true,
            level_required: 'BEGINNER',
            equipment_tags: [],
            estimated_duration_weeks: 12,
          },
          true,
          profile.id
        )
      } else {
        // Update existing campaign title
        await supabase
          .from('campaigns')
          .update({ title: programName })
          .eq('id', campaignId)
      }

      const sortedDays = [...activeDays].sort((a, b) => a - b)

      // Delete quests for days that were deactivated (edit mode)
      if (existingCampaignId) {
        const { data: existingQuests } = await supabase
          .from('quests')
          .select('id, day_of_week')
          .eq('campaign_id', campaignId)

        const deactivatedQuests = (existingQuests ?? []).filter(
          q => q.day_of_week != null && !activeDays.has(q.day_of_week)
        )
        for (const q of deactivatedQuests) {
          await supabase.from('quest_exercises').delete().eq('quest_id', q.id)
          await supabase.from('quests').delete().eq('id', q.id)
        }
      }

      // Upsert each session
      for (let i = 0; i < sortedDays.length; i++) {
        const day = sortedDays[i]
        const session = sessions[day]
        if (!session) continue

        const questPayload = {
          campaign_id: campaignId,
          title: session.name || DAYS[day],
          type: 'quete' as const,
          workout_type: 'strength' as const,
          order_index: i + 1,
          day_of_week: day,
          xp_force: 30,
          xp_endurance: 10,
          xp_agilite: 5,
          xp_mental: 5,
          xp_total: 50,
          is_published: false,
          is_one_shot: false,
          level_required: 'BEGINNER' as const,
          equipment_tags: [],
          estimated_duration_minutes: Math.max(30, session.exercises.length * 8),
          rest_seconds: 90,
          work_seconds: 0,
          rounds_target: 0,
          total_minutes: 0,
        }

        let questId = session.questId

        if (questId) {
          await supabase.from('quests').update(questPayload).eq('id', questId)
        } else {
          const { data: created, error } = await supabase
            .from('quests')
            .insert(questPayload)
            .select('id')
            .single()
          if (error) throw error
          questId = created.id
        }

        // Sync exercises
        const validExercises = session.exercises.filter(ex => ex.name.trim())

        // Delete exercises not in the current list
        const existingIds = validExercises.map(ex => ex.id).filter(Boolean) as string[]
        if (existingIds.length > 0) {
          await supabase
            .from('quest_exercises')
            .delete()
            .eq('quest_id', questId)
            .not('id', 'in', `(${existingIds.join(',')})`)
        } else {
          await supabase.from('quest_exercises').delete().eq('quest_id', questId)
        }

        // Upsert exercises
        if (validExercises.length > 0) {
          const exercisePayload = validExercises.map((ex, idx) => ({
            ...(ex.id ? { id: ex.id } : {}),
            quest_id: questId,
            name: ex.name,
            order_index: idx + 1,
            sets_count: ex.sets_count,
            target_reps: ex.target_reps,
            target_weight: ex.target_weight ?? null,
            rest_seconds: ex.rest_seconds,
            notes: null,
          }))
          const { error } = await supabase
            .from('quest_exercises')
            .upsert(exercisePayload, { onConflict: 'id' })
          if (error) throw error
        }
      }

      toast({
        title: existingCampaignId ? 'Programme mis à jour !' : 'Programme créé !',
        description: `${sortedDays.length} séance${sortedDays.length > 1 ? 's' : ''} enregistrée${sortedDays.length > 1 ? 's' : ''}`,
      })
      navigate('/')
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le programme.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loadingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={() => (step === 1 ? navigate(-1) : setStep((step - 1) as 1 | 2 | 3))}
          className="p-2 rounded-lg border border-muted/40 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-black text-lg">
          {existingCampaignId ? 'Modifier mon programme' : 'Créer mon programme'}
        </h1>
      </div>

      <StepBar step={step} />

      {step === 1 && (
        <Step1
          programName={programName}
          onChange={setProgramName}
          onNext={goToStep2}
        />
      )}

      {step === 2 && (
        <Step2
          activeDays={activeDays}
          onToggle={toggleDay}
          onBack={() => setStep(1)}
          onNext={goToStep3}
        />
      )}

      {step === 3 && (
        <Step3
          activeDays={activeDays}
          sessions={sessions}
          onSessionChange={(day, session) =>
            setSessions(prev => ({ ...prev, [day]: session }))
          }
          onBack={() => setStep(2)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  )
}
