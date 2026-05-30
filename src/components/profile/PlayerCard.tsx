import { EquippedRewards, Rarity, RARITY_COLORS, RARITY_LABEL } from '@/types/loot'
import { cn } from '@/lib/utils'

interface PlayerCardStats {
  streak: number
  totalSessions: number
  bestRarity: Rarity | null
}

interface PlayerCardProps {
  displayName: string
  avatarEmoji: string
  equipped: EquippedRewards
  stats: PlayerCardStats
  compact?: boolean
  className?: string
}

export function PlayerCard({ displayName, avatarEmoji, equipped, stats, compact = false, className }: PlayerCardProps) {
  const frameColor = equipped.frame ? RARITY_COLORS[equipped.frame.rarity] : 'border-accent/30'

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3 p-3 rounded-xl border bg-card', frameColor, className)}>
        <div className="text-3xl">{avatarEmoji || '🏋️'}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{displayName || 'Athlète'}</p>
          {equipped.title && (
            <p className={cn('text-xs font-medium truncate', RARITY_COLORS[equipped.title.rarity])}>
              {equipped.title.asset_key} {equipped.title.name}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-black text-accent">{stats.streak}</div>
          <div className="text-xs text-muted-foreground">🔥</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl border-2 bg-card p-5 space-y-4', frameColor, className)}>
      {/* Avatar + nom */}
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center text-4xl border-2',
          equipped.badge ? RARITY_COLORS[equipped.badge.rarity] : 'border-muted/30'
        )}>
          {avatarEmoji || '🏋️'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xl font-black truncate">{displayName || 'Athlète'}</p>
          {equipped.title ? (
            <p className={cn('text-sm font-bold', RARITY_COLORS[equipped.title.rarity])}>
              {equipped.title.asset_key} {equipped.title.name}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun titre équipé</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-muted/20 rounded-xl p-3">
          <div className="text-2xl font-black text-accent">{stats.streak}</div>
          <div className="text-xs text-muted-foreground">Streak 🔥</div>
        </div>
        <div className="bg-muted/20 rounded-xl p-3">
          <div className="text-2xl font-black">{stats.totalSessions}</div>
          <div className="text-xs text-muted-foreground">Séances</div>
        </div>
        <div className="bg-muted/20 rounded-xl p-3">
          {stats.bestRarity ? (
            <>
              <div className={cn('text-sm font-black', RARITY_COLORS[stats.bestRarity])}>
                {RARITY_LABEL[stats.bestRarity]}
              </div>
              <div className="text-xs text-muted-foreground">Meilleur drop</div>
            </>
          ) : (
            <>
              <div className="text-xl">📦</div>
              <div className="text-xs text-muted-foreground">Aucun drop</div>
            </>
          )}
        </div>
      </div>

      {/* Badge équipé */}
      {equipped.badge && (
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-sm', RARITY_COLORS[equipped.badge.rarity])}>
          <span>{equipped.badge.asset_key}</span>
          <span className="font-medium">{equipped.badge.name}</span>
        </div>
      )}
    </div>
  )
}
