import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { RefreshCw, Search, Dumbbell, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGlobalExercises, type GlobalExercise } from '@/hooks/useGlobalExercises'
import { useAuth } from '@/hooks/useAuth'
import { CreateExerciseDialog } from '@/components/exercises/CreateExerciseDialog'

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

export interface SubstituteDrawerProps {
  currentExerciseName: string
  muscleGroup: string | null
  onSubstitute: (id: string, name: string, bodyPart: string) => void
}

export function SubstituteDrawer({ currentExerciseName, muscleGroup, onSubstitute }: SubstituteDrawerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [equipFilter, setEquipFilter] = useState<string | null>(null)
  const { user } = useAuth()

  const { exercises, loading } = useGlobalExercises(open, muscleGroup)

  const handleCreated = (ex: GlobalExercise) => {
    onSubstitute(ex.id, ex.name, ex.body_part)
    setOpen(false)
    setSearch('')
  }

  // Équipements présents dans ce groupe musculaire, triés par fréquence
  const equipments = useMemo(() => {
    const counts = new Map<string, number>()
    for (const e of exercises) {
      if (e.name === currentExerciseName || !e.equipment) continue
      counts.set(e.equipment, (counts.get(e.equipment) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([key]) => key)
  }, [exercises, currentExerciseName])

  // Recherche large (les noms ExerciseDB sont en anglais → on ratisse aussi
  // muscle ciblé, équipement et muscles secondaires)
  const q = search.trim().toLowerCase()
  const matchesSearch = (e: GlobalExercise) =>
    q.length < 2 ||
    [e.name, e.name_fr, e.target_muscle, e.equipment, ...(e.secondary_muscles ?? [])]
      .some(s => (s ?? '').toLowerCase().includes(q))

  const filtered = exercises.filter(e =>
    e.name !== currentExerciseName &&
    matchesSearch(e) &&
    (!equipFilter || e.equipment === equipFilter)
  )

  return (
    <>
    <Sheet open={open} onOpenChange={o => { setOpen(o); if (!o) { setSearch(''); setEquipFilter(null) } }}>
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

        {/* Filtres par équipement */}
        {equipments.length > 1 && (
          <div className="shrink-0 flex gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-1">
            <button
              type="button"
              onClick={() => setEquipFilter(null)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                equipFilter === null
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'border-muted/40 text-muted-foreground hover:border-accent/40'
              )}
            >
              Tous
            </button>
            {equipments.map(eq => (
              <button
                key={eq}
                type="button"
                onClick={() => setEquipFilter(eq === equipFilter ? null : eq)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap',
                  equipFilter === eq
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'border-muted/40 text-muted-foreground hover:border-accent/40'
                )}
              >
                {EQUIPMENT_FR[eq] ?? eq}
              </button>
            ))}
          </div>
        )}

        {/* Grille d'exercices */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <p className="text-muted-foreground text-sm">Aucun exercice trouvé</p>
              <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                {search.trim() ? `Créer « ${search.trim()} »` : 'Créer un exercice'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 pb-1">
              {filtered.map(ex => {
                const media = ex.gif_url ?? ex.image_url
                return (
                  <button
                    key={ex.id}
                    className="flex flex-col rounded-xl border border-muted/30 overflow-hidden hover:border-accent/50 transition-colors text-left"
                    onClick={() => {
                      onSubstitute(ex.id, ex.name, ex.body_part)
                      setOpen(false)
                      setSearch('')
                    }}
                  >
                    <div className="aspect-square bg-muted/20 flex items-center justify-center overflow-hidden">
                      {media ? (
                        <img
                          src={media}
                          alt={ex.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={e => { (e.target as HTMLImageElement).style.visibility = 'hidden' }}
                        />
                      ) : (
                        <Dumbbell className="w-8 h-8 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="p-2 space-y-1">
                      <p className="text-xs font-medium leading-tight line-clamp-2">{ex.name}</p>
                      {ex.equipment && (
                        <span className={cn('inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium', EQUIPMENT_COLORS[ex.equipment] ?? EQUIPMENT_COLORS.other)}>
                          {EQUIPMENT_FR[ex.equipment] ?? ex.equipment}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Créer un exercice manquant — toujours accessible */}
        {!loading && filtered.length > 0 && (
          <div className="shrink-0 pt-2 border-t border-muted/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="w-full gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
              {search.trim() ? `Créer « ${search.trim()} »` : 'Créer un exercice'}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>

    <CreateExerciseDialog
      open={createOpen}
      onOpenChange={setCreateOpen}
      userId={user?.id}
      defaultName={search.trim()}
      defaultBodyPart={muscleGroup}
      onCreated={handleCreated}
    />
    </>
  )
}
