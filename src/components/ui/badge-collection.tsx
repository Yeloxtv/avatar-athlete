import { cn } from "@/lib/utils"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

interface BadgeCollectionProps {
  badges: Badge[]
  className?: string
}

export function BadgeCollection({ badges, className }: BadgeCollectionProps) {
  return (
    <div className={cn("rpg-card p-6", className)}>
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <span>🏆</span>
        Badges Collectés
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300",
              badge.unlocked 
                ? "bg-accent/10 border-accent/30 animate-glow" 
                : "bg-muted/20 border-muted/30 opacity-50"
            )}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl">{badge.icon}</div>
              <div>
                <div className={cn(
                  "font-medium text-sm",
                  badge.unlocked ? "text-accent" : "text-muted-foreground"
                )}>
                  {badge.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {badge.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}