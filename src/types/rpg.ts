// Types de séance (MVP)
export type WorkoutFormat = "AMRAP" | "EMOM" | "TABATA" | "FOR_TIME" | "RUN" | "MIXED";

// Catégorie principale de la séance (dirige la répartition des stats)
export type WorkoutCategory = "STRENGTH" | "ENDURANCE" | "HIIT" | "MOBILITY" | "MIXED";

// Stats RPG
export type StatKey = "force" | "endurance" | "agilite" | "mental";

export interface Stats {
  force: number;
  endurance: number;
  agilite: number;
  mental: number;
}

export interface PlayerProfile {
  id: string;
  level: number;         // 1..∞ (table fournie jusqu'à 20)
  currentXp: number;     // XP sur le niveau en cours
  totalXp: number;       // XP cumulé
  stats: Stats;          // ratings cumulés
  badges: string[];      // ids de badges obtenus
  streakDays: number;    // régularité (jours consécutifs)
  completedBossIds: string[]; // ids de boss vaincus
}

export interface WorkoutSessionInput {
  durationMin: number;           // durée totale de la séance en minutes
  format: WorkoutFormat;
  category: WorkoutCategory;
  dateISO: string;               // pour la régularité
  intensity?: "LOW" | "MEDIUM" | "HIGH"; // bonus facultatif
  dailyQuestBonusXp?: number;
  dailyQuestTitle?: string;
}

export interface RewardResult {
  gainedXpGlobal: number;
  gainedStats: Partial<Stats>;
  newBadges: string[];
  levelUps: LevelUpEvent[];     // peut contenir plusieurs up si gros gain d'XP
  bossUnlocked?: BossTrigger | null;
  dailyQuestCompleted?: {
    title: string;
    bonusXp: number;
  } | null;
  messages: string[];           // toasts immersifs
}

export interface LevelConfig {
  level: number;
  xpToReach: number;            // XP total cumulée requise pour atteindre CE niveau
  title: string;
  levelUpMessage: string;
  milestoneBadgeId?: string;    // badge débloqué au palier (ex: niveaux 5,10,15,20)
  bossId?: string;              // boss à déclencher à ce niveau
}

export interface LevelUpEvent {
  fromLevel: number;
  toLevel: number;
  title: string;
  message: string;
  milestoneBadgeId?: string;
  bossId?: string;
}

export interface BossTrigger {
  bossId: string;
  bossName: string;
  description: string;
}

export interface BadgeDef {
  id: string;
  label: string;
  description: string;
  condition: (p: PlayerProfile) => boolean;
}
