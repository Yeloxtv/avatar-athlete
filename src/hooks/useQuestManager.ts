import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Quest, Exercise } from '@/types/dashboard';
import { calculateTotalXP } from '@/utils/dashboard';

export const useQuestManager = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuests = async (campaignId: string) => {
    setLoading(true);
    try {
      const { data: questsData, error: questsError } = await supabase
        .from('quests')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('order_index');

      if (questsError) throw questsError;

      // Récupérer les exercices pour chaque quête
      const questsWithExercises = await Promise.all(
        (questsData || []).map(async (quest) => {
          const { data: exercises, error: exError } = await supabase
            .from('quest_exercises')
            .select('*')
            .eq('quest_id', quest.id)
            .order('order_index');

          if (exError) {
            console.error('Erreur exercises:', exError);
          }

          return {
            ...quest,
            equipment_tags: quest.equipment_tags || [],
            exercises: exercises || [],
            workout_type: quest.workout_type as Quest['workout_type'],
            type: quest.type as Quest['type'],
            level_required: quest.level_required as Quest['level_required']
          };
        })
      );

      setQuests(questsWithExercises);
    } catch (error) {
      console.error('Error fetching quests:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const syncQuestExercises = async (questId: string, exercises: Exercise[]) => {
    // Normalise + réindexe (1..n), évite NaN/undefined
    const normalized = (exercises || [])
      .map((ex, idx) => ({
        id: ex.id, // conserve id si existant (pour update)
        quest_id: questId,
        name: String(ex.name ?? '').trim(),
        target_reps: Number(ex.target_reps ?? 0),
        order_index: Number(ex.order_index ?? idx + 1) || idx + 1,
        notes: (ex.notes?.trim?.() ? ex.notes : null) as string | null,
      }))
      .filter(ex => ex.name.length > 0); // on ignore les lignes vides

    // Récupère les IDs existants pour calculer les suppressions
    const { data: existing, error: existingErr } = await supabase
      .from('quest_exercises')
      .select('id')
      .eq('quest_id', questId);
    if (existingErr) throw existingErr;

    const existingIds = new Set((existing ?? []).map(r => r.id as string));
    const incomingIds = new Set(normalized.map(r => r.id).filter(Boolean) as string[]);
    const toDelete = [...existingIds].filter(id => !incomingIds.has(id));

    // Supprime celles retirées de l'UI
    if (toDelete.length > 0) {
      const { error: delErr } = await supabase
        .from('quest_exercises')
        .delete()
        .in('id', toDelete);
      if (delErr) throw delErr;
    }

    // Upsert le reste (insert/update)
    if (normalized.length > 0) {
      const { error: upErr } = await supabase
        .from('quest_exercises')
        .upsert(normalized, { onConflict: 'id', ignoreDuplicates: false });
      if (upErr) throw upErr;
    }
  };

  const saveQuest = async (quest: Quest, isCreating: boolean, campaignId: string) => {
    if (!quest.title?.trim()) {
      throw new Error("Le titre de la quête est requis");
    }
    if (!campaignId) {
      throw new Error("Aucune campagne sélectionnée");
    }

    const xp_total = calculateTotalXP(quest);

    const baseQuestPayload = {
      campaign_id: campaignId,
      order_index: Number(quest.order_index) || 1,
      title: quest.title,
      description: quest.description || "",
      type: quest.type || "quete",

      xp_force: Number(quest.xp_force) || 0,
      xp_endurance: Number(quest.xp_endurance) || 0,
      xp_agilite: Number(quest.xp_agilite) || 0,
      xp_mental: Number(quest.xp_mental) || 0,
      xp_total,

      workout_type: quest.workout_type || "simple",
      work_seconds: Number(quest.work_seconds) || 0,
      rest_seconds: Number(quest.rest_seconds) || 0,
      rounds_target: Number(quest.rounds_target) || 0,
      total_minutes: Number(quest.total_minutes) || 0,

      level_required: quest.level_required || 'BEGINNER',
      equipment_tags: quest.equipment_tags || [],
      estimated_duration_minutes: quest.estimated_duration_minutes || 30,
      is_one_shot: Boolean(quest.is_one_shot),
      is_published: Boolean(quest.is_published),
      day_of_week: quest.day_of_week ?? null,
    };

    const exercises = quest.exercises || [];

    try {
      if (isCreating) {
        // CREATE quest
        const { data: created, error } = await supabase
          .from("quests")
          .insert([baseQuestPayload])
          .select()
          .single();
        if (error) throw error;

        // CREATE exercises (si présents)
        if (exercises.length) {
          const toInsert = exercises.map((ex, idx) => ({
            quest_id: created.id,
            order_index: Number(ex.order_index) || idx + 1,
            name: ex.name || "",
            target_reps: Number(ex.target_reps) || 0,
            notes: ex.notes?.trim?.() ? ex.notes : null,
          }));
          const { error: exErr } = await supabase.from("quest_exercises").insert(toInsert);
          if (exErr) throw exErr;
        }
      } else {
        // UPDATE quest
        const { error } = await supabase
          .from("quests")
          .update(baseQuestPayload)
          .eq("id", quest.id);
        if (error) throw error;

        // UPSERT + DELETE exercises (synchro complète)
        await syncQuestExercises(quest.id!, exercises);
      }

      await fetchQuests(campaignId);
    } catch (error) {
      console.error('[saveQuest]', error);
      throw error;
    }
  };

  const deleteQuest = async (questId: string, campaignId: string) => {
    try {
      await supabase.from("quest_exercises").delete().eq("quest_id", questId);
      const { error } = await supabase.from("quests").delete().eq("id", questId);
      if (error) throw error;
      await fetchQuests(campaignId);
    } catch (error) {
      console.error('[deleteQuest]', error);
      throw error;
    }
  };

  return {
    quests,
    loading,
    fetchQuests,
    saveQuest,
    deleteQuest,
    syncQuestExercises
  };
};
