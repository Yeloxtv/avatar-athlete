import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown, ChevronRight, X, Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GlobalExercise } from '@/hooks/useGlobalExercises'

// ─── Constants ────────────────────────────────────────────────────────────────

const BODY_PARTS = [
  { key: 'chest',       label: 'Pectoraux',      emoji: '🫁' },
  { key: 'back',        label: 'Dos',             emoji: '🦅' },
  { key: 'shoulders',   label: 'Épaules',         emoji: '🏋️' },
  { key: 'arms',        label: 'Bras',            emoji: '💪' },
  { key: 'legs',        label: 'Jambes',          emoji: '🦵' },
  { key: 'core',        label: 'Abdos / Core',    emoji: '🎯' },
  { key: 'strength',    label: 'Force',           emoji: '⚡' },
  { key: 'cardio',      label: 'Cardio',          emoji: '🏃' },
  { key: 'stretching',  label: 'Étirements',      emoji: '🧘' },
  { key: 'other',       label: 'Autre',           emoji: '➕' },
]

const EQUIPMENT_FR: Record<string, string> = {
  barbell:      'Barre',
  dumbbell:     'Haltères',
  cable:        'Poulie',
  machine:      'Machine',
  bodyweight:   'Poids corps',
  'body weight': 'Poids corps',
  bands:        'Élastiques',
  'resistance band': 'Élastiques',
  kettlebell:   'Kettlebell',
  other:        'Autre',
}

const EQUIPMENT_COLORS: Record<string, string> = {
  barbell:      'bg-orange-500/20 text-orange-400',
  dumbbell:     'bg-blue-500/20 text-blue-400',
  cable:        'bg-purple-500/20 text-purple-400',
  machine:      'bg-cyan-500/20 text-cyan-400',
  bodyweight:   'bg-emerald-500/20 text-emerald-400',
  'body weight': 'bg-emerald-500/20 text-emerald-400',
  bands:        'bg-pink-500/20 text-pink-400',
  'resistance band': 'bg-pink-500/20 text-pink-400',
  kettlebell:   'bg-amber-500/20 text-amber-400',
  other:        'bg-muted/40 text-muted-foreground',
}

const DIFFICULTY_FR: Record<string, string> = {
  beginner:     'Débutant',
  intermediate: 'Intermédiaire',
  advanced:     'Avancé',
  expert:       'Expert',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:     'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced:     'bg-red-500/20 text-red-400',
  expert:       'bg-red-500/20 text-red-400',
}

function equipmentColor(eq: string) {
  return EQUIPMENT_COLORS[eq] ?? EQUIPMENT_COLORS.other
}

// ─── Exercise detail modal ────────────────────────────────────────────────────

function ExerciseModal({ ex, onClose }: { ex: GlobalExercise; onClose: () => void }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="container max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex-1">
            <h2 className="font-bold text-xl leading-tight">{ex.name}</h2>
            {ex.name_fr && (
              <p className="text-sm text-muted-foreground mt-0.5">{ex.name_fr}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GIF */}
        {ex.gif_url && !imgError ? (
          <div className="rounded-xl overflow-hidden bg-muted/20 mb-4 flex items-center justify-center" style={{ minHeight: 220 }}>
            <img
              src={ex.gif_url}
              alt={ex.name}
              className="w-full object-contain max-h-72"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="rounded-xl bg-muted/20 mb-4 flex items-center justify-center" style={{ minHeight: 180 }}>
            <Dumbbell className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ex.difficulty && (
            <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', DIFFICULTY_COLORS[ex.difficulty] ?? 'bg-muted/30 text-muted-foreground')}>
              {DIFFICULTY_FR[ex.difficulty] ?? ex.difficulty}
            </span>
          )}
          {ex.equipment && (
            <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', equipmentColor(ex.equipment))}>
              {EQUIPMENT_FR[ex.equipment] ?? ex.equipment}
            </span>
          )}
          {ex.target_muscle && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-accent/20 text-accent">
              {ex.target_muscle}
            </span>
          )}
        </div>

        {/* Muscles secondaires */}
        {ex.secondary_muscles?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Muscles secondaires</p>
            <div className="flex flex-wrap gap-1.5">
              {ex.secondary_muscles.map(m => (
                <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {ex.instructions?.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Exécution</p>
            <ol className="space-y-3">
              {ex.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground flex-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Exercise row ─────────────────────────────────────────────────────────────

function ExerciseRow({ ex, onClick }: { ex: GlobalExercise; onClick: () => void }) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/10 transition-colors text-left"
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center">
        {ex.image_url && !imgError ? (
          <img
            src={ex.image_url}
            alt={ex.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <Dumbbell className="w-5 h-5 text-muted-foreground/40" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{ex.name}</p>
        {ex.name_fr && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{ex.name_fr}</p>
        )}
        {ex.target_muscle && (
          <p className="text-xs text-muted-foreground/60 truncate mt-0.5 capitalize">{ex.target_muscle}</p>
        )}
      </div>

      {/* Badges */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        {ex.difficulty && (
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', DIFFICULTY_COLORS[ex.difficulty] ?? 'bg-muted/30')}>
            {DIFFICULTY_FR[ex.difficulty] ?? ex.difficulty}
          </span>
        )}
        {ex.equipment && (
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', equipmentColor(ex.equipment))}>
            {EQUIPMENT_FR[ex.equipment] ?? ex.equipment}
          </span>
        )}
      </div>
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Exercises() {
  const [exercises, setExercises] = useState<GlobalExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['chest']))
  const [selected, setSelected] = useState<GlobalExercise | null>(null)

  useEffect(() => {
    supabase
      .from('exercises')
      .select('id, name, name_fr, body_part, target_muscle, secondary_muscles, equipment, difficulty, instructions, gif_url, image_url')
      .order('name')
      .then(({ data }) => {
        setExercises((data as GlobalExercise[]) ?? [])
        setLoading(false)
      })
  }, [])

  const q = search.trim().toLowerCase()
  const filtered = q.length >= 2
    ? exercises.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.name_fr ?? '').toLowerCase().includes(q) ||
        (e.target_muscle ?? '').toLowerCase().includes(q)
      )
    : exercises

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const isSearching = q.length >= 2

  // Groupes présents dans les données
  const presentGroups = BODY_PARTS.filter(g =>
    filtered.some(e => e.body_part === g.key)
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-muted/30 px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold mb-3">Exercices</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un exercice..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="px-4 py-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-4xl animate-spin">⚙️</div>
            <p className="text-muted-foreground text-sm">Chargement de la bibliothèque...</p>
          </div>
        ) : isSearching ? (
          <div className="space-y-1 rounded-xl border border-muted/30 overflow-hidden">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 text-sm">Aucun résultat</p>
            ) : (
              filtered.map(ex => (
                <ExerciseRow key={ex.id} ex={ex} onClick={() => setSelected(ex)} />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {presentGroups.map(group => {
              const groupExercises = filtered.filter(e => e.body_part === group.key)
              if (groupExercises.length === 0) return null
              const isOpen = openGroups.has(group.key)
              return (
                <div key={group.key} className="rounded-xl border border-muted/30 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                    onClick={() => toggleGroup(group.key)}
                  >
                    <span className="flex items-center gap-2 font-semibold text-sm">
                      <span>{group.emoji}</span>
                      <span>{group.label}</span>
                      <span className="text-muted-foreground font-normal">({groupExercises.length})</span>
                    </span>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    }
                  </button>
                  {isOpen && (
                    <div className="divide-y divide-muted/20">
                      {groupExercises.map(ex => (
                        <ExerciseRow key={ex.id} ex={ex} onClick={() => setSelected(ex)} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal détail */}
      {selected && (
        <ExerciseModal ex={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
