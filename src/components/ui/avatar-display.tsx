import { cn } from "@/lib/utils"

interface AvatarDisplayProps {
  level: number
  xp: number
  xpToNext: number
  name: string
  className?: string
}

export function AvatarDisplay({ level, xp, xpToNext, name, className }: AvatarDisplayProps) {
  return (
    <div className={cn("rpg-card p-6 text-center space-y-4", className)}>
      <div className="relative">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center text-4xl animate-float">
          🧙‍♂️
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold text-sm animate-glow">
          Niveau {level}
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="font-bold text-xl">{name}</h2>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>XP</span>
            <span>{xp}/{xpToNext}</span>
          </div>
          <div className="stat-bar">
            <div 
              className="h-full xp-gradient transition-all duration-700"
              style={{ width: `${(xp / xpToNext) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}