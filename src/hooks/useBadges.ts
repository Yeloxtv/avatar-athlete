import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

export interface BadgeDef {
  id: string
  name: string
  description: string
  image: string
  category: 'regularite' | 'performance' | 'specialite'
}

export const BADGES: BadgeDef[] = [
  // Régularité
  { id: 'premier-pas',      name: 'Premier Pas',       description: 'Compléter sa 1ère séance',                image: '/badges/premier-pas.png',      category: 'regularite' },
  { id: 'semaine-de-feu',   name: 'Semaine de Feu',    description: '7 jours consécutifs d\'entraînement',    image: '/badges/semaine-de-feu.png',   category: 'regularite' },
  { id: 'habitue',          name: 'Habitué',           description: 'Compléter 10 séances au total',           image: '/badges/habitue.png',          category: 'regularite' },
  { id: 'guerrier-du-mois', name: 'Guerrier du Mois',  description: 'Compléter 30 séances au total',           image: '/badges/guerrier-du-mois.png', category: 'regularite' },
  { id: 'centurion',        name: 'Centurion',         description: 'Compléter 100 séances au total',          image: '/badges/centurion.png',        category: 'regularite' },
  // Performance
  { id: 'premier-record',   name: 'Premier Record',    description: 'Battre son premier PR',                   image: '/badges/premier-record.png',   category: 'performance' },
  { id: 'machine',          name: 'Machine',           description: 'Battre 10 records personnels',            image: '/badges/machine.png',          category: 'performance' },
  { id: 'titan',            name: 'Titan',             description: 'Soulever 10 000 kg de volume total',      image: '/badges/titan.png',            category: 'performance' },
  { id: 'sprint',           name: 'Sprint',            description: 'Terminer une séance en moins de 30 min',  image: '/badges/sprint.png',           category: 'performance' },
  // Spécialité
  { id: 'roi-du-push',      name: 'Roi du Push',       description: '10 séances pecs / épaules / triceps',     image: '/badges/roi-du-push.png',      category: 'specialite' },
  { id: 'pilier',           name: 'Pilier',            description: '10 séances jambes',                       image: '/badges/pilier.png',           category: 'specialite' },
  { id: 'sniper',           name: 'Sniper',            description: 'Compléter 100% des séries d\'une séance', image: '/badges/sniper.png',           category: 'specialite' },
  { id: 'sommet',           name: 'Sommet',            description: 'Terminer un programme complet',           image: '/badges/sommet.png',           category: 'specialite' },
]

const CATEGORY_LABELS = {
  regularite: 'Régularité',
  performance: 'Performance',
  specialite: 'Spécialité',
}

export { CATEGORY_LABELS }

export function useBadges() {
  const { profile } = useProfile()
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) fetchUnlocked()
  }, [profile])

  const fetchUnlocked = async () => {
    if (!profile) return
    const { data } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', profile.id)
    setUnlockedIds(new Set((data || []).map((b: any) => b.badge_id)))
    setLoading(false)
  }

  const unlock = async (badgeId: string): Promise<boolean> => {
    if (!profile || unlockedIds.has(badgeId)) return false
    const { error } = await supabase
      .from('user_badges')
      .insert({ user_id: profile.id, badge_id: badgeId })
    if (!error) {
      setUnlockedIds(prev => new Set([...prev, badgeId]))
      return true
    }
    return false
  }

  const recalculateAll = async (): Promise<number> => {
    if (!profile) return 0

    const [
      { data: sessions },
      { data: completedCampaigns },
    ] = await Promise.all([
      supabase
        .from('workout_sessions')
        .select('id, total_time_seconds, started_at')
        .eq('user_id', profile.id)
        .eq('is_completed', true),
      supabase
        .from('user_quests')
        .select('quest_id, quests!inner(campaign_id)')
        .eq('user_id', profile.id)
        .eq('status', 'completed'),
    ])

    const earned: string[] = []
    const sessionCount = sessions?.length || 0

    // Régularité
    if (sessionCount >= 1)   earned.push('premier-pas')
    if (sessionCount >= 10)  earned.push('habitue')
    if (sessionCount >= 30)  earned.push('guerrier-du-mois')
    if (sessionCount >= 100) earned.push('centurion')

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
      if (maxStreak >= 7) earned.push('semaine-de-feu')
    }

    // Sprint — au moins une séance < 30 min
    if (sessions?.some(s => s.total_time_seconds > 0 && s.total_time_seconds < 1800)) {
      earned.push('sprint')
    }

    // Volume total 10 000 kg
    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map(s => s.id)
      const { data: volumeData } = await supabase
        .from('exercise_logs')
        .select('reps_completed, weight_used')
        .in('session_id', sessionIds)
      const lifetimeVolume = (volumeData || []).reduce(
        (s, l) => s + l.reps_completed * (Number(l.weight_used) || 0), 0
      )
      if (lifetimeVolume >= 10000) earned.push('titan')

      // PRs — détecter s'il y en a eu au moins un
      const { data: allLogs } = await supabase
        .from('exercise_logs')
        .select('session_id, exercise_id, weight_used, reps_completed')
        .in('session_id', sessionIds)
        .order('session_id')

      if (allLogs && allLogs.length > 0) {
        // Parcourir les sessions chronologiquement, détecter les PRs
        const sessionOrder = (sessions || [])
          .slice()
          .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime())
          .map(s => s.id)

        const bestByExercise = new Map<string, number>()
        let totalPRs = 0

        for (const sid of sessionOrder) {
          const logsForSession = allLogs.filter(l => l.session_id === sid)
          for (const log of logsForSession) {
            const prev = bestByExercise.get(log.exercise_id) || 0
            if ((Number(log.weight_used) || 0) > prev) {
              if (prev > 0) totalPRs++
              bestByExercise.set(log.exercise_id, Number(log.weight_used) || 0)
            }
          }
        }

        if (totalPRs >= 1)  earned.push('premier-record')
        if (totalPRs >= 10) earned.push('machine')
      }
    }

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
          earned.push('sommet')
          break
        }
      }
    }

    // Unlock tous les badges mérités
    let newCount = 0
    for (const badgeId of [...new Set(earned)]) {
      const gained = await unlock(badgeId)
      if (gained) newCount++
    }

    return newCount
  }

  return { badges: BADGES, unlockedIds, loading, unlock, recalculateAll, refetch: fetchUnlocked }
}
