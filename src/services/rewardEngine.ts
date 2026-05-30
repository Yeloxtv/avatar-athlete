import { ChestTier, ChestDefinition, Rarity, SessionData } from '@/types/loot'

export function calculateChestTier(session: SessionData): ChestTier {
  // Guard — séance trop courte
  if (session.total_time_seconds < 300) return 'common'

  let score = 0

  // Durée
  if (session.total_time_seconds > 1800) score += 2  // > 30 min
  if (session.total_time_seconds > 3600) score += 1  // > 60 min

  // Volume muscu (kg × reps)
  if (session.total_volume > 3000) score += 1
  if (session.total_volume > 7000) score += 2

  // Densité (séries)
  if (session.sets_count >= 12) score += 1
  if (session.sets_count >= 20) score += 1

  // PR réalisé
  if (session.has_pr) score += 3

  // Streak
  if (session.streak >= 3) score += 1
  if (session.streak >= 7) score += 2

  // Finisher complété
  if (session.with_finisher) score += 1

  if (score >= 8) return 'legendary'
  if (score >= 5) return 'epic'
  if (score >= 3) return 'rare'
  return 'common'
}

export function rollChestReward(chest: ChestDefinition): Rarity {
  const roll = Math.random() * 100
  if (roll < chest.prob_legendary) return 'legendary'
  if (roll < chest.prob_legendary + chest.prob_epic) return 'epic'
  if (roll < chest.prob_legendary + chest.prob_epic + chest.prob_rare) return 'rare'
  return 'common'
}

export const CHEST_SLUG: Record<ChestTier, string> = {
  common:    'common_chest',
  rare:      'rare_chest',
  epic:      'epic_chest',
  legendary: 'legendary_chest',
}
