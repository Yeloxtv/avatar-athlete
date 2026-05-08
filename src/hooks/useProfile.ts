import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { XpService } from '@/services/xpService'

type Profile = Database['public']['Tables']['profiles']['Row']
import { useAuth } from './useAuth'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)

      if (error) throw error

      setProfile({ ...profile, ...updates })
      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error }
    }
  }

  const calculateLevel = (xp: number) => {
    return XpService.calculateLevelFromXp(xp)
  }

  const getXpForNextLevel = (xp: number) => {
    const level = calculateLevel(xp)
    return XpService.getXpForNextLevel(level)
  }

  const getXpProgress = (xp: number) => {
    return XpService.getLevelProgress(xp).xpInCurrentLevel
  }

  const getLevelProgress = (xp: number) => {
    return XpService.getLevelProgress(xp)
  }

  return {
    profile,
    loading,
    updateProfile,
    calculateLevel,
    getXpForNextLevel,
    getXpProgress,
    getLevelProgress,
    refetch: fetchProfile,
  }
}
