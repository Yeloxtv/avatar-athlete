export const LEVELS = [
  { value: 'BEGINNER', label: 'Débutant' },
  { value: 'INTERMEDIATE', label: 'Intermédiaire' },
  { value: 'ADVANCED', label: 'Avancé' }
] as const;

export const EQUIPMENT_OPTIONS = [
  { value: 'POIDS_CORPS', label: 'Poids du corps' },
  { value: 'HALTERES', label: 'Haltères' },
  { value: 'BARRE', label: 'Barre' },
  { value: 'KETTLEBELL', label: 'Kettlebell' },
  { value: 'ELASTIQUES', label: 'Élastiques' },
  { value: 'BANC', label: 'Banc' },
  { value: 'CORDE', label: 'Corde à sauter' },
  { value: 'TAPIS', label: 'Tapis de sol' },
] as const;

export const WORKOUT_TYPES = [
  { value: 'simple', label: 'Simple' },
  { value: 'for_time', label: 'For Time' },
  { value: 'tabata', label: 'Tabata' },
  { value: 'amrap', label: 'AMRAP' },
  { value: 'emom', label: 'EMOM' }
] as const;

export const QUEST_TYPES = [
  { value: 'quete', label: 'Normal' },
  { value: 'boss', label: 'Boss' }
] as const;
