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

interface UseQuestsOptions {
  campaignSlug?: string
  campaignId?: string
  enabled?: boolean
}

export function useQuests({ campaignId, campaignSlug, enabled = true }: UseQuestsOptions = {}) {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Fonction pour récupérer le campaignId depuis le slug
  const getCampaignIdFromSlug = async (slug: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data.id
  }

  const fetchQuests = async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    try {
      let finalCampaignId = campaignId

      // Si on a un slug mais pas d'ID, récupérer l'ID
      if (!finalCampaignId && campaignSlug) {
        finalCampaignId = await getCampaignIdFromSlug(campaignSlug)
      }

      if (!finalCampaignId) {
        console.log('No campaign ID available')
        setQuests([])
        setLoading(false)
        return
      }

      // Initialiser les user_quests si l'utilisateur est connecté
      if (user) {
        await initializeUserQuests(finalCampaignId)
      }

      // Requête simple sans jointure compliquée
      const { data: questsData, error: questsError } = await supabase
        .from('quests')
        .select(`
          *,
          quest_exercises (
            id,
            name,
            target_reps,
            order_index
          )
        `)
        .eq('campaign_id', finalCampaignId)
        .order('order_index')

      if (questsError) throw questsError

      // Si utilisateur connecté, récupérer ses user_quests séparément
      let userQuestsData = []
      if (user && questsData && questsData.length > 0) {
        const questIds = questsData.map(q => q.id)
        const { data: userQuests, error: userQuestsError } = await supabase
          .from('user_quests')
          .select('quest_id, status')
          .eq('user_id', user.id)
          .in('quest_id', questIds)
        
        if (!userQuestsError) {
          userQuestsData = userQuests || []
        }
      }

      console.log('Raw quests data:', questsData)
      console.log('User quests data:', userQuestsData)
      
      // Combiner les données
      const questsWithExercisesAndStatus = questsData?.map((quest, index) => {
        let status = 'locked' // Par défaut
        
        if (user) {
          const userQuest = userQuestsData.find(uq => uq.quest_id === quest.id)
          if (userQuest) {
            status = userQuest.status
          } else {
            // Si pas de user_quest, la première est unlocked
            status = index === 0 ? 'unlocked' : 'locked'
          }
        } else {
          // Si pas d'utilisateur connecté, tout est visible
          status = 'unlocked'
        }
        
        return {
          ...quest,
          exercises: quest.quest_exercises || [],
          status: status
        }
      }) || []
      
      console.log('Final quests with status:', questsWithExercisesAndStatus)
      setQuests(questsWithExercisesAndStatus)
    } catch (error) {
      console.error('Error loading quests:', error)
      setQuests([])
    } finally {
      setLoading(false)
    }
  }

  const initializeUserQuests = async (campaignId: string) => {
    if (!user) return

    try {
      const { data: existingQuests } = await supabase
        .from('user_quests')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (existingQuests && existingQuests.length > 0) return

      await supabase.rpc('initialize_user_quests', {
        p_user_id: user.id,
        p_campaign_id: campaignId
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
        await fetchQuests()
        return data as { success: boolean; xp_gained: number; next_quest_unlocked: boolean }
      }
    } catch (error) {
      console.error('Error completing quest:', error)
    }
  }

  const createQuest = async (questData: Omit<Quest, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('quests')
      .insert([questData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const updateQuest = async (id: string, updates: Partial<Quest>) => {
    const { data, error } = await supabase
      .from('quests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const deleteQuest = async (id: string) => {
    await supabase
      .from('quest_exercises')
      .delete()
      .eq('quest_id', id)
    
    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  const saveQuestExercises = async (questId: string, exercises: Omit<QuestExercise, 'id' | 'quest_id'>[]) => {
    await supabase
      .from('quest_exercises')
      .delete()
      .eq('quest_id', questId)
    
    if (exercises.length > 0) {
      const { error } = await supabase
        .from('quest_exercises')
        .insert(
          exercises.map(ex => ({
            quest_id: questId,
            name: ex.name,
            target_reps: ex.target_reps,
            order_index: ex.order_index
          }))
        )
      
      if (error) throw error
    }
  }

  useEffect(() => {
    fetchQuests()
  }, [campaignId, campaignSlug, enabled, user?.id])

  return {
    quests,
    loading,
    completeQuest,
    refetch: fetchQuests,
    createQuest,
    updateQuest,
    deleteQuest,
    saveQuestExercises,
    initializeUserQuests
  }
}