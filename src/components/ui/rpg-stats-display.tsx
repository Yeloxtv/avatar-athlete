import { cn } from "@/lib/utils"
import { StatCard } from "./stat-card"
import { useProfile } from "@/hooks/useProfile"

interface RpgStatsDisplayProps {
  className?: string
  variant?: 'grid' | 'horizontal' | 'compact'
}

export function RpgStatsDisplay({ className, variant = 'grid' }: RpgStatsDisplayProps) {
  const { profile } = useProfile()

  if (!profile) {
    return (
      <div className={cn("rpg-card p-4", className)}>
        <div className="text-center text-muted-foreground">
          Chargement des statistiques...
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Force',
      value: profile.stat_force || 0,
      max: 100, // TODO: calculer le max dynamiquement
      variant: 'force' as const
    },
    {
      name: 'Endurance',
      value: profile.stat_endurance || 0,
      max: 100,
      variant: 'endurance' as const
    },
    {
      name: 'Agilité',
      value: profile.stat_agilite || 0,
      max: 100,
      variant: 'agilite' as const
    },
    {
      name: 'Mental',
      value: profile.stat_mental || 0,
      max: 100,
      variant: 'mental' as const
    }
  ]

  if (variant === 'horizontal') {
    return (
      <div className={cn("rpg-card p-4", className)}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📊</span>
          Statistiques RPG
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.name}
              name={stat.name}
              value={stat.value}
              max={stat.max}
              variant={stat.variant}
              className="p-3"
            />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-2", className)}>
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center gap-3">
            <div className="w-16 text-sm font-medium text-muted-foreground">
              {stat.name}
            </div>
            <StatCard
              name=""
              value={stat.value}
              max={stat.max}
              variant={stat.variant}
              className="flex-1 p-2"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {stats.map((stat) => (
        <StatCard
          key={stat.name}
          name={stat.name}
          value={stat.value}
          max={stat.max}
          variant={stat.variant}
        />
      ))}
    </div>
  )
}