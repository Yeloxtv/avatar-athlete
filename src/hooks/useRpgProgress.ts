import { useState, useCallback } from 'react'
import { useProfile } from './useProfile'
import { XpService } from '@/services/xpService'
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

      // Créer l'input de session
      const sessionInput: WorkoutSessionInput = {
        durationMin: sessionData.durationMin,
        format: XpService.getWorkoutFormat(sessionData.workoutType),
        category: XpService.getWorkoutCategory(sessionData.workoutType),
        dateISO: new Date().toISOString(),
        intensity: sessionData.intensity || 'MEDIUM'
      }

      // Calculer les récompenses
      const rewards = XpService.computeSessionRewards(playerProfile, sessionInput)

      // Mettre à jour le profil en base
      const updatedStats = {
        xp_total: profile.xp_total + rewards.gainedXpGlobal,
        stat_force: profile.stat_force + (rewards.gainedStats.force || 0),
        stat_endurance: profile.stat_endurance + (rewards.gainedStats.endurance || 0),
        stat_agilite: profile.stat_agilite + (rewards.gainedStats.agilite || 0),
        stat_mental: profile.stat_mental + (rewards.gainedStats.mental || 0),
        level: XpService.calculateLevelFromXp(profile.xp_total + rewards.gainedXpGlobal)
      }

      await updateProfile(updatedStats)

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
    
    const currentLevel = getPlayerLevel()
    const currentLevelXp = XpService.getCurrentLevelXp(currentLevel)
    const nextLevelXp = XpService.getXpForNextLevel(currentLevel)
    const currentXp = profile.xp_total || 0
    
    const xpInCurrentLevel = currentXp - currentLevelXp
    const xpNeededForNext = nextLevelXp - currentLevelXp
    
    return {
      current: xpInCurrentLevel,
      next: xpNeededForNext,
      percentage: xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100
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