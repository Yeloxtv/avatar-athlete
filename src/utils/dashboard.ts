import { LEVELS, EQUIPMENT_OPTIONS, WORKOUT_TYPES } from '@/constants/dashboard';

export const getWorkoutTypeLabel = (type: string) => {
  return WORKOUT_TYPES.find(t => t.value === type)?.label || type;
};

export const getLevelLabel = (level: string) => {
  return LEVELS.find(l => l.value === level)?.label || level;
};

export const getEquipmentLabel = (equipment: string) => {
  return EQUIPMENT_OPTIONS.find(e => e.value === equipment)?.label || equipment;
};

export const generateSlug = (title: string, existingSlug?: string) => {
  if (existingSlug?.trim()) return existingSlug;
  
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const generateId = (): string => {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
};

export const calculateTotalXP = (quest: { xp_force?: number; xp_endurance?: number; xp_agilite?: number; xp_mental?: number }) => {
  return (quest.xp_force || 0) + (quest.xp_endurance || 0) + (quest.xp_agilite || 0) + (quest.xp_mental || 0);
};
