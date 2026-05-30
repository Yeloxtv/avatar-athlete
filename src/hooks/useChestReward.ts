import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { UserChest, RewardDefinition, Rarity, SessionData } from '@/types/loot'
import { calculateChestTier, rollChestReward, CHEST_SLUG } from '@/services/rewardEngine'

export function useChestReward() {
  const { user } = useAuth()
  const [pendingChest, setPendingChest] = useState<UserChest | null>(null)
  const [isEarning, setIsEarning] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  // Attribue un coffre après une séance (idempotent — un seul coffre par session)
  const earnChest = useCallback(async (sessionId: string, sessionData: SessionData): Promise<UserChest | null> => {
    if (!user || isEarning) return null
    setIsEarning(true)

    try {
      // Guard — coffre déjà attribué pour cette session
      const { data: existing } = await supabase
        .from('user_chests')
        .select('*, chests(*)')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .maybeSingle()

      if (existing) {
        const chest = existing as any
        setPendingChest({ ...chest, chest: chest.chests, status: chest.status ?? 'pending' })
        return chest
      }

      // Calculer le tier
      const tier = calculateChestTier(sessionData)
      const slug = CHEST_SLUG[tier]

      // Récupérer la définition du coffre
      const { data: chestDef } = await supabase
        .from('chests')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!chestDef) return null

      // Créer le user_chest
      const { data: newChest, error } = await supabase
        .from('user_chests')
        .insert({
          user_id: user.id,
          chest_id: chestDef.id,
          session_id: sessionId,
          status: 'pending',
          earned_at: new Date().toISOString(),
        })
        .select('*, chests(*)')
        .single()

      if (error || !newChest) return null

      const result = { ...(newChest as any), chest: (newChest as any).chests } as UserChest
      setPendingChest(result)
      return result
    } finally {
      setIsEarning(false)
    }
  }, [user, isEarning])

  // Ouvre un coffre et retourne la reward débloquée
  const openChest = useCallback(async (userChestId: string): Promise<RewardDefinition | null> => {
    if (!user || isOpening) return null
    setIsOpening(true)

    try {
      // Récupérer le coffre avec sa définition
      const { data: userChest } = await supabase
        .from('user_chests')
        .select('*, chests(*)')
        .eq('id', userChestId)
        .eq('user_id', user.id)
        .single()

      if (!userChest || (userChest as any).status === 'opened') return null

      const chestDef = (userChest as any).chests
      if (!chestDef) return null

      // Roll la rarity
      const rarity: Rarity = rollChestReward({
        id: chestDef.id,
        slug: chestDef.slug,
        name: chestDef.name,
        description: chestDef.description,
        rarity: chestDef.rarity ?? 'common',
        prob_common: chestDef.prob_common,
        prob_rare: chestDef.prob_rare,
        prob_epic: chestDef.prob_epic,
        prob_legendary: chestDef.prob_legendary,
      })

      // Chercher une reward de cette rarity que l'user n'a pas encore
      const { data: alreadyOwned } = await supabase
        .from('user_rewards')
        .select('reward_id')
        .eq('user_id', user.id)

      const ownedIds = (alreadyOwned || []).map((r: any) => r.reward_id)

      const query = supabase
        .from('reward_definitions')
        .select('*')
        .eq('rarity', rarity)

      const { data: candidates } = await query

      // Filtrer les non-possédées, sinon fallback sur toutes
      const unowned = (candidates || []).filter((r: any) => !ownedIds.includes(r.id))
      const pool = unowned.length > 0 ? unowned : (candidates || [])

      if (!pool.length) return null

      const reward = pool[Math.floor(Math.random() * pool.length)] as RewardDefinition

      // Marquer le coffre ouvert + créer user_reward en parallèle
      await Promise.all([
        supabase
          .from('user_chests')
          .update({ status: 'opened', opened_at: new Date().toISOString() })
          .eq('id', userChestId),
        supabase
          .from('user_rewards')
          .insert({
            user_id: user.id,
            reward_id: reward.id,
            source_chest_id: userChestId,
            source_session_id: (userChest as any).session_id ?? null,
            is_new: true,
          }),
      ])

      setPendingChest(null)
      return reward
    } finally {
      setIsOpening(false)
    }
  }, [user, isOpening])

  // Charger le coffre pending de l'user (appelé au montage de Home/SessionSummary)
  const loadPendingChest = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('user_chests')
      .select('*, chests(*)')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('earned_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      setPendingChest({ ...(data as any), chest: (data as any).chests } as UserChest)
    } else {
      setPendingChest(null)
    }
  }, [user])

  return {
    pendingChest,
    isEarning,
    isOpening,
    earnChest,
    openChest,
    loadPendingChest,
  }
}
