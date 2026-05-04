import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  name_fr: string | null
  muscle_group: string
  equipment: string
  category: string
  level: string
}

const MUSCLE_GROUPS = [
  { key: 'chest', label: 'Pectoraux', emoji: '🫁' },
  { key: 'back', label: 'Dos', emoji: '🦅' },
  { key: 'shoulders', label: 'Épaules', emoji: '💪' },
  { key: 'arms', label: 'Bras', emoji: '💪' },
  { key: 'legs', label: 'Jambes', emoji: '🦵' },
  { key: 'core', label: 'Abdos / Core', emoji: '🎯' },
  { key: 'other', label: 'Autre', emoji: '⚡' },
]

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barre',
  dumbbell: 'Haltères',
  cable: 'Poulie',
  machine: 'Machine',
  bodyweight: 'Poids corps',
  bands: 'Élastiques',
  kettlebell: 'Kettlebell',
  other: 'Autre',
}

const EQUIPMENT_COLORS: Record<string, string> = {
  barbell: 'bg-orange-500/20 text-orange-400',
  dumbbell: 'bg-blue-500/20 text-blue-400',
  cable: 'bg-purple-500/20 text-purple-400',
  machine: 'bg-cyan-500/20 text-cyan-400',
  bodyweight: 'bg-emerald-500/20 text-emerald-400',
  bands: 'bg-pink-500/20 text-pink-400',
  kettlebell: 'bg-amber-500/20 text-amber-400',
  other: 'bg-muted/40 text-muted-foreground',
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  expert: 'bg-red-500/20 text-red-400',
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  expert: 'Expert',
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['chest']))

  useEffect(() => {
    supabase
      .from('exercises')
      .select('id, name, name_fr, muscle_group, equipment, category, level')
      .order('name')
      .then(({ data }) => {
        setExercises(data ?? [])
        setLoading(false)
      })
  }, [])

  const q = search.trim().toLowerCase()
  const filtered = q.length >= 2
    ? exercises.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.name_fr ?? '').toLowerCase().includes(q)
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
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            Chargement...
          </div>
        ) : isSearching ? (
          /* Mode recherche : liste plate */
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Aucun résultat</p>
            ) : (
              filtered.map(ex => <ExerciseRow key={ex.id} ex={ex} />)
            )}
          </div>
        ) : (
          /* Mode groupé par muscle */
          <div className="space-y-2">
            {MUSCLE_GROUPS.map(group => {
              const groupExercises = filtered.filter(e => e.muscle_group === group.key)
              if (groupExercises.length === 0) return null
              const isOpen = openGroups.has(group.key)
              return (
                <div key={group.key} className="rounded-lg border border-muted/30 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                    onClick={() => toggleGroup(group.key)}
                  >
                    <span className="flex items-center gap-2 font-semibold text-sm">
                      <span>{group.emoji}</span>
                      <span>{group.label}</span>
                      <span className="text-muted-foreground font-normal">({groupExercises.length})</span>
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="divide-y divide-muted/20">
                      {groupExercises.map(ex => <ExerciseRow key={ex.id} ex={ex} />)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function ExerciseRow({ ex }: { ex: Exercise }) {
  return (
    <div className="flex items-start justify-between px-4 py-3 hover:bg-muted/10 transition-colors">
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-sm font-medium truncate">{ex.name}</p>
        {ex.name_fr && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{ex.name_fr}</p>
        )}
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[ex.level] ?? ''}`}>
          {LEVEL_LABELS[ex.level] ?? ex.level}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EQUIPMENT_COLORS[ex.equipment] ?? EQUIPMENT_COLORS.other}`}>
          {EQUIPMENT_LABELS[ex.equipment] ?? ex.equipment}
        </span>
      </div>
    </div>
  )
}
