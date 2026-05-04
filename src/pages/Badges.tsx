import { useState } from 'react'
import { useBadges, BADGES, CATEGORY_LABELS } from '@/hooks/useBadges'
import { toast } from '@/hooks/use-toast'
import { RefreshCw } from 'lucide-react'

export default function Badges() {
  const { unlockedIds, loading, recalculateAll } = useBadges()
  const [recalculating, setRecalculating] = useState(false)

  const handleRecalculate = async () => {
    setRecalculating(true)
    try {
      const newCount = await recalculateAll()
      if (newCount > 0) {
        toast({ title: `${newCount} nouveau${newCount > 1 ? 'x' : ''} badge${newCount > 1 ? 's' : ''} débloqué${newCount > 1 ? 's' : ''} !` })
      } else {
        toast({ title: 'Badges à jour', description: 'Aucun nouveau badge à débloquer.' })
      }
    } finally {
      setRecalculating(false)
    }
  }

  const categories = ['regularite', 'performance', 'specialite'] as const
  const unlockedCount = unlockedIds.size

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Badges</h1>
          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
            Recalculer
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {unlockedCount} / {BADGES.length} débloqués
        </p>
        {/* Barre de progression globale */}
        <div className="w-full h-2 bg-muted/40 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${Math.round((unlockedCount / BADGES.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Badges par catégorie */}
      {categories.map(cat => {
        const catBadges = BADGES.filter(b => b.category === cat)
        const catUnlocked = catBadges.filter(b => unlockedIds.has(b.id)).length

        return (
          <section key={cat} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">
                {CATEGORY_LABELS[cat]}
              </h2>
              <span className="text-xs text-muted-foreground">{catUnlocked}/{catBadges.length}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {catBadges.map(badge => {
                const unlocked = unlockedIds.has(badge.id)
                return (
                  <div key={badge.id} className="flex flex-col items-center gap-2">
                    <div className={`relative w-20 h-20 rounded-full overflow-hidden transition-all ${
                      unlocked ? '' : 'grayscale opacity-30'
                    }`}>
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold leading-tight ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {badge.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

    </div>
  )
}
