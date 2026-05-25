import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { RefreshCw, Search, Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGlobalExercises } from '@/hooks/useGlobalExercises'

const EQUIPMENT_FR: Record<string, string> = {
  barbell: 'Barre', dumbbell: 'Haltères', cable: 'Poulie', machine: 'Machine',
  bodyweight: 'Poids corps', 'body weight': 'Poids corps',
  bands: 'Élastiques', 'resistance band': 'Élastiques',
  kettlebell: 'Kettlebell', other: 'Autre',
}

const EQUIPMENT_COLORS: Record<string, string> = {
  barbell: 'bg-orange-500/20 text-orange-400',
  dumbbell: 'bg-blue-500/20 text-blue-400',
  cable: 'bg-purple-500/20 text-purple-400',
  machine: 'bg-cyan-500/20 text-cyan-400',
  bodyweight: 'bg-emerald-500/20 text-emerald-400',
  'body weight': 'bg-emerald-500/20 text-emerald-400',
  bands: 'bg-pink-500/20 text-pink-400',
  'resistance band': 'bg-pink-500/20 text-pink-400',
  kettlebell: 'bg-amber-500/20 text-amber-400',
  other: 'bg-muted/40 text-muted-foreground',
}

const DIFFICULTY_FR: Record<string, string> = {
  beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé', expert: 'Expert',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
  expert: 'bg-red-500/20 text-red-400',
}

export interface SubstituteDrawerProps {
  currentExerciseName: string
  muscleGroup: string | null
  onSubstitute: (id: string, name: string, bodyPart: string) => void
}

export function SubstituteDrawer({ currentExerciseName, muscleGroup, onSubstitute }: SubstituteDrawerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { exercises, loading } = useGlobalExercises(open, muscleGroup)

  const q = search.trim().toLowerCase()
  const filtered = q.length >= 2
    ? exercises.filter(e =>
        e.name !== currentExerciseName &&
        (e.name.toLowerCase().includes(q) || (e.name_fr ?? '').toLowerCase().includes(q))
      )
    : exercises.filter(e => e.name !== currentExerciseName)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground gap-1 hover:text-foreground"
        >
          <RefreshCw className="w-3 h-3" />
          Remplacer
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] flex flex-col pb-safe">
        <SheetHeader className="mb-3 shrink-0">
          <SheetTitle className="text-base">Remplacer l'exercice</SheetTitle>
          <p className="text-xs text-muted-foreground">
            Remplace <span className="font-medium text-foreground">{currentExerciseName}</span>
            {muscleGroup ? ` · ${muscleGroup}` : ''}
          </p>
        </SheetHeader>

        <div className="relative shrink-0 mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">Aucun résultat</div>
          ) : (
            filtered.map(ex => (
              <button
                key={ex.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/20 transition-colors text-left"
                onClick={() => {
                  onSubstitute(ex.id, ex.name, ex.body_part)
                  setOpen(false)
                  setSearch('')
                }}
              >
                {/* Thumbnail GIF */}
                <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center">
                  {ex.image_url ? (
                    <img
                      src={ex.image_url}
                      alt={ex.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
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
                    <p className="text-xs text-muted-foreground/60 truncate capitalize">{ex.target_muscle}</p>
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
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', EQUIPMENT_COLORS[ex.equipment] ?? EQUIPMENT_COLORS.other)}>
                      {EQUIPMENT_FR[ex.equipment] ?? ex.equipment}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
