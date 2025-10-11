import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'

interface PersonalRecord {
  name: string
  maxWeight: number
  maxReps: number
  maxVolume: number
  totalSets?: number // ← Ajouter ce champ
}

interface StrengthStats {
  totalSessions: number
  totalVolume: number
  averageProgression: number
  sessionsPerWeek: number
  personalRecords: PersonalRecord[]
}

export const useStrengthStats = () => {
  const { profile } = useProfile()
  const [stats, setStats] = useState<StrengthStats>({
    totalSessions: 0,
    totalVolume: 0,
    averageProgression: 0,
    sessionsPerWeek: 0,
    personalRecords: []
  })
  const [loading, setLoading] = useState(true)

  // Récupérer les KPIs généraux
  const fetchGeneralStats = async () => {
    if (!profile?.user_id) return

    try {
      // 1. Nombre de séances de musculation (même non terminées)
      const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select(`
          id, 
          created_at,
          quests!inner(workout_type)
        `)
        .eq('user_id', profile.user_id)
        .eq('quests.workout_type', 'strength') // Seulement musculation
        // ❌ SUPPRIMÉ : .eq('is_completed', true)

      if (sessionsError) throw sessionsError

      // 2. Volume total des exercise_logs
      const { data: volumeData, error: volumeError } = await supabase
        .from('exercise_logs')
        .select(`
          weight_used,
          reps_completed,
          workout_sessions!inner(
            user_id,
            quests!inner(workout_type)
          )
        `)
        .eq('workout_sessions.user_id', profile.user_id)
        .eq('workout_sessions.quests.workout_type', 'strength')
        // ❌ SUPPRIMÉ : .eq('workout_sessions.is_completed', true)

      if (volumeError) throw volumeError

      // Calculs
      const totalSessions = sessions?.length || 0
      const totalVolume = volumeData?.reduce((sum, log) => {
        return sum + ((log.weight_used || 0) * log.reps_completed)
      }, 0) || 0

      // 3. Séances par semaine (derniers 30 jours)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const recentSessions = sessions?.filter(session => 
        new Date(session.created_at) >= thirtyDaysAgo
      ) || []
      
      const sessionsPerWeek = recentSessions.length > 0 ? (recentSessions.length / 30) * 7 : 0

      console.log('📊 Stats calculées:', { totalSessions, totalVolume, sessionsPerWeek })

      setStats(prev => ({
        ...prev,
        totalSessions,
        totalVolume,
        sessionsPerWeek: Math.round(sessionsPerWeek * 10) / 10
      }))

    } catch (error) {
      console.error('Erreur récupération stats:', error)
    }
  }

  // Récupérer tous les exercices effectués avec leurs meilleures performances
  const fetchExerciseHistory = async () => {
    if (!profile?.user_id) return

    try {
      console.log('🔍 Récupération historique exercices pour user:', profile.user_id)
      
      // 🔥 NOUVELLE REQUÊTE : Plus simple, on récupère TOUS les logs
      const { data, error } = await supabase
        .from('exercise_logs')
        .select(`
          quest_exercises!inner(name),
          weight_used,
          reps_completed,
          completed_at,
          workout_sessions!inner(
            user_id,
            quests!inner(workout_type)
          )
        `)
        .eq('workout_sessions.user_id', profile.user_id)
        .eq('workout_sessions.quests.workout_type', 'strength')
        // ❌ SUPPRIMÉ : .eq('workout_sessions.is_completed', true)
        .order('completed_at', { ascending: false })

      console.log('📊 Données récupérées:', data)
      console.log('📊 Nombre de logs trouvés:', data?.length || 0)

      if (error) {
        console.error('❌ Erreur requête:', error)
        throw error
      }

      if (!data || data.length === 0) {
        console.log('ℹ️ Aucune donnée trouvée')
        setStats(prev => ({ ...prev, personalRecords: [] }))
        return
      }

      // Grouper par exercice et calculer les stats
      const exerciseMap: Record<string, {
        name: string
        maxWeight: number
        maxReps: number
        totalSets: number
        maxVolume: number
        bestSeries: { reps: number, weight: number }
        lastPerformed: string
      }> = {}

      data.forEach(log => {
        const exerciseName = log.quest_exercises.name
        const weight = log.weight_used || 0
        const reps = log.reps_completed
        const volume = weight * reps
        
        console.log(`🏋️ Traitement: ${exerciseName} - ${reps} @ ${weight}kg`)
        
        if (!exerciseMap[exerciseName]) {
          exerciseMap[exerciseName] = {
            name: exerciseName,
            maxWeight: weight,
            maxReps: reps,
            totalSets: 1,
            maxVolume: volume,
            bestSeries: { reps, weight },
            lastPerformed: log.completed_at
          }
        } else {
          const current = exerciseMap[exerciseName]
          
          // Incrémenter le nombre de séries
          current.totalSets += 1
          
          // Mettre à jour les maximums
          if (weight > current.maxWeight) {
            current.maxWeight = weight
          }
          if (reps > current.maxReps) {
            current.maxReps = reps
          }
          
          // Nouvelle logique : meilleure série = plus de reps, puis plus de poids
          if (reps > current.bestSeries.reps || 
              (reps === current.bestSeries.reps && weight > current.bestSeries.weight)) {
            current.bestSeries = { reps, weight }
          }
          
          if (volume > current.maxVolume) {
            current.maxVolume = volume
          }

          // Mettre à jour la dernière fois
          if (new Date(log.completed_at) > new Date(current.lastPerformed)) {
            current.lastPerformed = log.completed_at
          }
        }
      })

      const exerciseHistory = Object.values(exerciseMap)
        .sort((a, b) => b.maxVolume - a.maxVolume) // Tri par volume max décroissant
    
      console.log('📋 Exercices traités:', exerciseHistory)
    
      setStats(prev => ({ 
        ...prev, 
        personalRecords: exerciseHistory.map(ex => ({
          name: ex.name,
          maxWeight: ex.bestSeries.weight,
          maxReps: ex.bestSeries.reps,
          maxVolume: ex.maxVolume,
          totalSets: ex.totalSets
        }))
      }))

    } catch (error) {
      console.error('❌ Erreur récupération historique exercices:', error)
    }
  }

  // Charger toutes les stats
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      await Promise.all([
        fetchGeneralStats(),
        fetchExerciseHistory() // ← Changé ici
      ])
      setLoading(false)
    }

    if (profile?.user_id) {
      loadStats()
    }
  }, [profile?.user_id])

  return {
    stats,
    loading,
    fetchGeneralStats,
    fetchExerciseHistory // ← Changé ici
  }
}