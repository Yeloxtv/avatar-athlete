import { useState, useCallback } from 'react'
import { useProfile } from './useProfile'
import { XpService } from '@/services/xpService'
import { StreakService } from '@/services/streakService'
import { DailyQuestService } from '@/services/dailyQuestService'
import { supabase } from '@/integrations/supabase/client'
import { WorkoutSessionInput, RewardResult } from '@/types/rpg'
import { toast } from '@/hooks/use-toast'

export function useRpgProgress() {
  const { profile, updateProfile } = useProfile()
  const [isProcessingRewards, setIsProcessingRewards] = useState(false)

  const processWorkoutRewards = useCallback(async (
    sessionData: {
      durationMin: number
      workoutType: string
      intensity?: 'LOW' | 'MEDIUM' | 'HIGH'
    }
  ): Promise<RewardResult | null> => {
    if (!profile || isProcessingRewards) return null

    setIsProcessingRewards(true)

    try {
      // Convertir le profil Supabase en PlayerProfile RPG
      const playerProfile = XpService.profileToPlayerProfile(profile)
      const { data: completedSessions } = await supabase
        .from('workout_sessions')
        .select('id, started_at, ended_at')
        .eq('user_id', profile.id)
        .eq('is_completed', true)

      playerProfile.streakDays = StreakService.compute(
        (completedSessions || []).map(s => s.ended_at || s.started_at)
      ).currentStreak

      const { start, end } = DailyQuestService.getTodayRange()
      const todaySessions = (completedSessions || []).filter(session => {
        const date = new Date(session.ended_at || session.started_at)
        return date >= start && date <= end
      })
      const todaySessionIds = todaySessions.map((session: any) => session.id).filter(Boolean)
      let completedSets = 0

      if (todaySessionIds.length > 0) {
        const { count } = await supabase
          .from('exercise_logs')
          .select('id', { count: 'exact', head: true })
          .in('session_id', todaySessionIds)
        completedSets = count || 0
      }

      const { data: xpRows } = await supabase
        .from('audit_xp')
        .select('delta_total')
        .eq('user_id', profile.id)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())

      const dailyQuest = DailyQuestService.compute({
        completedWorkouts: todaySessions.length,
        completedSets,
        earnedXp: (xpRows || []).reduce((sum, row) => sum + (row.delta_total || 0), 0),
      })
      const dailyQuestBonusXp = dailyQuest.isComplete && !DailyQuestService.hasClaimed(profile.id, dailyQuest.id)
        ? dailyQuest.rewardXp
        : 0

      // Créer l'input de session
      const sessionInput: WorkoutSessionInput = {
        durationMin: sessionData.durationMin,
        format: XpService.getWorkoutFormat(sessionData.workoutType),
        category: XpService.getWorkoutCategory(sessionData.workoutType),
        dateISO: new Date().toISOString(),
        intensity: sessionData.intensity || 'MEDIUM',
        dailyQuestBonusXp,
        dailyQuestTitle: dailyQuest.title
      }

      // Calculer les récompenses
      const rewards = XpService.computeSessionRewards(playerProfile, sessionInput)

      // Mettre à jour le profil en base
      const currentXp = profile.xp_total || 0
      const nextTotalXp = currentXp + rewards.gainedXpGlobal
      const updatedStats = {
        xp_total: nextTotalXp,
        stat_force: (profile.stat_force || 0) + (rewards.gainedStats.force || 0),
        stat_endurance: (profile.stat_endurance || 0) + (rewards.gainedStats.endurance || 0),
        stat_agilite: (profile.stat_agilite || 0) + (rewards.gainedStats.agilite || 0),
        stat_mental: (profile.stat_mental || 0) + (rewards.gainedStats.mental || 0),
        level: XpService.calculateLevelFromXp(nextTotalXp)
      }

      await updateProfile(updatedStats)
      if (dailyQuestBonusXp > 0) {
        DailyQuestService.markClaimed(profile.id, dailyQuest.id)
      }

      // Notification pour boss débloqué uniquement
      if (rewards.bossUnlocked) {
        toast({
          title: "⚔️ Boss débloqué !",
          description: `${rewards.bossUnlocked!.bossName} t'attend !`,
          duration: 5000,
        })
      }

      return rewards

    } catch (error) {
      console.error('Error processing workout rewards:', error)
      toast({
        title: "Erreur",
        description: "Impossible de traiter les récompenses",
        variant: "destructive",
      })
      return null
    } finally {
      setIsProcessingRewards(false)
    }
  }, [profile, updateProfile, isProcessingRewards])

  const getPlayerLevel = useCallback(() => {
    if (!profile) return 1
    return XpService.calculateLevelFromXp(profile.xp_total || 0)
  }, [profile])

  const getLevelTitle = useCallback(() => {
    const level = getPlayerLevel()
    return XpService.getLevelTitle(level)
  }, [getPlayerLevel])

  const getXpProgress = useCallback(() => {
    if (!profile) return { current: 0, next: 100, percentage: 0 }
    
    const progress = XpService.getLevelProgress(profile.xp_total || 0)

    return {
      current: progress.xpInCurrentLevel,
      next: progress.xpNeededForNext,
      percentage: progress.percentage
    }
  }, [profile, getPlayerLevel])

  return {
    processWorkoutRewards,
    isProcessingRewards,
    getPlayerLevel,
    getLevelTitle,
    getXpProgress,
    profile
  }
}
