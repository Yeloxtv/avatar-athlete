import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"

interface QuestCardProps {
  title: string
  description: string
  xpReward: number
  type: 'quest' | 'boss'
  difficulty: 'facile' | 'moyen' | 'difficile'
  duration: string
  completed?: boolean
  locked?: boolean
  onStart?: () => void
  className?: string
}

const difficultyColors = {
  facile: 'bg-stats-endurance/20 text-stats-endurance',
  moyen: 'bg-stats-agilite/20 text-stats-agilite', 
  difficile: 'bg-stats-force/20 text-stats-force'
}

export function QuestCard({
  title,
  description,
  xpReward,
  type,
  difficulty,
  duration,
  completed = false,
  locked = false,
  onStart,
  className
}: QuestCardProps) {
  return (
    <div className={cn(
      type === 'boss' ? 'boss-card' : 'quest-card',
      "p-6 space-y-4",
      locked && "opacity-50",
      completed && "border-stats-endurance/50",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{title}</h3>
            {type === 'boss' && <span className="text-xl">👑</span>}
            {completed && <span className="text-xl">✅</span>}
          </div>
          
          <div className="flex gap-2">
            <Badge className={difficultyColors[difficulty]}>
              {difficulty}
            </Badge>
            <Badge variant="secondary">
              {duration}
            </Badge>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-accent">
            <span className="text-sm font-medium">+{xpReward} XP</span>
            <span>⭐</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">{description}</p>

      <Button 
        onClick={onStart}
        disabled={locked || completed}
        variant={type === 'boss' ? 'destructive' : 'default'}
        className="w-full"
        size="lg"
      >
        {completed ? 'Terminé' : locked ? 'Verrouillé' : 'Commencer'}
      </Button>
    </div>
  )
}