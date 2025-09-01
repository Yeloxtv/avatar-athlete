import { useState, useEffect } from 'react'
import { initialUserProfile, cardioAvoidancePath, availableBadges, UserProfile, Quest, Badge } from '@/data/gameData'

export function useGameLogic() {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile)
  const [quests, setQuests] = useState<Quest[]>(cardioAvoidancePath)
  const [badges, setBadges] = useState<Badge[]>(availableBadges)

  // Vérifier les conditions de déblocage des quêtes
  const updateQuestAvailability = () => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        if (!quest.unlockCondition) return quest
        
        const prerequisite = prevQuests.find(q => q.id === quest.unlockCondition)
        return {
          ...quest,
          locked: prerequisite ? !prerequisite.completed : false
        }
      })
    )
  }

  // Vérifier les conditions des badges
  const checkBadgeUnlocks = () => {
    setBadges(prevBadges =>
      prevBadges.map(badge => {
        if (badge.unlocked) return badge
        
        let shouldUnlock = false
        
        switch (badge.id) {
          case 'b1':
            shouldUnlock = quests.some(q => q.completed)
            break
          case 'b2':
            shouldUnlock = quests.filter(q => q.completed).length >= 3
            break
          case 'b3':
            shouldUnlock = userProfile.stats.force >= 20
            break
          case 'b4':
            shouldUnlock = quests.some(q => q.type === 'boss' && q.completed)
            break
          case 'b5':
            shouldUnlock = quests.every(q => q.completed)
            break
          case 'b6':
            shouldUnlock = userProfile.stats.mental >= 25
            break
        }
        
        return shouldUnlock ? { ...badge, unlocked: true, unlockedAt: new Date() } : badge
      })
    )
  }

  // Compléter une quête
  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest || quest.completed) return

    // Marquer la quête comme terminée
    setQuests(prev => 
      prev.map(q => q.id === questId ? { ...q, completed: true } : q)
    )

    // Calculer les gains d'XP et de stats
    const newXp = userProfile.xp + quest.xpReward
    let newLevel = userProfile.level
    let xpToNext = userProfile.xpToNext

    // Vérifier si on monte de niveau
    if (newXp >= xpToNext) {
      newLevel += 1
      xpToNext = newLevel * 100 // XP requis pour le prochain niveau
    }

    // Appliquer les gains de stats
    const newStats = { ...userProfile.stats }
    Object.entries(quest.statRewards).forEach(([stat, value]) => {
      if (stat in newStats && value) {
        newStats[stat as keyof typeof newStats] += value
      }
    })

    setUserProfile(prev => ({
      ...prev,
      xp: newXp >= xpToNext ? newXp - prev.xpToNext : newXp,
      level: newLevel,
      xpToNext,
      stats: newStats
    }))
  }

  // Fonction utilitaire pour obtenir les quêtes disponibles
  const getAvailableQuests = () => {
    return quests.filter(quest => {
      if (quest.completed) return false
      if (!quest.unlockCondition) return true
      
      const prerequisite = quests.find(q => q.id === quest.unlockCondition)
      return prerequisite?.completed || false
    })
  }

  // Mise à jour des conditions au changement d'état
  useEffect(() => {
    updateQuestAvailability()
    checkBadgeUnlocks()
  }, [userProfile, quests])

  return {
    userProfile,
    quests,
    badges,
    completeQuest,
    getAvailableQuests
  }
}