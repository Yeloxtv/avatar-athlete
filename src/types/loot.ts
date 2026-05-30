export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'
export type RewardType = 'title' | 'frame' | 'background' | 'badge' | 'aura'

export interface ChestDefinition {
  id: string
  slug: string
  name: string
  description: string | null
  rarity: Rarity
  prob_common: number
  prob_rare: number
  prob_epic: number
  prob_legendary: number
}

export interface UserChest {
  id: string
  user_id: string
  chest_id: string
  status: 'pending' | 'opened'
  source_session_id: string | null
  earned_at: string
  opened_at: string | null
  chest?: ChestDefinition
}

export interface RewardDefinition {
  id: string
  slug: string
  type: RewardType
  rarity: Rarity
  name: string
  description: string | null
  asset_key: string | null
  collection_slug: string | null
  is_equippable: boolean
}

export interface UserReward {
  id: string
  user_id: string
  reward_id: string
  source_session_id: string | null
  source_chest_id: string | null
  is_new: boolean
  unlocked_at: string
  reward: RewardDefinition
}

export interface EquippedRewards {
  title: RewardDefinition | null
  frame: RewardDefinition | null
  background: RewardDefinition | null
  badge: RewardDefinition | null
}

export interface SessionData {
  total_time_seconds: number
  total_volume: number
  sets_count: number
  has_pr: boolean
  streak: number
  with_finisher: boolean
}

export type ChestTier = 'common' | 'rare' | 'epic' | 'legendary'

export const RARITY_COLORS: Record<Rarity, string> = {
  common:    'text-gray-400 border-gray-400',
  rare:      'text-blue-400 border-blue-400',
  epic:      'text-purple-400 border-purple-400',
  legendary: 'text-yellow-400 border-yellow-400',
}

export const RARITY_BG: Record<Rarity, string> = {
  common:    'bg-gray-400/10',
  rare:      'bg-blue-400/10',
  epic:      'bg-purple-400/10',
  legendary: 'bg-yellow-400/10',
}

export const RARITY_LABEL: Record<Rarity, string> = {
  common:    'Commun',
  rare:      'Rare',
  epic:      'Épique',
  legendary: 'Légendaire',
}

export const CHEST_EMOJI: Record<ChestTier, string> = {
  common:    '📦',
  rare:      '💠',
  epic:      '💜',
  legendary: '✨',
}
