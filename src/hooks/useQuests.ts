// FILE: src/hooks/useQuests.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import type { Database } from '@/integrations/supabase/types'

type Quest = Database['public']['Tables']['quests']['Row']
type UserQuest = Database['public']['Tables']['user_quests']['Row']
type QuestExercise = Database['public']['Tables']['quest_exercises']['Row']

// ✅ Sépare le statut DB du statut UI (évite d’injecter 'locked'/'unlocked' dans une colonne typée)
type UserQuestStatusDB = UserQuest['status'] // 'todo' | 'in_progress' | 'done' | 'abandoned' (selon ton schéma)
type UIQuestStatus = UserQuestStatusDB | 'locked' | 'unlocked'

interface QuestWithStatus extends Quest {
  user_status: UIQuestStatus
  exercises: QuestExercise[]
}

interface UseQuestsOptions {
  campaignSlug?: string
  campaignId?: string
  enabled?: boolean
}

async function getUserQuestStatus(userId: string, questId: string): Promise<UserQuestStatusDB | null> {
  const { data, error } = await supabase
    .from('user_quests')
    .select('status')
    .eq('user_id', userId)
    .eq('quest_id', questId)
    .maybeSingle() // ✅ CORRECTION
  if (error) throw error
  return data?.status as UserQuestStatusDB ?? null 
}

async function startUserQuest(userId: string, questId: string): Promise<void> {
  const { error } = await supabase
    .from('user_quests')
    .upsert(
      {
        user_id: userId,
        quest_id: questId,
        status: 'in_progress',
        started_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,quest_id' } // nécessite index unique
    )
  if (error) throw error
}

export function useQuests({ campaignId, campaignSlug, enabled = true }: UseQuestsOptions = {}) {
  const [quests, setQuests] = useState<QuestWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // why: .maybeSingle() -> pas d’erreur si 0 ou >1 par accident (on gère null)
  const getCampaignIdFromSlug = async (slug: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    if (!data) throw new Error(`Campaign not found for slug "${slug}"`)
    return data.id as string
  }

  const fetchQuests = async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      let finalCampaignId = campaignId

      // why: support slug -> id sans .single() strict
      if (!finalCampaignId && campaignSlug) {
        finalCampaignId = await getCampaignIdFromSlug(campaignSlug)
      }

      if (!finalCampaignId) {
        setQuests([])
        setLoading(false)
        return
      }

      // Optionnel: init user_quests via RPC si user connecté
      if (user) {
        await initializeUserQuests(finalCampaignId)
      }

      // ✅ Tri explicite ASC, select imbriqué simple
      const { data: questsData, error: questsError } = await supabase
        .from('quests')
        .select(`
          *,
          quest_exercises (
            id,
            name,
            target_reps,
            order_index
          )
        `)
        .eq('campaign_id', finalCampaignId)
        .order('order_index', { ascending: true })

      if (questsError) throw questsError

      // ✅ Bulk read des statuts utilisateur (conserve ton approche, mais map -> Map pour O(1))
      let statusByQuestId = new Map<string, UserQuestStatusDB>()
      if (user && questsData && questsData.length > 0) {
        const questIds = questsData.map(q => q.id)
        const { data: userQuests, error: userQuestsError } = await supabase
          .from('user_quests')
          .select('quest_id, status')
          .eq('user_id', user.id)
          .in('quest_id', questIds)

        if (!userQuestsError && userQuests?.length) {
          statusByQuestId = new Map(
            userQuests.map((r: { quest_id: string; status: UserQuestStatusDB }) => [r.quest_id, r.status])
          )
        }
      }

      // ✅ Ne plus écraser 'status' (DB). On ajoute 'user_status' pour l’UI.
      const questsWithExercisesAndStatus: QuestWithStatus[] = (questsData ?? []).map((quest, index) => {
        let user_status: UIQuestStatus = 'unlocked'

        if (user) {
          const dbStatus = statusByQuestId.get(quest.id)
          if (dbStatus) {
            user_status = dbStatus // 'todo' | 'in_progress' | 'done' | ...
          } else {
            // why: absence de ligne => première déverrouillée pour onboarding, le reste verrouillé
            user_status = index === 0 ? 'unlocked' : 'locked'
          }
        } else {
          // why: pas d’utilisateur => tout visible (ton comportement d’origine)
          user_status = 'unlocked'
        }

        return {
          ...quest,
          exercises: (quest as any).quest_exercises || [],
          user_status,
        }
      })

      // Debug si besoin
      // console.log('Final quests with status:', questsWithExercisesAndStatus)
      setQuests(questsWithExercisesAndStatus)
    } catch (error) {
      console.error('Error loading quests:', error)
      setQuests([])
    } finally {
      setLoading(false)
    }
  }

  // NOTE: conserve ton RPC ; évite la pré-vérif cross-campaign qui peut masquer un besoin d’init.
  const initializeUserQuests = async (campaignIdParam: string) => {
    if (!user) return
    try {
      // why: ce check global peut être trompeur si l’utilisateur a des lignes d’une autre campagne
      // -> on le laisse, mais si tu observes des “non init”, supprime ce check.
      const { data: existingQuests } = await supabase
        .from('user_quests')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (existingQuests && existingQuests.length > 0) return

      await supabase.rpc('initialize_user_quests', {
        p_user_id: user.id,
        p_campaign_id: campaignIdParam,
      })
    } catch (error) {
      console.error('Error initializing user quests:', error)
    }
  }

  // Ces 4 méthodes CRUD sont gardées. Elles ne touchent pas user_quests.
  const completeQuest = async (questId: string) => {
    if (!user) return
    try {
      const { data } = await supabase.rpc('complete_quest', {
        p_user_id: user.id,
        p_quest_id: questId,
      })
      if (data && typeof data === 'object' && 'success' in data) {
        await fetchQuests()
        return data as { success: boolean; xp_gained: number; next_quest_unlocked: boolean }
      }
    } catch (error) {
      console.error('Error completing quest:', error)
    }
  }

  const createQuest = async (questData: Omit<Quest, 'id' | 'created_at'>) => {
   
    const { data, error } = await supabase.from('quests').insert([questData]).select().single()
    if (error) throw error
    return data
  }

  const updateQuest = async (id: string, updates: Partial<Quest>) => {
    const { data, error } = await supabase.from('quests').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  const deleteQuest = async (id: string) => {
    await supabase.from('quest_exercises').delete().eq('quest_id', id)
    const { error } = await supabase.from('quests').delete().eq('id', id)
    if (error) throw error
  }

 // Remplace entièrement la fonction saveQuestExercises par cette version
const saveQuestExercises = async (
  questId: string,
  exercises: Omit<QuestExercise, 'id' | 'quest_id'>[] & Partial<Pick<QuestExercise, 'id' | 'notes'>>[]
) => {
  // 1) Normalisation + réindexation (1..n) pour éviter NaN / nulls foireux
  const normalized = (exercises ?? [])
    .map((ex, idx) => ({
      id: (ex as any).id ?? undefined,            // upsert sur id si présent
      quest_id: questId,
      name: String(ex.name ?? ''),
      target_reps: Number(ex.target_reps ?? 0),
      order_index: Number(ex.order_index ?? idx + 1) || idx + 1,
      notes: (ex as any).notes ? String((ex as any).notes) : null,
    }))
    // filtre les lignes vides
    .filter(ex => ex.name.trim().length > 0)

  // 2) Récupère les IDs existants pour calculer les suppressions
  const { data: existing, error: existingErr } = await supabase
    .from('quest_exercises')
    .select('id')
    .eq('quest_id', questId)

  if (existingErr) throw existingErr

  const existingIds = new Set((existing ?? []).map(r => r.id as string))
  const incomingIds = new Set(normalized.map(r => r.id).filter(Boolean) as string[])

  const toDelete = [...existingIds].filter(id => !incomingIds.has(id))

  // 3) Supprimer celles qui ne sont plus présentes
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase
      .from('quest_exercises')
      .delete()
      .in('id', toDelete)
    if (delErr) throw delErr
  }

  // 4) Upsert le payload (ajoute / met à jour)
  if (normalized.length > 0) {
    const { error: upErr } = await supabase
      .from('quest_exercises')
      .upsert(normalized, {
        onConflict: 'id',          // ⚠️ nécessite PK/unique sur id
        ignoreDuplicates: false,
      })
    if (upErr) throw upErr
  }

  return true
}


  useEffect(() => {
    // why: dépendances pertinentes (user.id suffit pour relancer au login/logout)
    fetchQuests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, campaignSlug, enabled, user?.id])

  return {
    quests,          // QuestWithStatus[] (avec .user_status)
    loading,
    completeQuest,
    refetch: fetchQuests,
    createQuest,
    updateQuest,
    deleteQuest,
    saveQuestExercises,
    initializeUserQuests,
  }
}
