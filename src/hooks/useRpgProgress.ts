import { useState, useCallback } from 'react'
import { useProfile } from './useProfile'
import { XpService } from '@/services/xpService'
import { WorkoutSessionInput, RewardResult } from '@/types/rpg'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

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

      // Gérer les nouveaux badges
      if (rewards.newBadges.length > 0) {
        await handleNewBadges(rewards.newBadges)
      }

      // Afficher les messages de récompense
      rewards.messages.forEach((message, index) => {
        setTimeout(() => {
          toast({
            title: index === 0 ? "🔥 Séance terminée !" : "🎉 Progression !",
            description: message,
            duration: 3000 + (index * 1000), // Espacer les toasts
          })
        }, index * 1500)
      })

      // Gérer les boss débloqués
      if (rewards.bossUnlocked) {
        setTimeout(() => {
          toast({
            title: "⚔️ Boss débloqué !",
            description: `${rewards.bossUnlocked!.bossName} t'attend !`,
            duration: 5000,
          })
        }, rewards.messages.length * 1500)
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

  const handleNewBadges = async (badgeIds: string[]) => {
    if (!profile) return

    for (const badgeId of badgeIds) {
      try {
        // Récupérer le badge depuis la base
        const { data: badge } = await supabase
          .from('badges')
          .select('id')
          .eq('slug', badgeId)
          .single()

        if (badge) {
          // Ajouter le badge à l'utilisateur
          await supabase
            .from('user_badges')
            .upsert({
              user_id: profile.user_id,
              badge_id: badge.id
            })
        }
      } catch (error) {
        console.error('Error adding badge:', badgeId, error)
      }
    }
  }

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