import { useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useRpgProgress } from '@/hooks/useRpgProgress'
import { supabase } from '@/integrations/supabase/client'
import { Quest, WorkoutSession } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { RewardResult } from '@/types/rpg'

interface UseWorkoutValidationProps {
  quest: Quest | null
  session: WorkoutSession | null
  time: number
  rounds: number
}

export function useWorkoutValidation({ quest, session, time, rounds }: UseWorkoutValidationProps) {
  const { profile } = useProfile()
  const { processWorkoutRewards, isProcessingRewards } = useRpgProgress()
  
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewardResults, setRewardResults] = useState<RewardResult | null>(null)

  const validateWorkout = async () => {
    console.log('🎯 validateWorkout appelée dans useWorkoutValidation')
    console.log('🔍 Params:', { quest: !!quest, profile: !!profile, session: !!session, isProcessingRewards })
    
    if (!quest || !profile || !session || isProcessingRewards) {
      console.log('❌ Conditions non remplies, arrêt de validateWorkout')
      return
    }
    
    try {
      console.log('🔄 Début de la validation de l\'entraînement...')

      // 1. Marquer la session comme terminée
      console.log('📝 Mise à jour de la session workout...')
      const { error: sessionError } = await supabase
        .from('workout_sessions')
        .update({
          is_completed: true,
          ended_at: new Date().toISOString(),
          total_time_seconds: time,
          rounds_completed: rounds,
        })
        .eq('id', session.id)

      if (sessionError) {
        console.error('❌ Erreur session:', sessionError)
        throw sessionError
      }

      // 2. Marquer la quête comme terminée avec UPSERT
      console.log('✅ Mise à jour du statut de la quête...')
      const { error: questStatusError } = await supabase
        .from('user_quests')
        .upsert({
          user_id: profile.id,
          quest_id: quest.id,
          status: 'completed',
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,quest_id'
        })

      if (questStatusError) {
        console.error('❌ ERREUR lors de la sauvegarde:', questStatusError)
        throw questStatusError
      } else {
        console.log('✅ Statut sauvegardé avec succès')
      }

      // 3. Calculer les récompenses
      console.log('🎁 Calcul des récompenses...')
      let rewards = null
      try {
        rewards = await processWorkoutRewards({
          durationMin: Math.ceil(time / 60),
          workoutType: quest.workout_type,
          intensity:
            rounds >= (quest.rounds_target ?? 0)
              ? 'HIGH'
              : rounds >= Math.ceil((quest.rounds_target ?? 0) * 0.7)
              ? 'MEDIUM'
              : 'LOW',
        })

        if (rewards) {
          setRewardResults(rewards)
          setTimeout(() => setShowRewardsModal(true), 500)
        }
      } catch (rewardError) {
        console.warn('⚠️ Erreur lors du calcul des récompenses (non bloquant):', rewardError)
      }

      // 4. Enregistrer l'audit XP
      console.log('📊 Enregistrement de l\'audit XP...')
      try {
        const { error: auditError } = await supabase.from('audit_xp').insert({
          user_id: profile.id,
          quest_id: quest.id,
          delta_force: quest.xp_force,
          delta_endurance: quest.xp_endurance,
          delta_agilite: quest.xp_agilite,
          delta_mental: quest.xp_mental,
          delta_total: quest.xp_force + quest.xp_endurance + quest.xp_agilite + quest.xp_mental,
        })

        if (auditError) {
          console.warn('⚠️ Erreur audit XP (non bloquant):', auditError)
        }
      } catch (auditError) {
        console.warn('⚠️ Erreur audit XP (non bloquant):', auditError)
      }

      // 5. Débloquer la quête suivante
      console.log('🔍 Recherche de la quête suivante...')
      const { data: nextQuest, error: nextQuestError } = await supabase
        .from('quests')
        .select('id, title')
        .eq('campaign_id', quest.campaign_id)
        .eq('order_index', quest.order_index + 1)
        .maybeSingle()

      if (nextQuestError) {
        console.warn('⚠️ Erreur recherche quête suivante:', nextQuestError)
      }

      if (nextQuest) {
        console.log('🔓 Déblocage de la quête suivante:', nextQuest.title)
        
        const { error: nextQuestError } = await supabase
          .from('user_quests')
          .upsert({
            user_id: profile.id,
            quest_id: nextQuest.id,
            status: 'available',  // ← Changer 'todo' en 'available'
          }, {
            onConflict: 'user_id,quest_id'
          })

        if (nextQuestError) {
          console.error('❌ Erreur déblocage quête suivante:', nextQuestError)
        } else {
          console.log('✅ Quête suivante débloquée avec succès')
        }
      }

      // 6. Vérifier les badges
      console.log('🏆 Vérification des badges...')
      try {
        await checkBadgeUnlocks()
        console.log('✅ Vérification des badges terminée')
      } catch (badgeError) {
        console.warn('⚠️ Erreur lors de la vérification des badges (non bloquant):', badgeError)
      }

      console.log('🎉 Validation terminée avec succès !')
      toast({
        title: "✅ Validation réussie",
        description: "Votre entraînement a été enregistré !",
      })

      // Si pas de récompenses à afficher, ouvrir directement la modal des récompenses
      if (!rewards) {
        setTimeout(() => setShowRewardsModal(true), 500)
      }

    } catch (error) {
      console.error('❌ Erreur critique lors de la validation:', error)
      toast({
        title: 'Erreur de validation',
        description: "Impossible de valider l'entraînement. Veuillez réessayer.",
        variant: 'destructive',
      })
    }
  }

  const checkBadgeUnlocks = async () => {
    if (!profile || !quest) {
      console.log('ℹ️ Pas de profil ou quête, skip badges')
      return
    }

    try {
      console.log('🏆 Début de la vérification des badges...')
      
      const { data: completedSessions, error: sessionsError } = await supabase
        .from('user_quests')
        .select('id')
        .eq('user_id', profile.id)
        .eq('status', 'completed')
      
      if (sessionsError) {
        console.warn('⚠️ Erreur lors de la récupération des sessions:', sessionsError)
        return
      }
      
      const completedCount = (completedSessions?.length || 0) + 1
      console.log(`📊 Nombre de quêtes complétées: ${completedCount}`)

      let badgesEarned = 0

      // Badge Novice (3 quêtes complétées)
      if (completedCount >= 3) {
        console.log('🔍 Vérification du badge novice...')
        const success = await unlockBadgeIfNotExists('novice-sans-cardio', 'Badge novice (3 quêtes)')
        if (success) badgesEarned++
      }

      // Badge Superset
      if (quest.title.toLowerCase().includes('superset')) {
        console.log('🔍 Vérification du badge superset...')
        const success = await unlockBadgeIfNotExists('superset-slayer', 'Badge superset slayer')
        if (success) badgesEarned++
      }

      // Badge Boss Final
      if (quest.title.toLowerCase().includes('boss final') || quest.type === 'boss') {
        console.log('🔍 Vérification du badge boss final...')
        const success = await unlockBadgeIfNotExists('boss-final-vaincu', 'Badge boss final')
        if (success) badgesEarned++
      }

      if (badgesEarned === 0) {
        console.log('ℹ️ Aucun nouveau badge débloqué pour cette quête')
      } else {
        console.log(`🎉 ${badgesEarned} nouveau(x) badge(s) débloqué(s) !`)
      }

    } catch (error) {
      console.warn('⚠️ Erreur dans checkBadgeUnlocks (non critique):', error)
    }
  }

  const unlockBadgeIfNotExists = async (badgeSlug: string, badgeName: string): Promise<boolean> => {
    try {
      // 1. Récupérer le badge par son slug
      const { data: badge, error: badgeError } = await supabase
        .from('badges')
        .select('id, name')
        .eq('slug', badgeSlug)
        .maybeSingle()
      
      if (badgeError || !badge) {
        console.warn(`⚠️ Badge ${badgeSlug} non trouvé ou erreur:`, badgeError)
        return false
      }

      // 2. Vérifier si l'utilisateur a déjà ce badge
      const { data: existingBadge, error: checkError } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', profile!.id)
        .eq('badge_id', badge.id)
        .maybeSingle()

      if (checkError) {
        console.warn(`⚠️ Erreur lors de la vérification du badge ${badgeSlug}:`, checkError)
        return false
      }

      if (existingBadge) {
        console.log(`ℹ️ Badge ${badgeName} déjà possédé`)
        return false
      }

      // 3. Débloquer le badge
      const { error: insertError } = await supabase
        .from('user_badges')
        .insert({
          user_id: profile!.id,
          badge_id: badge.id,
          earned_at: new Date().toISOString()
        })
      
      if (insertError) {
        console.warn(`⚠️ Erreur lors du déblocage du badge ${badgeSlug}:`, insertError)
        return false
      }

      console.log(`🎉 Badge débloqué avec succès: ${badgeName}`)
      
      toast({
        title: "🏆 Nouveau badge !",
        description: `Vous avez débloqué: ${badge.name}`,
      })

      return true

    } catch (error) {
      console.warn(`⚠️ Erreur générale pour le badge ${badgeSlug}:`, error)
      return false
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