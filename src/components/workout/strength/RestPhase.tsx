import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

function formatRestTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  return `0:${secs.toString().padStart(2, '0')}`
}

export interface RestPhaseProps {
  restTimer: number
  exerciseRestTime: number
  nextLabel: string
  onSkip: () => void
  onAdjust: (delta: number) => void
}

export function RestPhase({ restTimer, exerciseRestTime, nextLabel, onSkip, onAdjust }: RestPhaseProps) {
  const progressValue = exerciseRestTime > 0 ? (restTimer / exerciseRestTime) * 100 : 0

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Récupération
        </p>
        <p className="text-xs text-muted-foreground">
          Prochain : <span className="text-foreground font-medium">{nextLabel}</span>
        </p>
      </div>

      <div className="relative flex items-center justify-center w-52 h-52">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressValue / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="text-6xl font-mono font-bold text-accent tabular-nums">
          {formatRestTimer(restTimer)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="w-16"
          onClick={() => onAdjust(-30)}
        >
          −30s
        </Button>
        <Button
          onClick={onSkip}
          className="px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          Passer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-16"
          onClick={() => onAdjust(30)}
        >
          +30s
        </Button>
      </div>

      <Progress
        value={progressValue}
        className="w-full h-1.5 bg-muted"
      />
    </div>
  )
}
