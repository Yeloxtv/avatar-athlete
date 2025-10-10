import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

interface CompletedCampaign {
  id: string
  slug: string
  title: string
  description: string
  completed_count: number
  last_completed_at: string
}

interface CompletedQuest {
  id: string
  title: string
  description: string
  type: string
  workout_type: string
  campaign_title: string
  campaign_slug: string
  completed_at: string
  latest_session?: {
    id: string
    rounds_completed: number
    total_time_seconds: number
    started_at: string
    ended_at: string
  }
}

export function useHistory() {
  const { user } = useAuth()
  const [completedCampaigns, setCompletedCampaigns] = useState<CompletedCampaign[]>([])
  const [completedQuests, setCompletedQuests] = useState<CompletedQuest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Récupérer les quêtes complétées
      const { data: userQuests, error: questsError } = await supabase
        .from('user_quests')
        .select(`
          quest_id,
          completed_at,
          quests (
            id,
            title,
            description,
            type,
            workout_type,
            campaign_id,
            campaigns (
              title,
              slug
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (questsError) throw questsError

      // Récupérer les sessions pour chaque quête
      const questsWithSessions = await Promise.all(
        (userQuests || []).map(async (uq: any) => {
          const { data: session } = await supabase
            .from('workout_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('quest_id', uq.quest_id)
            .eq('is_completed', true)
            .order('ended_at', { ascending: false })
            .limit(1)
            .single()

          return {
            id: uq.quests.id,
            title: uq.quests.title,
            description: uq.quests.description,
            type: uq.quests.type,
            workout_type: uq.quests.workout_type,
            campaign_title: uq.quests.campaigns.title,
            campaign_slug: uq.quests.campaigns.slug,
            completed_at: uq.completed_at,
            latest_session: session || undefined
          }
        })
      )

      setCompletedQuests(questsWithSessions)

      // Grouper les campagnes complétées
      const campaignMap = new Map<string, CompletedCampaign>()
      
      userQuests?.forEach((uq: any) => {
        const campaignId = uq.quests.campaign_id
        const campaignSlug = uq.quests.campaigns.slug
        const campaignTitle = uq.quests.campaigns.title

        if (!campaignMap.has(campaignId)) {
          campaignMap.set(campaignId, {
            id: campaignId,
            slug: campaignSlug,
            title: campaignTitle,
            description: '',
            completed_count: 1,
            last_completed_at: uq.completed_at
          })
        } else {
          const campaign = campaignMap.get(campaignId)!
          campaign.completed_count++
          if (new Date(uq.completed_at) > new Date(campaign.last_completed_at)) {
            campaign.last_completed_at = uq.completed_at
          }
        }
      })

      setCompletedCampaigns(Array.from(campaignMap.values()))
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [user])

  return {
    completedCampaigns,
    completedQuests,
    loading,
    refetch: fetchHistory
  }
}
