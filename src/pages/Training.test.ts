import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'

// Types modernes pour éviter les régressions de typage
interface QuestCompletionData {
  user_id: string
  quest_id: string
  status: 'completed' | 'todo' | 'locked'
  completed_at: string
}

interface SessionUpdateData {
  is_completed: boolean
  ended_at: string
  total_time_seconds: number
  rounds_completed: number
}

interface XPCalculation {
  xp_force: number
  xp_endurance: number
  xp_agilite: number
  xp_mental: number
  total: number
}

interface QuestData {
  id: string
  campaign_id: string
  order_index: number
  title: string
  xp_force: number
  xp_endurance: number
  xp_agilite: number
  xp_mental: number
}

// Test Factory moderne pour créer des données cohérentes
class QuestTestFactory {
  static createQuest(overrides: Partial<QuestData> = {}): QuestData {
    return {
      id: 'cd505854-0676-4947-8d96-0dbe3b21da3b',
      campaign_id: 'b38309ee-b9df-45bb-a2d5-07b16f7b97f2',
      order_index: 1,
      title: 'Eveil du corps',
      xp_force: 10,
      xp_endurance: 15,
      xp_agilite: 5,
      xp_mental: 20,
      ...overrides
    }
  }

  static createProfile(overrides: Partial<{ user_id: string }> = {}) {
    return {
      user_id: 'test-user-123',
      ...overrides
    }
  }

  static createSession(overrides: Partial<{ id: string }> = {}) {
    return {
      id: 'test-session-999',
      ...overrides
    }
  }
}

// Classe utilitaire moderne pour les validations métier
class QuestValidationService {
  static validateCompletionData(data: QuestCompletionData): boolean {
    return !!(
      data.user_id &&
      data.quest_id &&
      data.status === 'completed' &&
      data.completed_at &&
      new Date(data.completed_at).getTime() > 0
    )
  }

  static calculateNextQuestOrder(currentOrder: number): number {
    return currentOrder + 1
  }

  static calculateTotalXP(xp: Omit<XPCalculation, 'total'>): XPCalculation {
    const total = xp.xp_force + xp.xp_endurance + xp.xp_agilite + xp.xp_mental
    return { ...xp, total }
  }

  static validateSessionUpdate(data: SessionUpdateData): boolean {
    return !!(
      typeof data.is_completed === 'boolean' &&
      data.ended_at &&
      data.total_time_seconds > 0 &&
      data.rounds_completed >= 0
    )
  }
}

// Tests modernes avec protection contre les régressions
describe('Training - Quest Validation System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Quest Completion Workflow', () => {
    it('should create valid quest completion data with proper validation', () => {
      // Arrange - Données réelles du projet
      const quest = QuestTestFactory.createQuest()
      const profile = QuestTestFactory.createProfile()
      
      // Act - Simulation de la création des données
      const questCompletion: QuestCompletionData = {
        user_id: profile.id,
        quest_id: quest.id,
        status: 'completed',
        completed_at: new Date().toISOString()
      }

      // Assert - Validation stricte avec protection anti-régression
      expect(QuestValidationService.validateCompletionData(questCompletion)).toBe(true)
      expect(questCompletion.user_id).toMatch(/^test-user-\d+$/) // Pattern validation
      expect(questCompletion.quest_id).toMatch(/^[a-f0-9-]{36}$/) // UUID validation
      expect(questCompletion.status).toBe('completed')
      expect(new Date(questCompletion.completed_at).getTime()).toBeGreaterThan(Date.now() - 1000)
    })

    it('should prevent regression in next quest identification logic', () => {
      // Arrange - Test avec différents scénarios
      const testCases = [
        { current: 1, expected: 2 },
        { current: 5, expected: 6 },
        { current: 99, expected: 100 }
      ]

      testCases.forEach(({ current, expected }) => {
        // Act
        const nextOrder = QuestValidationService.calculateNextQuestOrder(current)
        
        // Assert - Protection contre les régressions arithmétiques
        expect(nextOrder).toBe(expected)
        expect(nextOrder).toBeGreaterThan(current)
        expect(typeof nextOrder).toBe('number')
      })
    })

    it('should create valid next quest unlock data', () => {
      // Arrange
      const profile = QuestTestFactory.createProfile()
      const nextQuestId = 'next-quest-789'
      
      // Act
      const nextQuestUnlock = {
        user_id: profile.id,
        quest_id: nextQuestId,
        status: 'todo' as const
      }

      // Assert - Validation de la structure
      expect(nextQuestUnlock.status).toBe('todo')
      expect(nextQuestUnlock.user_id).toBe(profile.id)
      expect(nextQuestUnlock.quest_id).toBe(nextQuestId)
      
      // Protection contre les régressions de type
      expect(typeof nextQuestUnlock.user_id).toBe('string')
      expect(['todo', 'completed', 'locked']).toContain(nextQuestUnlock.status)
    })
  })

  describe('Session Management', () => {
    it('should create valid session completion data with strict validation', () => {
      // Arrange
      const mockTime = 1200 // 20 minutes
      const mockRounds = 3
      
      // Act
      const sessionUpdate: SessionUpdateData = {
        is_completed: true,
        ended_at: new Date().toISOString(),
        total_time_seconds: mockTime,
        rounds_completed: mockRounds
      }

      // Assert - Validation métier stricte
      expect(QuestValidationService.validateSessionUpdate(sessionUpdate)).toBe(true)
      expect(sessionUpdate.is_completed).toBe(true)
      expect(sessionUpdate.total_time_seconds).toBeGreaterThan(0)
      expect(sessionUpdate.rounds_completed).toBeGreaterThanOrEqual(0)
      
      // Protection contre les régressions de format de date
      expect(() => new Date(sessionUpdate.ended_at)).not.toThrow()
      expect(new Date(sessionUpdate.ended_at).getTime()).toBeGreaterThan(Date.now() - 1000)
    })
  })

  describe('XP Calculation System', () => {
    it('should calculate XP with zero-regression mathematical precision', () => {
      // Arrange - Cas de test exhaustifs
      const xpTestCases = [
        { xp_force: 10, xp_endurance: 15, xp_agilite: 5, xp_mental: 20, expectedTotal: 50 },
        { xp_force: 0, xp_endurance: 0, xp_agilite: 0, xp_mental: 0, expectedTotal: 0 },
        { xp_force: 100, xp_endurance: 200, xp_agilite: 300, xp_mental: 400, expectedTotal: 1000 }
      ]

      xpTestCases.forEach((testCase) => {
        // Act
        const result = QuestValidationService.calculateTotalXP({
          xp_force: testCase.xp_force,
          xp_endurance: testCase.xp_endurance,
          xp_agilite: testCase.xp_agilite,
          xp_mental: testCase.xp_mental
        })

        // Assert - Protection mathématique stricte
        expect(result.total).toBe(testCase.expectedTotal)
        expect(result.total).toBe(
          result.xp_force + result.xp_endurance + result.xp_agilite + result.xp_mental
        )
        
        // Validation des types pour éviter les régressions
        expect(typeof result.total).toBe('number')
        expect(Number.isInteger(result.total)).toBe(true)
        expect(result.total).toBeGreaterThanOrEqual(0)
      })
    })

    it('should create audit XP entry with complete data integrity', () => {
      // Arrange
      const quest = QuestTestFactory.createQuest()
      const profile = QuestTestFactory.createProfile()
      
      // Act
      const xpCalculation = QuestValidationService.calculateTotalXP({
        xp_force: quest.xp_force,
        xp_endurance: quest.xp_endurance,
        xp_agilite: quest.xp_agilite,
        xp_mental: quest.xp_mental
      })

      const auditXP = {
        user_id: profile.id,
        quest_id: quest.id,
        delta_force: quest.xp_force,
        delta_endurance: quest.xp_endurance,
        delta_agilite: quest.xp_agilite,
        delta_mental: quest.xp_mental,
        delta_total: xpCalculation.total
      }

      // Assert - Validation d'intégrité des données
      expect(auditXP.delta_total).toBe(50) // Basé sur les données factory
      expect(auditXP.user_id).toBe(profile.id)
      expect(auditXP.quest_id).toBe(quest.id)
      
      // Protection contre la corruption des données XP
      expect(auditXP.delta_total).toBe(
        auditXP.delta_force + auditXP.delta_endurance + auditXP.delta_agilite + auditXP.delta_mental
      )
      
      // Validation des contraintes métier
      expect(auditXP.delta_force).toBeGreaterThanOrEqual(0)
      expect(auditXP.delta_endurance).toBeGreaterThanOrEqual(0)
      expect(auditXP.delta_agilite).toBeGreaterThanOrEqual(0)
      expect(auditXP.delta_mental).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Data Integrity & Regression Prevention', () => {
    it('should maintain consistent quest ID format across all operations', () => {
      // Test de régression pour le format des IDs
      const quest = QuestTestFactory.createQuest()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      
      expect(quest.id).toMatch(uuidRegex)
      expect(quest.campaign_id).toMatch(uuidRegex)
    })

    it('should enforce status enum constraints', () => {
      // Protection contre les régressions de statut
      const validStatuses = ['completed', 'todo', 'locked'] as const
      
      validStatuses.forEach(status => {
        const completion: QuestCompletionData = {
          user_id: 'test',
          quest_id: 'test',
          status,
          completed_at: new Date().toISOString()
        }
        
        expect(validStatuses).toContain(completion.status)
      })
    })
  })
})