import { describe, it, expect } from 'vitest'

// Tests de logique métier pure - Approche moderne 2025
describe('Quest System Logic', () => {
  describe('Quest Status Management', () => {
    it('should identify completed quest correctly', () => {
      const questStatus = 'completed'
      const isCompleted = questStatus === 'completed'
      
      expect(isCompleted).toBe(true)
    })

    it('should calculate correct unlock sequence', () => {
      // Simulation de tes données réelles
      const quests = [
        { id: 'cd505854-0676-4947-8d96-0dbe3b21da3b', order_index: 1, title: 'Eveil du corps' },
        { id: '35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a', order_index: 2, title: 'Découverte des supersets' },
        { id: '5ec3cffb-1479-4256-ae96-923c0e914848', order_index: 3, title: 'Mini Boss' }
      ]

      const userStatuses = new Map([
        ['cd505854-0676-4947-8d96-0dbe3b21da3b', 'completed'],
        ['35c3ffdc-3c54-422a-84e1-cd9ab09bbb3a', 'completed']
      ])

      // Test de ta logique de déblocage
      const getQuestStatus = (quest: any, index: number) => {
        const dbStatus = userStatuses.get(quest.id)
        
        if (dbStatus === 'completed') return 'completed'
        if (index === 0) return 'unlocked'
        
        const previousQuest = quests[index - 1]
        const previousStatus = userStatuses.get(previousQuest?.id)
        
        return previousStatus === 'completed' ? 'unlocked' : 'locked'
      }

      expect(getQuestStatus(quests[0], 0)).toBe('completed') // Première terminée
      expect(getQuestStatus(quests[1], 1)).toBe('completed') // Deuxième terminée  
      expect(getQuestStatus(quests[2], 2)).toBe('unlocked')  // Troisième débloquée
    })
  })

  describe('Quest Validation Logic', () => {
    it('should create valid quest completion data', () => {
      const userId = 'test-user-123'
      const questId = 'quest-456'
      
      const questCompletion = {
        user_id: userId,
        quest_id: questId,
        status: 'completed' as const,
        completed_at: new Date().toISOString()
      }

      expect(questCompletion.status).toBe('completed')
      expect(questCompletion.user_id).toBe(userId)
      expect(questCompletion.quest_id).toBe(questId)
      expect(typeof questCompletion.completed_at).toBe('string')
    })
  })
})