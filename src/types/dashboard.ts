export interface Campaign {
  id?: string;
  title: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  quests_count?: number;
  level_required?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  equipment_tags?: string[];
  estimated_duration_weeks?: number;
}

// ✅ Interface Exercise étendue pour la musculation
export interface Exercise {
  id?: string;
  name: string;
  target_reps: number;
  order_index: number;
  notes?: string;
  created_at?: string;
  // 🏋️ Nouveaux champs pour musculation
  sets_count?: number;        // Nombre de séries pour cet exercice
  target_weight?: number;     // Poids cible en kg
  rest_seconds?: number;      // Repos spécifique à l'exercice
}

// ✅ Interface Quest étendue
export interface Quest {
  id?: string;
  campaign_id: string;
  title: string;
  description: string;
  workout_type: "simple" | "for_time" | "tabata" | "amrap" | "emom" | "strength"; // ← Ajout "strength"
  type: "quete" | "boss";
  order_index: number;
  
  // 🏃 Champs HIIT (optionnels pour musculation)
  work_seconds?: number;      // ← Maintenant optionnel
  rest_seconds?: number;      // ← Repos global (optionnel)
  rounds_target?: number;     // ← Optionnel pour musculation
  total_minutes?: number;     // ← Optionnel
  
  // 🎯 Champs XP (obligatoires)
  xp_force: number;
  xp_endurance: number;
  xp_agilite: number;
  xp_mental: number;
  
  // 📋 Exercices et métadonnées
  exercises: Exercise[];
  level_required?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  equipment_tags?: string[];
  estimated_duration_minutes?: number;
  is_one_shot?: boolean;
  is_published?: boolean;
  
  // 🏋️ Nouveaux champs spécifiques musculation
  sets_count?: number;        // Nombre de séries par défaut
}

// ✅ Types étendus
export type WorkoutType = "simple" | "for_time" | "tabata" | "amrap" | "emom" | "strength"; // ← Ajout "strength"
export type QuestType = "quete" | "boss";
export type LevelType = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// 🏋️ Nouveaux types pour la musculation
export interface StrengthQuestConfig {
  defaultSets: number;
  defaultRestSeconds: number;
  allowCustomWeights: boolean;
}

// 🎯 Type guards pour différencier les types d'entraînement
export const isStrengthWorkout = (quest: Quest): boolean => {
  return quest.workout_type === 'strength';
}

export const isHIITWorkout = (quest: Quest): boolean => {
  return ['simple', 'for_time', 'tabata', 'amrap', 'emom'].includes(quest.workout_type);
}
