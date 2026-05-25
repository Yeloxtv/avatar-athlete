import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useCampaignManager } from '@/hooks/useCampaignManager'
import { ExerciseDraft, SessionDraft, FinisherDraft } from '@/types/program'
import { toast } from '@/hooks/use-toast'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Shape returned by loadExistingProgram
export interface LoadedProgram {
  campaignId: string
  programName: string
  activeDays: Set<number>
  sessions: Record<number, SessionDraft>
}

export interface SaveProgramData {
  programName: string
  activeDays: Set<number>
  sessions: Record<number, SessionDraft>
}

export function useProgramPersistence() {
  const { saveCampaign } = useCampaignManager()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadExistingProgram = async (profileId: string): Promise<LoadedProgram | null> => {
    setLoading(true)
    setError(null)
    try {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select(`
          id, title,
          quests(
            id, title, day_of_week, workout_type, total_minutes,
            quest_exercises(id, name, sets_count, target_reps, target_weight, rest_seconds, order_index, exercise_id)
          )
        `)
        .eq('owner_user_id', profileId)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      if (!campaign) return null

      const days = new Set<number>()
      const sessionMap: Record<number, SessionDraft> = {}

      // Separate strength quests from finisher quests
      const strengthQuests = (campaign.quests ?? []).filter((q: any) => q.workout_type === 'strength' || q.workout_type == null)
      const finisherQuests = (campaign.quests ?? []).filter((q: any) => q.workout_type === 'amrap' || q.workout_type === 'emom' || q.workout_type === 'tabata')

      // Build finisher map by day
      const finisherByDay: Record<number, FinisherDraft> = {}
      for (const fq of finisherQuests) {
        if (fq.day_of_week == null) continue
        finisherByDay[fq.day_of_week] = {
          questId: fq.id,
          format: fq.workout_type as 'amrap' | 'emom' | 'tabata',
          duration_minutes: fq.total_minutes ?? 10,
          exercises: (fq.quest_exercises ?? [])
            .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((ex: any) => ({
              name: ex.name,
              target_reps: ex.target_reps ?? 10,
              global_exercise_id: ex.exercise_id ?? null,
            })),
        }
      }

      for (const quest of strengthQuests) {
        if (quest.day_of_week == null) continue
        days.add(quest.day_of_week)
        const exercises: ExerciseDraft[] = (quest.quest_exercises ?? [])
          .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
          .map((ex: any) => ({
            id: ex.id,
            name: ex.name,
            sets_count: ex.sets_count ?? 3,
            target_reps: ex.target_reps ?? 8,
            target_weight: ex.target_weight ?? null,
            rest_seconds: ex.rest_seconds ?? 90,
            global_exercise_id: ex.exercise_id ?? null,
          }))
        sessionMap[quest.day_of_week] = {
          questId: quest.id,
          name: quest.title,
          exercises: exercises.length > 0 ? exercises : [{ name: '', sets_count: 3, target_reps: 8, target_weight: null, rest_seconds: 90 }],
          finisher: finisherByDay[quest.day_of_week] ?? null,
        }
      }

      return {
        campaignId: campaign.id,
        programName: campaign.title,
        activeDays: days,
        sessions: sessionMap,
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      return null
    } finally {
      setLoading(false)
    }
  }

  const saveProgram = async (
    data: SaveProgramData,
    profileId: string,
    existingCampaignId: string | null
  ): Promise<void> => {
    setSaving(true)
    try {
      let campaignId = existingCampaignId

      if (!campaignId) {
        campaignId = await saveCampaign(
          {
            title: data.programName,
            slug: '',
            description: '',
            is_active: true,
            level_required: 'BEGINNER',
            equipment_tags: [],
            estimated_duration_weeks: 12,
          },
          true,
          profileId
        )
      } else {
        await supabase
          .from('campaigns')
          .update({ title: data.programName })
          .eq('id', campaignId)
      }

      const sortedDays = [...data.activeDays].sort((a, b) => a - b)

      // Delete quests for days that were deactivated (edit mode)
      if (existingCampaignId) {
        const { data: existingQuests } = await supabase
          .from('quests')
          .select('id, day_of_week')
          .eq('campaign_id', campaignId)

        const deactivatedQuests = (existingQuests ?? []).filter(
          q => q.day_of_week != null && !data.activeDays.has(q.day_of_week)
        )
        for (const q of deactivatedQuests) {
          await supabase.from('quest_exercises').delete().eq('quest_id', q.id)
          await supabase.from('quests').delete().eq('id', q.id)
        }
      }

      // Upsert each session
      for (let i = 0; i < sortedDays.length; i++) {
        const day = sortedDays[i]
        const session = data.sessions[day]
        if (!session) continue

        const questPayload = {
          campaign_id: campaignId,
          title: session.name || DAYS[day],
          type: 'quete' as const,
          workout_type: 'strength' as const,
          order_index: i + 1,
          day_of_week: day,
          xp_force: 30,
          xp_endurance: 10,
          xp_agilite: 5,
          xp_mental: 5,
          xp_total: 50,
          is_published: false,
          is_one_shot: false,
          level_required: 'BEGINNER' as const,
          equipment_tags: [],
          estimated_duration_minutes: Math.max(30, session.exercises.length * 8),
          rest_seconds: 90,
          work_seconds: 0,
          rounds_target: 0,
          total_minutes: 0,
        }

        let questId = session.questId

        if (questId) {
          await supabase.from('quests').update(questPayload).eq('id', questId)
        } else {
          const { data: created, error } = await supabase
            .from('quests')
            .insert(questPayload)
            .select('id')
            .single()
          if (error) throw error
          questId = created.id
        }

        // Sync exercises
        const validExercises = session.exercises.filter(ex => ex.name.trim())

        // Delete exercises not in the current list
        const existingIds = validExercises.map(ex => ex.id).filter(Boolean) as string[]
        if (existingIds.length > 0) {
          await supabase
            .from('quest_exercises')
            .delete()
            .eq('quest_id', questId)
            .not('id', 'in', `(${existingIds.join(',')})`)
        } else {
          await supabase.from('quest_exercises').delete().eq('quest_id', questId)
        }

        // Upsert exercises
        if (validExercises.length > 0) {
          const exercisePayload = validExercises.map((ex, idx) => ({
            ...(ex.id ? { id: ex.id } : {}),
            quest_id: questId,
            name: ex.name,
            order_index: idx + 1,
            sets_count: ex.sets_count,
            target_reps: ex.target_reps,
            target_weight: ex.target_weight ?? null,
            rest_seconds: ex.rest_seconds,
            notes: null,
            ...(ex.global_exercise_id ? { exercise_id: ex.global_exercise_id } : {}),
          }))
          const { error } = await supabase
            .from('quest_exercises')
            .upsert(exercisePayload, { onConflict: 'id' })
          if (error) throw error
        }

        // Save finisher quest if defined
        const finisher = session.finisher
        if (finisher) {
          const finisherQuestPayload = {
            campaign_id: campaignId,
            title: `Finisher ${session.name || DAYS[day]}`,
            type: 'quete' as const,
            workout_type: finisher.format as any,
            order_index: i + 1,
            day_of_week: day,
            xp_force: 10,
            xp_endurance: 20,
            xp_agilite: 10,
            xp_mental: 10,
            xp_total: 50,
            is_published: false,
            is_one_shot: false,
            level_required: 'BEGINNER' as const,
            equipment_tags: [],
            estimated_duration_minutes: finisher.duration_minutes,
            rest_seconds: 0,
            work_seconds: 0,
            rounds_target: 0,
            total_minutes: finisher.duration_minutes,
          }

          let finisherQuestId = finisher.questId

          if (finisherQuestId) {
            await supabase.from('quests').update(finisherQuestPayload).eq('id', finisherQuestId)
          } else {
            const { data: createdFinisher, error: finErr } = await supabase
              .from('quests')
              .insert(finisherQuestPayload)
              .select('id')
              .single()
            if (finErr) throw finErr
            finisherQuestId = createdFinisher.id
          }

          // Sync finisher exercises (full replace)
          await supabase.from('quest_exercises').delete().eq('quest_id', finisherQuestId)
          const validFinisherExercises = finisher.exercises.filter(ex => ex.name.trim())
          if (validFinisherExercises.length > 0) {
            const finisherExPayload = validFinisherExercises.map((ex, idx) => ({
              quest_id: finisherQuestId,
              name: ex.name,
              order_index: idx + 1,
              sets_count: 1,
              target_reps: ex.target_reps,
              target_weight: null,
              rest_seconds: 0,
              notes: null,
              ...(ex.global_exercise_id ? { exercise_id: ex.global_exercise_id } : {}),
            }))
            const { error: finExErr } = await supabase
              .from('quest_exercises')
              .insert(finisherExPayload)
            if (finExErr) throw finExErr
          }
        } else if (session.finisher === null && session.questId) {
          // Finisher was removed — delete existing finisher quest for this day if any
          const { data: existingFinishers } = await supabase
            .from('quests')
            .select('id')
            .eq('campaign_id', campaignId!)
            .eq('day_of_week', day)
            .in('workout_type', ['amrap', 'emom', 'tabata'])
          for (const fq of existingFinishers ?? []) {
            await supabase.from('quest_exercises').delete().eq('quest_id', fq.id)
            await supabase.from('quests').delete().eq('id', fq.id)
          }
        }
      }

      toast({
        title: existingCampaignId ? 'Programme mis à jour !' : 'Programme créé !',
        description: `${sortedDays.length} séance${sortedDays.length > 1 ? 's' : ''} enregistrée${sortedDays.length > 1 ? 's' : ''}`,
      })
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le programme.',
        variant: 'destructive',
      })
      throw err
    } finally {
      setSaving(false)
    }
  }

  return {
    saving,
    loading,
    error,
    loadExistingProgram,
    saveProgram,
  }
}
