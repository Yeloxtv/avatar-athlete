import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { UserReward, EquippedRewards, RewardDefinition } from '@/types/loot'

export function useCollection() {
  const { user } = useAuth()
  const [rewards, setRewards] = useState<UserReward[]>([])
  const [equipped, setEquipped] = useState<EquippedRewards>({ title: null, frame: null, background: null, badge: null })
  const [loading, setLoading] = useState(true)

  const loadCollection = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [rewardsResult, equippedResult] = await Promise.all([
        supabase
          .from('user_rewards')
          .select('*, reward_definitions(*)')
          .eq('user_id', user.id)
          .order('unlocked_at', { ascending: false }),
        supabase
          .from('user_equipped_rewards')
          .select(`
            equipped_title_id, equipped_frame_id, equipped_background_id, equipped_badge_id,
            title:reward_definitions!equipped_title_id(*),
            frame:reward_definitions!equipped_frame_id(*),
            background:reward_definitions!equipped_background_id(*),
            badge:reward_definitions!equipped_badge_id(*)
          `)
          .eq('user_id', user.id)
          .maybeSingle(),
      ])

      const mappedRewards: UserReward[] = (rewardsResult.data || []).map((r: any) => ({
        ...r,
        reward: r.reward_definitions as RewardDefinition,
      }))
      setRewards(mappedRewards)

      if (equippedResult.data) {
        const e = equippedResult.data as any
        setEquipped({
          title:      Array.isArray(e.title)      ? e.title[0]      ?? null : e.title      ?? null,
          frame:      Array.isArray(e.frame)      ? e.frame[0]      ?? null : e.frame      ?? null,
          background: Array.isArray(e.background) ? e.background[0] ?? null : e.background ?? null,
          badge:      Array.isArray(e.badge)      ? e.badge[0]      ?? null : e.badge      ?? null,
        })
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  const equipReward = useCallback(async (reward: RewardDefinition) => {
    if (!user) return
    const field = `equipped_${reward.type}_id`
    await supabase
      .from('user_equipped_rewards')
      .upsert({ user_id: user.id, [field]: reward.id, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setEquipped(prev => ({ ...prev, [reward.type]: reward }))
  }, [user])

  const unequipReward = useCallback(async (type: keyof EquippedRewards) => {
    if (!user) return
    const field = `equipped_${type}_id`
    await supabase
      .from('user_equipped_rewards')
      .upsert({ user_id: user.id, [field]: null, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setEquipped(prev => ({ ...prev, [type]: null }))
  }, [user])

  const markSeen = useCallback(async (rewardId: string) => {
    if (!user) return
    await supabase
      .from('user_rewards')
      .update({ is_new: false })
      .eq('id', rewardId)
      .eq('user_id', user.id)
    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, is_new: false } : r))
  }, [user])

  useEffect(() => { loadCollection() }, [loadCollection])

  return { rewards, equipped, loading, equipReward, unequipReward, markSeen, reload: loadCollection }
}
