import { StreakService } from '@/services/streakService'

export type DailyQuestKind = 'complete_workout' | 'complete_sets' | 'earn_xp'

export interface DailyQuestMetrics {
  completedWorkouts: number
  completedSets: number
  earnedXp: number
}

export interface DailyQuest {
  id: string
  kind: DailyQuestKind
  title: string
  description: string
  target: number
  progress: number
  unit: string
  rewardXp: number
  isComplete: boolean
  percentage: number
}

const QUEST_ROTATION: Array<Omit<DailyQuest, 'id' | 'progress' | 'isComplete' | 'percentage'>> = [
  {
    kind: 'complete_workout',
    title: 'Finir une run',
    description: 'Termine une séance aujourd’hui.',
    target: 1,
    unit: 'séance',
    rewardXp: 60,
  },
  {
    kind: 'complete_sets',
    title: 'Forger 5 séries',
    description: 'Valide 5 séries dans tes entraînements du jour.',
    target: 5,
    unit: 'séries',
    rewardXp: 50,
  },
  {
    kind: 'earn_xp',
    title: 'Récolter 120 XP',
    description: 'Gagne 120 XP aujourd’hui.',
    target: 120,
    unit: 'XP',
    rewardXp: 70,
  },
]

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

function getMetricValue(kind: DailyQuestKind, metrics: DailyQuestMetrics): number {
  switch (kind) {
    case 'complete_workout':
      return metrics.completedWorkouts
    case 'complete_sets':
      return metrics.completedSets
    case 'earn_xp':
      return metrics.earnedXp
  }
}

export class DailyQuestService {
  static getTodayRange(referenceDate = new Date()) {
    const start = new Date(referenceDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(referenceDate)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  static compute(metrics: DailyQuestMetrics, referenceDate = new Date()): DailyQuest {
    const dateKey = StreakService.getLocalDateKey(referenceDate)
    const template = QUEST_ROTATION[getDayOfYear(referenceDate) % QUEST_ROTATION.length]
    const progress = Math.min(template.target, getMetricValue(template.kind, metrics))
    const percentage = template.target > 0 ? Math.min(100, Math.round((progress / template.target) * 100)) : 100

    return {
      ...template,
      id: `${dateKey}:${template.kind}`,
      progress,
      isComplete: progress >= template.target,
      percentage,
    }
  }

  static getClaimKey(profileId: string, questId: string): string {
    return `avatar-athlete:daily-quest:${profileId}:${questId}`
  }

  static hasClaimed(profileId: string, questId: string): boolean {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(DailyQuestService.getClaimKey(profileId, questId)) === 'claimed'
  }

  static markClaimed(profileId: string, questId: string): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(DailyQuestService.getClaimKey(profileId, questId), 'claimed')
  }
}
