import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/integrations/supabase/types'

type Badge = Database['public']['Tables']['badges']['Row']

interface BadgeWithStatus extends Badge {
  unlocked: boolean
  unlocked_at?: string
}

export function useBadges() {
  const { user } = useAuth()
  const [badges, setBadges] = useState<BadgeWithStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBadges()
    }
  }, [user])

  const fetchBadges = async () => {
    if (!user) return

    try {
      const { data: badgesData, error } = await supabase
        .from('badges')
        .select(`
          *,
          user_badges!left(unlocked_at, user_id)
        `)

      if (error) throw error

      const badgesWithStatus: BadgeWithStatus[] = badgesData?.map(badge => {
        const userBadge = badge.user_badges?.find((ub: any) => ub.user_id === user.id)
        return {
          ...badge,
          unlocked: !!userBadge,
          unlocked_at: userBadge?.unlocked_at
        }
      }) || []

      setBadges(badgesWithStatus)

    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    badges,
    loading,
    refetch: fetchBadges
  }
}