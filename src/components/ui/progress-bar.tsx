import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  variant?: 'force' | 'endurance' | 'agilite' | 'mental' | 'xp'
  animated?: boolean
}

const variantStyles = {
  force: 'bg-stats-force',
  endurance: 'bg-stats-endurance', 
  agilite: 'bg-stats-agilite',
  mental: 'bg-stats-mental',
  xp: 'xp-gradient'
}

export function ProgressBar({ 
  value, 
  max, 
  className, 
  variant = 'xp',
  animated = false 
}: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100)
  
  return (
    <div className={cn("stat-bar bg-muted", className)}>
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out",
          variantStyles[variant],
          animated && "animate-pulse-glow"
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}