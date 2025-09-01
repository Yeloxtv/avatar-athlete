import { cn } from "@/lib/utils"
import { ProgressBar } from "./progress-bar"

interface StatCardProps {
  name: string
  value: number
  max: number
  variant: 'force' | 'endurance' | 'agilite' | 'mental'
  icon?: React.ReactNode
  className?: string
}

const statConfig = {
  force: { color: 'text-stats-force', emoji: '💪' },
  endurance: { color: 'text-stats-endurance', emoji: '🏃' },
  agilite: { color: 'text-stats-agilite', emoji: '⚡' },
  mental: { color: 'text-stats-mental', emoji: '🧠' }
}

export function StatCard({ name, value, max, variant, icon, className }: StatCardProps) {
  const config = statConfig[variant]
  
  return (
    <div className={cn("rpg-card p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon || config.emoji}</span>
          <span className={cn("font-semibold capitalize", config.color)}>
            {name}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {value}/{max}
        </span>
      </div>
      <ProgressBar value={value} max={max} variant={variant} />
    </div>
  )
}