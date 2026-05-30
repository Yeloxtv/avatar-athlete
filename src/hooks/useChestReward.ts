import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { UserChest, RewardDefinition, Rarity, SessionData } from '@/types/loot'
import { calculateChestTier, rollChestReward, CHEST_SLUG } from '@/services/rewardEngine'

export function useChestReward() {
  const [pendingChest, setPendingChest] = useState<UserChest | null>(null)

  // userId passé en paramètre pour éviter la closure stale sur useAuth
  const earnChest = async (userId: string, sessionId: string, sessionData: SessionData): Promise<UserChest | null> => {
    if (!userId) return null

    const { data: existing } = await supabase
      .from('user_chests')
      .select('*, chests(*)')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .maybeSingle()

    if (existing) {
      const result = { ...(existing as any), chest: (existing as any).chests } as UserChest
      if (result.status !== 'opened') setPendingChest(result)
      return result
    }

    const tier = calculateChestTier(sessionData)
    const slug = CHEST_SLUG[tier]

    const { data: chestDef } = await supabase
      .from('chests')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!chestDef) return null

    const { data: newChest, error } = await supabase
      .from('user_chests')
      .insert({
        user_id: userId,
        chest_id: chestDef.id,
        session_id: sessionId,
        status: 'unlocked',
        source: 'session_complete',
        unlocked_at: new Date().toISOString(),
        earned_at: new Date().toISOString(),
      })
      .select('*, chests(*)')
      .single()

    if (error) {
      console.error('[earnChest] insert error:', JSON.stringify(error))
      return null
    }
    if (!newChest) return null

    const result = { ...(newChest as any), chest: (newChest as any).chests } as UserChest
    setPendingChest(result)
    return result
  }

  const openChest = async (userId: string, userChestId: string): Promise<RewardDefinition | null> => {
    if (!userId) return null

    const { data: userChest } = await supabase
      .from('user_chests')
      .select('*, chests(*)')
      .eq('id', userChestId)
      .eq('user_id', userId)
      .single()

    if (!userChest || (userChest as any).status === 'opened') return null

    const chestDef = (userChest as any).chests
    if (!chestDef) return null

    const rarity: Rarity = rollChestReward({
      id: chestDef.id, slug: chestDef.slug, name: chestDef.name,
      description: chestDef.description, rarity: chestDef.rarity ?? 'common',
      prob_common: chestDef.prob_common, prob_rare: chestDef.prob_rare,
      prob_epic: chestDef.prob_epic, prob_legendary: chestDef.prob_legendary,
    })

    const { data: alreadyOwned } = await supabase
      .from('user_rewards').select('reward_id').eq('user_id', userId)
    const ownedIds = (alreadyOwned || []).map((r: any) => r.reward_id)

    const { data: candidates } = await supabase
      .from('reward_definitions').select('*').eq('rarity', rarity)

    const pool = (candidates || []).filter((r: any) => !ownedIds.includes(r.id))
    const finalPool = pool.length > 0 ? pool : (candidates || [])
    if (!finalPool.length) return null

    const reward = finalPool[Math.floor(Math.random() * finalPool.length)] as RewardDefinition

    await Promise.all([
      supabase.from('user_chests')
        .update({ status: 'opened', opened_at: new Date().toISOString() })
        .eq('id', userChestId),
      supabase.from('user_rewards').insert({
        user_id: userId,
        reward_id: reward.id,
        source_chest_id: userChestId,
        source_session_id: (userChest as any).session_id ?? null,
        is_new: true,
      }),
    ])

    setPendingChest(null)
    return reward
  }

  const loadPendingChest = async (userId: string) => {
    if (!userId) return
    const { data } = await supabase
      .from('user_chests')
      .select('*, chests(*)')
      .eq('user_id', userId)
      .eq('status', 'unlocked')
      .order('earned_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    setPendingChest(data ? { ...(data as any), chest: (data as any).chests } as UserChest : null)
  }

  return { pendingChest, earnChest, openChest, loadPendingChest }
}
