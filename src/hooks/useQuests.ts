import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/integrations/supabase/types'

type Quest = Database['public']['Tables']['quests']['Row']
type UserQuest = Database['public']['Tables']['user_quests']['Row']
type QuestExercise = Database['public']['Tables']['quest_exercises']['Row']

interface QuestWithStatus extends Quest {
  status: UserQuest['status']
  exercises: QuestExercise[]
}

export function useQuests() {
  const { user } = useAuth()
  const [quests, setQuests] = useState<QuestWithStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchQuests()
    }
  }, [user])

  const fetchQuests = async () => {
    if (!user) return

    try {
      // First, ensure user has quest progress entries
      await initializeUserQuests()

      // Fetch quests with user status
      const { data: questsData, error: questsError } = await supabase
        .from('quests')
        .select(`
          *,
          user_quests!inner(status),
          quest_exercises(*)
        `)
        .eq('user_quests.user_id', user.id)
        .order('order_index')

      if (questsError) throw questsError

      setQuests(questsData?.map(q => ({
        ...q,
        status: q.user_quests[0]?.status || 'locked',
        exercises: q.quest_exercises || []
      })) || [])

    } catch (error) {
      console.error('Error fetching quests:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeUserQuests = async () => {
    if (!user) return

    try {
      // Check if user already has quest progress
      const { data: existingQuests } = await supabase
        .from('user_quests')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (existingQuests && existingQuests.length > 0) return

      // Get the campaign
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('id')
        .eq('slug', 'jaime-pas-le-cardio')
        .single()

      if (!campaign) return

      // Initialize user quests
      await supabase.rpc('initialize_user_quests', {
        p_user_id: user.id,
        p_campaign_id: campaign.id
      })

    } catch (error) {
      console.error('Error initializing user quests:', error)
    }
  }

  const completeQuest = async (questId: string) => {
    if (!user) return

    try {
      const { data } = await supabase.rpc('complete_quest', {
        p_user_id: user.id,
        p_quest_id: questId
      })

      if (data && typeof data === 'object' && 'success' in data) {
        // Refresh quests
        await fetchQuests()
        return data as { success: boolean; xp_gained: number; next_quest_unlocked: boolean }
      }
    } catch (error) {
      console.error('Error completing quest:', error)
    }
  }

  return {
    quests,
    loading,
    completeQuest,
    refetch: fetchQuests
  }
}