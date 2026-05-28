import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { useProgramBuilder, emptyExercise } from '@/hooks/useProgramBuilder'
import { useProgramPersistence } from '@/hooks/useProgramPersistence'
import { ExerciseDraft, SessionDraft, FinisherDraft, FinisherExerciseDraft } from '@/types/program'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Plus, Trash2, ChevronLeft, ChevronRight, Check, GripVertical, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useGlobalExercises } from '@/hooks/useGlobalExercises'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

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

// ─── Exercise autocomplete ────────────────────────────────────────────────────

function ExerciseAutocomplete({
  value,
  onChange,
  allExercises,
}: {
  value: string
  onChange: (name: string, globalId: string | null) => void
  allExercises: ReturnType<typeof useGlobalExercises>['exercises']
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const q = value.trim().toLowerCase()
  const suggestions = q.length >= 2
    ? allExercises
        .filter(e =>
          e.name.toLowerCase().includes(q) ||
          (e.name_fr ?? '').toLowerCase().includes(q)
        )
        .slice(0, 8)
    : []

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <Input
        value={value}
        onChange={e => { onChange(e.target.value, null); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Nom de l'exercice"
        className="h-11 text-base"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-muted/40 bg-background shadow-lg overflow-hidden">
          {suggestions.map(ex => (
            <button
              key={ex.id}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/20 transition-colors"
              onMouseDown={e => {
                e.preventDefault()
                onChange(ex.name, ex.id)
                setOpen(false)
              }}
            >
              {ex.gif_url && (
                <img src={ex.gif_url} alt={ex.name} className="w-8 h-8 rounded object-cover shrink-0" loading="lazy" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{ex.name}</p>
                {ex.name_fr && <p className="text-xs text-muted-foreground truncate">{ex.name_fr}</p>}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground/60 capitalize ml-auto">{ex.body_part}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Exercise card (sortable) ─────────────────────────────────────────────────

function ExerciseCard({
  exercise,
  index,
  onChange,
  onRemove,
  canRemove,
  allExercises,
}: {
  exercise: ExerciseDraft
  index: number
  onChange: (field: keyof ExerciseDraft, value: string | number | null) => void
  onRemove: () => void
  canRemove: boolean
  allExercises: ReturnType<typeof useGlobalExercises>['exercises']
}) {
  const cardId = exercise.id ?? `ex-${index}`
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cardId })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-muted/40 bg-muted/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" {...attributes} {...listeners} className="touch-none text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Exercice {index + 1}
          </span>
        </div>
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

      <ExerciseAutocomplete
        value={exercise.name}
        allExercises={allExercises}
        onChange={(name, globalId) => {
          onChange('name', name)
          if (globalId !== null) onChange('global_exercise_id', globalId)
        }}
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

const FINISHER_FORMATS: { value: FinisherDraft['format']; label: string; desc: string }[] = [
  { value: 'amrap', label: 'AMRAP', desc: 'Max rounds' },
  { value: 'emom', label: 'EMOM', desc: 'Every min' },
  { value: 'tabata', label: 'Tabata', desc: '20s/10s' },
]

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

  // Load all exercises once for autocomplete
  const { exercises: allExercises } = useGlobalExercises(true, null)

  // DnD sensors — pointer + touch for mobile
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = session.exercises.findIndex((ex, i) => (ex.id ?? `ex-${i}`) === active.id)
    const newIdx = session.exercises.findIndex((ex, i) => (ex.id ?? `ex-${i}`) === over.id)
    if (oldIdx === -1 || newIdx === -1) return
    updateSession({ exercises: arrayMove(session.exercises, oldIdx, newIdx) })
  }

  // Finisher helpers
  const finisher = session.finisher
  const addFinisher = () => updateSession({
    finisher: { format: 'amrap', duration_minutes: 10, exercises: [{ name: '', target_reps: 10, reps_unit: 'reps' }] }
  })
  const removeFinisher = () => updateSession({ finisher: null })
  const updateFinisher = (updates: Partial<FinisherDraft>) => {
    if (!finisher) return
    updateSession({ finisher: { ...finisher, ...updates } })
  }
  const updateFinisherExercise = (idx: number, field: keyof FinisherExerciseDraft, value: string | number | null) => {
    if (!finisher) return
    const newExs = finisher.exercises.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex)
    updateFinisher({ exercises: newExs })
  }

  const currentTabIdx = sortedDays.indexOf(activeDayTab)
  const exIds = session.exercises.map((ex, i) => ex.id ?? `ex-${i}`)

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

      {/* Exercises with DnD */}
      <div className="px-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Exercices ({session.exercises.length})
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={exIds} strategy={verticalListSortingStrategy}>
            {session.exercises.map((ex, idx) => (
              <ExerciseCard
                key={ex.id ?? `ex-${idx}`}
                exercise={ex}
                index={idx}
                onChange={(field, value) => updateExercise(idx, field, value)}
                onRemove={() => removeExercise(idx)}
                canRemove={session.exercises.length > 1}
                allExercises={allExercises}
              />
            ))}
          </SortableContext>
        </DndContext>
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

      {/* Finisher section */}
      <div className="px-4">
        {!finisher ? (
          <Button
            type="button"
            variant="outline"
            onClick={addFinisher}
            className="w-full h-11 border-dashed border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/5"
          >
            <Zap className="w-4 h-4 mr-2" />
            Ajouter un finisher HIIT
          </Button>
        ) : (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-bold text-yellow-500">Finisher HIIT</span>
              </div>
              <button type="button" onClick={removeFinisher} className="text-muted-foreground/50 hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Format picker */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Format</Label>
              <div className="flex gap-2">
                {FINISHER_FORMATS.map(f => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => updateFinisher({ format: f.value })}
                    className={cn(
                      'flex-1 flex flex-col items-center py-2 rounded-lg border-2 text-xs font-bold transition-all',
                      finisher.format === f.value
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                        : 'border-muted/40 text-muted-foreground'
                    )}
                  >
                    <span>{f.label}</span>
                    <span className="font-normal opacity-70">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Durée : {finisher.duration_minutes} min
              </Label>
              <div className="flex gap-1.5">
                {[8, 9, 10, 11, 12].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateFinisher({ duration_minutes: m })}
                    className={cn(
                      'flex-1 h-9 rounded-lg border-2 text-sm font-bold transition-all',
                      finisher.duration_minutes === m
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                        : 'border-muted/40 text-muted-foreground'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Finisher exercises */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Exercices du finisher</Label>
              {finisher.exercises.map((fex, fidx) => (
                <div key={fidx} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <ExerciseAutocomplete
                      value={fex.name}
                      allExercises={allExercises}
                      onChange={(name, globalId) => {
                        updateFinisherExercise(fidx, 'name', name)
                        if (globalId) updateFinisherExercise(fidx, 'global_exercise_id', globalId)
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={1}
                      value={fex.target_reps}
                      onChange={e => updateFinisherExercise(fidx, 'target_reps', parseInt(e.target.value) || 1)}
                      className="w-16 h-11 text-center font-bold px-1"
                    />
                    <select
                      value={fex.reps_unit ?? 'reps'}
                      onChange={e => updateFinisherExercise(fidx, 'reps_unit', e.target.value)}
                      className="h-11 rounded-md border border-input bg-background px-2 text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="reps">reps</option>
                      <option value="m">m</option>
                      <option value="cal">cal</option>
                    </select>
                  </div>
                  {finisher.exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => updateFinisher({ exercises: finisher.exercises.filter((_, i) => i !== fidx) })}
                      className="text-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateFinisher({ exercises: [...finisher.exercises, { name: '', target_reps: 10, reps_unit: 'reps' }] })}
                className="text-yellow-500 hover:text-yellow-500 hover:bg-yellow-500/10 w-full"
              >
                <Plus className="w-3 h-3 mr-1" /> Ajouter un exercice
              </Button>
            </div>
          </div>
        )}
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
  const { user } = useAuth()

  const builder = useProgramBuilder()
  const persistence = useProgramPersistence()

  const [existingCampaignId, setExistingCampaignId] = useState<string | null>(null)

  // Load existing program if any — use auth UID so RLS matches owner_user_id
  useEffect(() => {
    if (!user?.id) return
    persistence.loadExistingProgram(user.id).then(loaded => {
      if (loaded) {
        setExistingCampaignId(loaded.campaignId)
        builder.setProgramName(loaded.programName)
        builder.setActiveDays(loaded.activeDays)
        builder.setSessions(loaded.sessions)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleSave = async () => {
    if (!user?.id) return
    try {
      await persistence.saveProgram(
        {
          programName: builder.programName,
          activeDays: builder.activeDays,
          sessions: builder.sessions,
        },
        user.id,
        existingCampaignId
      )
      navigate('/')
    } catch {
      // toast already shown inside saveProgram
    }
  }

  if (persistence.loading) {
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
          onClick={() => (builder.step === 1 ? navigate(-1) : builder.setStep((builder.step - 1) as 1 | 2 | 3))}
          className="p-2 rounded-lg border border-muted/40 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="font-black text-lg">
          {existingCampaignId ? 'Modifier mon programme' : 'Créer mon programme'}
        </h1>
      </div>

      <StepBar step={builder.step} />

      {builder.step === 1 && (
        <Step1
          programName={builder.programName}
          onChange={builder.setProgramName}
          onNext={builder.goToStep2}
        />
      )}

      {builder.step === 2 && (
        <Step2
          activeDays={builder.activeDays}
          onToggle={builder.toggleDay}
          onBack={() => builder.setStep(1)}
          onNext={builder.goToStep3}
        />
      )}

      {builder.step === 3 && (
        <Step3
          activeDays={builder.activeDays}
          sessions={builder.sessions}
          onSessionChange={(day, session) =>
            builder.setSessions(prev => ({ ...prev, [day]: session }))
          }
          onBack={() => builder.setStep(2)}
          onSave={handleSave}
          saving={persistence.saving}
        />
      )}
    </div>
  )
}
