import { cn } from "@/lib/utils"
import { ProgressBar } from "./progress-bar"
import { Badge } from "./badge"
import { useRpgProgress } from "@/hooks/useRpgProgress"

interface LevelDisplayProps {
  className?: string
  showProgress?: boolean
  showTitle?: boolean
  variant?: 'compact' | 'detailed'
}

export function LevelDisplay({ 
  className, 
  showProgress = true, 
  showTitle = true,
  variant = 'detailed' 
}: LevelDisplayProps) {
  const { getPlayerLevel, getLevelTitle, getXpProgress } = useRpgProgress()
  
  const level = getPlayerLevel()
  const title = getLevelTitle()
  const xpProgress = getXpProgress()

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
          Niv. {level}
        </Badge>
        {showProgress && (
          <div className="flex-1 min-w-0">
            <ProgressBar 
              value={xpProgress.current} 
              max={xpProgress.next} 
              variant="xp" 
              className="h-2"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("rpg-card p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <div className="font-bold text-primary">Niveau {level}</div>
              {showTitle && (
                <div className="text-sm text-muted-foreground">{title}</div>
              )}
            </div>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary">
          {Math.round(xpProgress.percentage)}%
        </Badge>
      </div>
      
      {showProgress && (
        <div className="space-y-2">
          <ProgressBar 
            value={xpProgress.current} 
            max={xpProgress.next} 
            variant="xp" 
            animated
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{xpProgress.current} XP</span>
            <span>{xpProgress.next} XP</span>
          </div>
        </div>
      )}
    </div>
  )
}