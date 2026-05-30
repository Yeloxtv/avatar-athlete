import { Rarity, RARITY_COLORS, RARITY_BG, RARITY_LABEL } from '@/types/loot'
import { cn } from '@/lib/utils'

interface RarityBadgeProps {
  rarity: Rarity
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RarityBadge({ rarity, size = 'md', className }: RarityBadgeProps) {
  const sizes = { sm: 'text-xs px-1.5 py-0.5', md: 'text-sm px-2 py-1', lg: 'text-base px-3 py-1.5' }
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-bold uppercase tracking-wider',
      sizes[size],
      RARITY_COLORS[rarity],
      RARITY_BG[rarity],
      className
    )}>
      {RARITY_LABEL[rarity]}
    </span>
  )
}
