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

export interface Exercise {
  id?: string;
  name: string;
  target_reps: number;
  order_index: number;
  notes?: string;
  created_at?: string;
}

export interface Quest {
  id?: string;
  campaign_id: string;
  title: string;
  description: string;
  workout_type: "simple" | "for_time" | "tabata" | "amrap" | "emom";
  type: "quete" | "boss";
  order_index: number;
  work_seconds: number;
  rest_seconds: number;
  rounds_target: number;
  total_minutes: number;
  xp_force: number;
  xp_endurance: number;
  xp_agilite: number;
  xp_mental: number;
  exercises: Exercise[];
  level_required?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  equipment_tags?: string[];
  estimated_duration_minutes?: number;
  is_one_shot?: boolean;
  is_published?: boolean;
}

export type WorkoutType = "simple" | "for_time" | "tabata" | "amrap" | "emom";
export type QuestType = "quete" | "boss";
export type LevelType = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
