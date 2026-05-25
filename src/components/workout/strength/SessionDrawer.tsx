import { QuestExercise } from '@/types/workout'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { List, Square, CheckSquare, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SessionDrawerProps {
  exercises: QuestExercise[]
  currentExerciseIndex: number
  exerciseLogs: Array<{ exercise_id: string }>
  completedSets: number
  onSwitchTo: (index: number) => void
}

export function SessionDrawer({
  exercises,
  currentExerciseIndex,
  exerciseLogs,
  completedSets,
  onSwitchTo
}: SessionDrawerProps) {
  const totalSetsPlanned = exercises.reduce((sum, ex) => sum + ((ex as any).sets_count || 3), 0)

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

        <div className="space-y-2">
          {exercises.map((exercise, index) => {
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

                {isUpcoming && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs h-7 px-2"
                    onClick={() => onSwitchTo(index)}
                  >
                    Faire maintenant
                  </Button>
                )}
                {isActive && (
                  <span className="shrink-0 text-xs text-accent font-medium">En cours</span>
                )}
              </div>
            )
          })}
        </div>

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
