export interface StreakSummary {
  currentStreak: number
  completedToday: boolean
  completedYesterday: boolean
  isActive: boolean
  weekDays: number[]
  longestStreak: number
}

function getLocalDateKey(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function getMonday(date: Date): Date {
  const monday = new Date(date)
  const jsDay = monday.getDay()
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay
  monday.setDate(monday.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function getDayIndex(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

export class StreakService {
  static getLocalDateKey = getLocalDateKey

  static compute(sessionDates: Array<string | Date>, referenceDate = new Date()): StreakSummary {
    const dayKeys = new Set(sessionDates.map(getLocalDateKey))
    const todayKey = getLocalDateKey(referenceDate)
    const yesterdayKey = getLocalDateKey(addDays(referenceDate, -1))
    const completedToday = dayKeys.has(todayKey)
    const completedYesterday = dayKeys.has(yesterdayKey)
    const isActive = completedToday || completedYesterday

    let currentStreak = 0
    if (isActive) {
      let cursor = completedToday ? new Date(referenceDate) : addDays(referenceDate, -1)
      while (dayKeys.has(getLocalDateKey(cursor))) {
        currentStreak += 1
        cursor = addDays(cursor, -1)
      }
    }

    const sortedKeys = Array.from(dayKeys).sort()
    let longestStreak = 0
    let run = 0
    let previous: Date | null = null
    for (const key of sortedKeys) {
      const current = new Date(`${key}T12:00:00`)
      if (!previous) {
        run = 1
      } else {
        const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000)
        run = diffDays === 1 ? run + 1 : 1
      }
      longestStreak = Math.max(longestStreak, run)
      previous = current
    }

    const monday = getMonday(referenceDate)
    const weekDays = Array.from(dayKeys)
      .map(key => new Date(`${key}T12:00:00`))
      .filter(date => date >= monday && date <= addDays(monday, 6))
      .map(getDayIndex)

    return {
      currentStreak,
      completedToday,
      completedYesterday,
      isActive,
      weekDays: [...new Set(weekDays)],
      longestStreak,
    }
  }

  static getXpBonusRate(streakDays: number): number {
    if (streakDays < 2) return 0
    return Math.min(0.25, (streakDays - 1) * 0.05)
  }
}
