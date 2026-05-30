import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCollection } from '@/hooks/useCollection'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RarityBadge } from '@/components/loot/RarityBadge'
import { ArrowLeft, Loader2, Package } from 'lucide-react'
import { RewardDefinition, Rarity, RewardType, RARITY_COLORS } from '@/types/loot'
import { cn } from '@/lib/utils'

const TYPE_LABEL: Record<RewardType, string> = {
  title: 'Titre', frame: 'Cadre', background: 'Fond', badge: 'Badge', aura: 'Aura',
}

const FILTER_RARITIES: Array<Rarity | 'all'> = ['all', 'legendary', 'epic', 'rare', 'common']

export default function Collection() {
  const navigate = useNavigate()
  const { rewards, equipped, loading, equipReward, unequipReward, markSeen } = useCollection()
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all')

  const filtered = rewards.filter(r => rarityFilter === 'all' || r.reward?.rarity === rarityFilter)

  const isEquipped = (reward: RewardDefinition) => {
    const slot = reward.type as keyof typeof equipped
    return equipped[slot]?.id === reward.id
  }

  const handleEquip = async (reward: RewardDefinition, userRewardId: string) => {
    if (isEquipped(reward)) {
      await unequipReward(reward.type as any)
    } else {
      await equipReward(reward)
      await markSeen(userRewardId)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-6 h-6 animate-spin text-accent" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-5">

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Ma Collection</h1>
      </div>

      {/* Équipés */}
      {(equipped.title || equipped.frame || equipped.badge) && (
        <Card className="border-accent/30">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">Équipés</p>
            <div className="flex flex-wrap gap-2">
              {(['title', 'frame', 'background', 'badge'] as const).map(slot => {
                const r = equipped[slot]
                if (!r) return null
                return (
                  <div key={slot} className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm', RARITY_COLORS[r.rarity])}>
                    <span>{r.asset_key ?? '🏆'}</span>
                    <span className="font-medium">{r.name}</span>
                    <button
                      className="text-muted-foreground hover:text-foreground ml-1 text-xs"
                      onClick={() => unequipReward(slot)}
                    >✕</button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres rarity */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTER_RARITIES.map(r => (
          <button
            key={r}
            onClick={() => setRarityFilter(r)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors',
              rarityFilter === r
                ? 'bg-accent text-accent-foreground border-accent'
                : 'border-muted/40 text-muted-foreground hover:border-accent/40'
            )}
          >
            {r === 'all' ? 'Tout' : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Liste rewards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Package className="w-12 h-12 opacity-30" />
          <p className="text-muted-foreground text-sm">
            {rewards.length === 0
              ? 'Complète des séances pour débloquer des rewards.'
              : 'Aucune reward pour ce filtre.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(ur => {
            const r = ur.reward
            if (!r) return null
            const equipped_ = isEquipped(r)
            return (
              <Card
                key={ur.id}
                className={cn(
                  'overflow-hidden transition-all',
                  equipped_ ? 'border-accent/60 bg-accent/5' : 'border-muted/30',
                  ur.is_new && !equipped_ && 'ring-2 ring-accent/40'
                )}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-2xl">{r.asset_key ?? '🏆'}</span>
                    {ur.is_new && <span className="text-[10px] font-black bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">NEW</span>}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{TYPE_LABEL[r.type]}</p>
                  </div>
                  <RarityBadge rarity={r.rarity} size="sm" />
                  {r.is_equippable && (
                    <Button
                      size="sm"
                      variant={equipped_ ? 'default' : 'outline'}
                      className="w-full h-8 text-xs"
                      onClick={() => handleEquip(r, ur.id)}
                    >
                      {equipped_ ? '✓ Équipé' : 'Équiper'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
