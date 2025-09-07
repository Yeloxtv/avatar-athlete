// Types pour le système de filtres et contenu
export type LevelType = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type EquipmentType = 
  | 'SALLE_SPORT' 
  | 'POIDS_CORPS' 
  | 'HALTERES' 
  | 'KETTLEBELL' 
  | 'EXTERIEUR_PARC';

export type SortType = 'RECOMMENDED' | 'NEWEST' | 'DURATION_ASC' | 'DURATION_DESC';

export interface ContentFilters {
  level?: LevelType;
  equipment: EquipmentType[];
  sort: SortType;
}

export interface CampaignWithFilters {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  level_required: LevelType | null;
  equipment_tags: EquipmentType[] | null;
  estimated_duration_weeks: number | null;
  is_published: boolean | null;
  is_active: boolean | null;
  created_at: string;
  quests_count?: number;
}

export interface OneShotWithFilters {
  id: string;
  title: string;
  description: string | null;
  level_required: LevelType | null;
  equipment_tags: EquipmentType[] | null;
  estimated_duration_minutes: number | null;
  is_published: boolean | null;
  is_one_shot: boolean | null;
  created_at: string;
  workout_type: string;
  type: 'quete' | 'boss';
}

// Mapping des niveaux RPG vers les filtres
export const getLevelFromRpgLevel = (rpgLevel: number): LevelType => {
  if (rpgLevel <= 5) return 'BEGINNER';
  if (rpgLevel <= 10) return 'INTERMEDIATE';
  if (rpgLevel <= 15) return 'ADVANCED';
  return 'EXPERT';
};

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  SALLE_SPORT: 'Salle de sport',
  POIDS_CORPS: 'Poids du corps',
  HALTERES: 'Haltères',
  KETTLEBELL: 'Kettlebell',
  EXTERIEUR_PARC: 'Extérieur/Parc'
};

export const LEVEL_LABELS: Record<LevelType, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert'
};

export const SORT_LABELS: Record<SortType, string> = {
  RECOMMENDED: 'Recommandé',
  NEWEST: 'Nouveautés',
  DURATION_ASC: 'Durée ↑',
  DURATION_DESC: 'Durée ↓'
};