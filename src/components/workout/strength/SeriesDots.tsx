import { cn } from '@/lib/utils'

export interface SeriesDotsProps {
  total: number
  current: number
  completedLogs: number
}

export function SeriesDots({ total, current, completedLogs }: SeriesDotsProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => {
        const setNumber = i + 1
        const isDone = setNumber <= completedLogs
        const isActive = setNumber === current && !isDone

        return (
          <div
            key={i}
            className={cn(
              'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
              isDone && 'bg-accent border-accent text-accent-foreground',
              isActive && 'border-accent ring-2 ring-accent animate-pulse text-accent',
              !isDone && !isActive && 'border-muted text-muted-foreground'
            )}
          >
            {isDone ? '✓' : setNumber}
          </div>
        )
      })}
    </div>
  )
}
