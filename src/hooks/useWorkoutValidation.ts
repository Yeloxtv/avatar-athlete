import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { RewardResult } from '@/types/rpg'
import { useBadges } from '@/hooks/useBadges'

interface UseWorkoutValidationProps {
  quest: Quest | null
  session: WorkoutSession | null
  time: number
  rounds: number
}

export function useWorkoutValidation({ quest, session, time, rounds }: UseWorkoutValidationProps) {
  const { profile } = useProfile()
  const { processWorkoutRewards, isProcessingRewards } = useRpgProgress()
  const { unlock, unlockedIds } = useBadges()
  
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardResults, setRewardResults] = useState<RewardResult | null>(null)

  const validateWorkout = async () => {
    if (!quest || !profile || !session || isProcessingRewards) return

    try {
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

      const { error: questStatusError } = await supabase
        .from('user_quests')
        .upsert({
          user_id: profile.id,
          quest_id: quest.id,
          status: 'completed',
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,quest_id' })

      if (questStatusError) throw questStatusError

      let rewards = null
      try {
        rewards = await processWorkoutRewards({
          durationMin: Math.ceil(time / 60),
          workoutType: quest.workout_type,
          intensity:
            rounds >= (quest.rounds_target ?? 0) ? 'HIGH'
            : rounds >= Math.ceil((quest.rounds_target ?? 0) * 0.7) ? 'MEDIUM'
            : 'LOW',
        })
        if (rewards) {
          setRewardResults(rewards)
          setTimeout(() => setShowRewardsModal(true), 500)
        }
      } catch {}

      try {
        await supabase.from('audit_xp').insert({
          user_id: profile.id,
          quest_id: quest.id,
          delta_force: quest.xp_force,
          delta_endurance: quest.xp_endurance,
          delta_agilite: quest.xp_agilite,
          delta_mental: quest.xp_mental,
          delta_total: quest.xp_force + quest.xp_endurance + quest.xp_agilite + quest.xp_mental,
        })
      } catch {}

      const { data: nextQuest } = await supabase
        .from('quests')
        .select('id')
        .eq('campaign_id', quest.campaign_id)
        .eq('order_index', quest.order_index + 1)
        .maybeSingle()

      if (nextQuest) {
        await supabase.from('user_quests').upsert(
          { user_id: profile.id, quest_id: nextQuest.id, status: 'available' },
          { onConflict: 'user_id,quest_id' }
        )
      }

      await checkBadgeUnlocks()

      if (!rewards) setTimeout(() => setShowRewardsModal(true), 500)

    } catch (error) {
      toast({
        title: 'Erreur de validation',
        description: "Impossible de valider l'entraînement. Veuillez réessayer.",
        variant: 'destructive',
      })
    }
  }

  const checkBadgeUnlocks = async () => {
    if (!profile || !quest) return
    try {
      const newBadges: string[] = []

      // Récupérer stats nécessaires en parallèle
      const [
        { data: sessions },
        { data: prLogs },
        { data: allLogs },
        { data: completedCampaigns },
      ] = await Promise.all([
        supabase
          .from('workout_sessions')
          .select('id, total_time_seconds, started_at, quest_id')
          .eq('user_id', profile.id)
          .eq('is_completed', true),
        supabase
          .from('exercise_logs')
          .select('exercise_id, weight_used, reps_completed')
          .eq('session_id', session!.id),
        supabase
          .from('exercise_logs')
          .select('reps_completed, weight_used')
          .in('session_id', [session!.id]),
        supabase
          .from('user_quests')
          .select('quest_id, quests!inner(campaign_id)')
          .eq('user_id', profile.id)
          .eq('status', 'completed'),
      ])

      const sessionCount = (sessions?.length || 0)
      const totalVolume = (allLogs || []).reduce((s, l) => s + (l.reps_completed * (Number(l.weight_used) || 0)), 0)

      // Régularité
      if (sessionCount >= 1)   newBadges.push('premier-pas')
      if (sessionCount >= 10)  newBadges.push('habitue')
      if (sessionCount >= 30)  newBadges.push('guerrier-du-mois')
      if (sessionCount >= 100) newBadges.push('centurion')

      // Streak 7 jours consécutifs
      if (sessions && sessions.length >= 7) {
        const sortedDays = [...new Set(
          sessions.map(s => new Date(s.started_at).toDateString())
        )].sort()
        let streak = 1, maxStreak = 1
        for (let i = 1; i < sortedDays.length; i++) {
          const diff = (new Date(sortedDays[i]).getTime() - new Date(sortedDays[i - 1]).getTime()) / 86400000
          streak = diff === 1 ? streak + 1 : 1
          maxStreak = Math.max(maxStreak, streak)
        }
        if (maxStreak >= 7) newBadges.push('semaine-de-feu')
      }

      // Performance — PRs (comparer avec sessions précédentes)
      if (prLogs && prLogs.length > 0) {
        const exerciseIds = [...new Set(prLogs.map(l => l.exercise_id))]
        const { data: prevLogs } = await supabase
          .from('exercise_logs')
          .select('exercise_id, weight_used, reps_completed')
          .in('exercise_id', exerciseIds)
          .neq('session_id', session!.id)

        let prCount = 0
        for (const log of prLogs) {
          const prev = (prevLogs || []).filter(p => p.exercise_id === log.exercise_id)
          const prevBest = prev.reduce((max, p) => Math.max(max, Number(p.weight_used) || 0), 0)
          if ((Number(log.weight_used) || 0) > prevBest) prCount++
        }

        // Compter les PRs historiques totaux
        const { data: allUserSessions } = await supabase
          .from('workout_sessions')
          .select('id')
          .eq('user_id', profile.id)
          .eq('is_completed', true)
        const totalSessionIds = (allUserSessions || []).map(s => s.id)
        if (totalSessionIds.length > 0) {
          // Estimation PR totaux via badge déjà débloqué
          if (prCount >= 1)  newBadges.push('premier-record')
          if (unlockedIds.has('premier-record') && prCount >= 1) newBadges.push('machine')
        }
      }

      // Volume total 10 000 kg
      const { data: volumeData } = await supabase
        .from('exercise_logs')
        .select('reps_completed, weight_used')
        .in('session_id', (sessions || []).map(s => s.id))
      const lifetimeVolume = (volumeData || []).reduce((s, l) => s + l.reps_completed * (Number(l.weight_used) || 0), 0)
      if (lifetimeVolume >= 10000) newBadges.push('titan')

      // Sprint — séance < 30 min
      if (time > 0 && time < 1800) newBadges.push('sprint')

      // Sommet — programme complet
      if (completedCampaigns && completedCampaigns.length > 0) {
        const campaignGroups = new Map<string, number>()
        for (const uq of completedCampaigns) {
          const cid = (uq.quests as any)?.campaign_id
          if (cid) campaignGroups.set(cid, (campaignGroups.get(cid) || 0) + 1)
        }
        const { data: allQuests } = await supabase
          .from('quests')
          .select('campaign_id')
          .in('campaign_id', Array.from(campaignGroups.keys()))
        const questsPerCampaign = new Map<string, number>()
        for (const q of allQuests || []) {
          questsPerCampaign.set(q.campaign_id, (questsPerCampaign.get(q.campaign_id) || 0) + 1)
        }
        for (const [cid, done] of campaignGroups) {
          if (done >= (questsPerCampaign.get(cid) || 999)) {
            newBadges.push('sommet')
            break
          }
        }
      }

      // Unlock tous les badges gagnés et notifier
      for (const badgeId of [...new Set(newBadges)]) {
        const gained = await unlock(badgeId)
        if (gained) {
          const { BADGES } = await import('@/hooks/useBadges')
          const badge = BADGES.find(b => b.id === badgeId)
          if (badge) {
            toast({ title: '🏆 Nouveau badge !', description: badge.name })
          }
        }
      }
    } catch (err) {
      console.warn('Badge check error (non bloquant):', err)
    }
  }

  const handleRewardsModalClose = async () => {
    setShowRewardsModal(false)
    setRewardResults(null)

    try {
      if (quest?.campaign_id) {
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('slug')
          .eq('id', quest.campaign_id)
          .maybeSingle()

        if (campaign?.slug) {
          window.location.href = '/'
          return
        }
      }
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur lors de la redirection:', error)
      window.location.href = '/'
    }
  }

  return {
    validateWorkout,
    showRewardsModal,
    rewardResults,
    handleRewardsModalClose,
    isProcessingRewards
  }
}