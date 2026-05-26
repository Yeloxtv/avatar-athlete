import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/types/workout'
import { toast } from '@/hooks/use-toast'

interface UseWorkoutValidationProps {
  quest: Quest | null
  session: WorkoutSession | null
  time: number
  rounds: number
  onNavigate?: (path: string) => void
}

export function useWorkoutValidation({ quest, session, time, rounds, onNavigate }: UseWorkoutValidationProps) {
  const { profile } = useProfile()
  const { user } = useAuth()
  const [isValidating, setIsValidating] = useState(false)

  const validateWorkout = async () => {
    if (!quest || !profile || !user || !session || isValidating) return
    setIsValidating(true)

    try {
      // Marquer la session complète
      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({
          is_completed: true,
          ended_at: new Date().toISOString(),
          total_time_seconds: time,
          rounds_completed: rounds,
        })
        .eq('id', session.id)
      if (sessionError) throw sessionError

      // Marquer la quête complétée
      const { error: questStatusError } = await supabase
        .from('user_quests')
        .upsert({
          user_id: user.id,
          quest_id: quest.id,
          status: 'completed',
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,quest_id' })
      if (questStatusError) throw questStatusError

      // Débloquer la prochaine quête si elle existe
      const { data: nextQuest } = await supabase
        .from('quests')
        .select('id')
        .eq('campaign_id', quest.campaign_id)
        .eq('order_index', quest.order_index + 1)
        .maybeSingle()

      if (nextQuest) {
        await supabase.from('user_quests').upsert(
          { user_id: user.id, quest_id: nextQuest.id, status: 'available' },
          { onConflict: 'user_id,quest_id' }
        )
      }

      // Destination post-validation
      let dest = '/'
      if (quest.campaign_id) {
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('slug')
          .eq('id', quest.campaign_id)
          .maybeSingle()
        if (campaign?.slug) {
          dest = nextQuest
            ? `/campaign/${campaign.slug}?next=${nextQuest.id}`
            : `/campaign/${campaign.slug}`
        }
      }

      onNavigate?.(dest)

    } catch (error) {
      toast({
        title: 'Erreur de validation',
        description: "Impossible de valider l'entraînement. Veuillez réessayer.",
        variant: 'destructive',
      })
    } finally {
      setIsValidating(false)
    }
  }

  return {
    validateWorkout,
    isValidating,
    // Kept for API compat with callers that destructure these
    showRewardsModal: false,
    rewardResults: null,
    handleRewardsModalClose: () => {},
    isProcessingRewards: isValidating,
  }
}
