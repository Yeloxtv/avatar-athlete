import { QuestExercise } from '@/types/workout'
import type { WorkoutBlock } from '@/hooks/useStrengthWorkout'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { List, Square, CheckSquare, Flame, Link2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
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

export interface SessionDrawerProps {
  exercises: QuestExercise[]
  blocks?: WorkoutBlock[]
  currentBlockIndex: number
  currentExerciseIndex: number
  exerciseLogs: Array<{ exercise_id: string }>
  completedSets: number
  onSwitchTo: (index: number) => void
  onReorder: (orderedIds: string[]) => void
}

export function SessionDrawer({
  exercises,
  blocks,
  currentBlockIndex,
  currentExerciseIndex,
  exerciseLogs,
  completedSets,
  onSwitchTo,
  onReorder,
}: SessionDrawerProps) {
  const totalSetsPlanned = exercises.reduce((sum, ex) => sum + ((ex as any).sets_count || 3), 0)

  // Fallback : si aucun bloc fourni, traiter chaque exercice comme un bloc simple.
  const effectiveBlocks: WorkoutBlock[] = blocks && blocks.length > 0
    ? blocks
    : exercises.map((_, i) => ({ exerciseIndices: [i], rounds: 0, restSeconds: 0, isSuperset: false }))

  // Blocs terminés + bloc en cours (verrouillés) vs blocs à venir (réordonnables)
  const lockedBlocks = effectiveBlocks.filter((_, i) => i <= currentBlockIndex)
  const upcomingBlocks = effectiveBlocks.filter((_, i) => i > currentBlockIndex)
  const upcomingIndices = upcomingBlocks.flatMap(b => b.exerciseIndices)
  const upcomingIds = upcomingIndices.map(i => exercises[i]?.id).filter(Boolean) as string[]
  // Map id → superset (pour l'indicateur visuel dans la liste à venir)
  const supersetIdSet = new Set(
    upcomingBlocks.filter(b => b.isSuperset).flatMap(b => b.exerciseIndices.map(i => exercises[i]?.id))
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = upcomingIds.indexOf(active.id as string)
    const newIdx = upcomingIds.indexOf(over.id as string)
    if (oldIdx === -1 || newIdx === -1) return
    const newUpcoming = arrayMove(upcomingIds, oldIdx, newIdx)
    const lockedIds = lockedBlocks.flatMap(b => b.exerciseIndices.map(i => exercises[i]?.id)).filter(Boolean) as string[]
    onReorder([...lockedIds, ...newUpcoming])
  }

  const renderRow = (index: number, groupLabel?: string) => {
    const exercise = exercises[index]
    if (!exercise) return null
    const targetSets = (exercise as any).sets_count || 3
    const done = exerciseLogs.filter(l => l.exercise_id === exercise.id).length
    const isCompleted = done >= targetSets || index < currentExerciseIndex
    const isActive = index === currentExerciseIndex
    const isUpcoming = !isCompleted && !isActive

    return (
      <div
        key={`${exercise.id}-${index}`}
        className={cn(
          'flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors',
          isCompleted && 'border-green-500/30 bg-green-500/5',
          isActive && 'border-accent/50 bg-accent/10',
          isUpcoming && 'border-muted bg-muted/10'
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {groupLabel && <span className="shrink-0 w-5 text-center text-xs font-bold text-accent">{groupLabel}</span>}
          <span className="shrink-0 text-base">
            {isCompleted
              ? <CheckSquare className="w-4 h-4 text-green-500" />
              : isActive
                ? <Flame className="w-4 h-4 text-accent" />
                : <Square className="w-4 h-4 text-muted-foreground" />
            }
          </span>
          <div className="min-w-0">
            <p className={cn(
              'text-sm font-medium truncate',
              isCompleted && 'text-green-500',
              isActive && 'text-accent',
              isUpcoming && 'text-muted-foreground'
            )}>
              {exercise.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {done}/{targetSets} séries
              {(exercise as any).target_reps ? ` · ${(exercise as any).target_reps} reps` : ''}
            </p>
          </div>
        </div>

        {isActive && (
          <span className="shrink-0 text-xs text-accent font-medium">En cours</span>
        )}
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full h-12 gap-2 text-sm font-semibold bg-yellow-400 text-yellow-900 border-0">
          <List className="w-4 h-4" />
          Voir la séance
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto pb-safe">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-base">Programme de la séance</SheetTitle>
        </SheetHeader>

        {/* Blocs terminés + en cours (non déplaçables) */}
        <div className="space-y-2">
          {lockedBlocks.map((block, bIdx) => {
            if (!block.isSuperset) return renderRow(block.exerciseIndices[0])
            return (
              <div key={`locked-${bIdx}`} className="rounded-lg border-2 border-accent/30 bg-accent/[0.03] p-2 space-y-2">
                <span className="flex items-center gap-1.5 px-1 text-[11px] font-bold text-accent uppercase tracking-wide">
                  <Link2 className="w-3 h-3" /> Superset
                </span>
                {block.exerciseIndices.map((exIdx, pos) =>
                  renderRow(exIdx, String.fromCharCode(65 + pos))
                )}
              </div>
            )
          })}
        </div>

        {/* Blocs à venir — réordonnables par drag & drop */}
        {upcomingIds.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1">
              À venir · glisse pour réorganiser
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={upcomingIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {upcomingIndices.map(index => {
                    const exercise = exercises[index]
                    if (!exercise) return null
                    return (
                      <SortableUpcomingRow
                        key={exercise.id}
                        id={exercise.id}
                        exercise={exercise}
                        done={exerciseLogs.filter(l => l.exercise_id === exercise.id).length}
                        isSuperset={supersetIdSet.has(exercise.id)}
                        onSwitchTo={() => onSwitchTo(index)}
                      />
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-muted/30">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-accent">{completedSets}</p>
              <p className="text-xs text-muted-foreground">Séries faites</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{totalSetsPlanned}</p>
              <p className="text-xs text-muted-foreground">Séries prévues</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SortableUpcomingRow({
  id,
  exercise,
  done,
  isSuperset,
  onSwitchTo,
}: {
  id: string
  exercise: QuestExercise
  done: number
  isSuperset: boolean
  onSwitchTo: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const targetSets = (exercise as any).sets_count || 3

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center justify-between gap-2 p-3 rounded-lg border bg-muted/10',
        isSuperset ? 'border-l-4 border-l-accent/50 border-y-muted border-r-muted' : 'border-muted'
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="touch-none shrink-0 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate text-muted-foreground flex items-center gap-1.5">
            {isSuperset && <Link2 className="w-3 h-3 text-accent shrink-0" />}
            {exercise.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {done}/{targetSets} séries
            {(exercise as any).target_reps ? ` · ${(exercise as any).target_reps} reps` : ''}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="shrink-0 text-xs h-7 px-2"
        onClick={onSwitchTo}
      >
        Faire maintenant
      </Button>
    </div>
  )
}
