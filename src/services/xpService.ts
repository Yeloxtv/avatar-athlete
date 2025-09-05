import { 
  PlayerProfile, 
  WorkoutSessionInput, 
  RewardResult, 
  LevelUpEvent, 
  WorkoutCategory, 
  Stats 
} from '@/types/rpg'
import { LEVELS } from '@/data/rpgLevels'
import { BADGES, BOSSES } from '@/data/rpgBadges'

export class XpService {
  static computeSessionRewards(player: PlayerProfile, input: WorkoutSessionInput): RewardResult {
    // 1) Calcul XP globale
    const base = 100 + 5 * input.durationMin;
    const intensityBonus =
      input.intensity === "HIGH" ? 0.2 : input.intensity === "MEDIUM" ? 0.1 : 0;
    const gainedXpGlobal = Math.round(base * (1 + intensityBonus));

    // 2) Répartition stats
    const dist = XpService.getDistribution(input.category);
    const conv = 0.1; // XP -> points stats
    const gainedStats: Partial<Stats> = {
      force: Math.round(gainedXpGlobal * dist.force * conv),
      endurance: Math.round(gainedXpGlobal * dist.endurance * conv),
      agilite: Math.round(gainedXpGlobal * dist.agilite * conv),
      mental: Math.round(gainedXpGlobal * dist.mental * conv),
    };

    // 3) Appliquer au profil (sans muter l'input)
    const updated = XpService.applyRewards(player, gainedXpGlobal, gainedStats);

    // 4) Détecter level-ups, badges, boss
    const levelUps = XpService.detectLevelUps(player, updated);
    const newBadges = XpService.detectBadges(player, updated);
    const bossUnlocked = XpService.detectBossTrigger(player, updated, levelUps);

    // 5) Messages immersifs
    const messages = XpService.buildMessages(gainedXpGlobal, gainedStats, levelUps, newBadges, bossUnlocked);

    // 6) Retour du résultat
    return { gainedXpGlobal, gainedStats, newBadges, levelUps, bossUnlocked, messages };
  }

  static getDistribution(category: WorkoutCategory) {
    switch (category) {
      case "STRENGTH":   return { force: 0.7, endurance: 0.1, agilite: 0.1, mental: 0.1 };
      case "ENDURANCE":  return { force: 0.1, endurance: 0.7, agilite: 0.1, mental: 0.1 };
      case "HIIT":       return { force: 0.2, endurance: 0.4, agilite: 0.3, mental: 0.1 };
      case "MOBILITY":   return { force: 0.1, endurance: 0.1, agilite: 0.5, mental: 0.3 };
      case "MIXED":      return { force: 0.3, endurance: 0.3, agilite: 0.25, mental: 0.15 };
      default:           return { force: 0.25, endurance: 0.25, agilite: 0.25, mental: 0.25 };
    }
  }

  static applyRewards(player: PlayerProfile, xp: number, addStats: Partial<Stats>): PlayerProfile {
    const p = { ...player, stats: { ...player.stats } };
    p.totalXp += xp;
    p.currentXp += xp;
    p.stats.force    += addStats.force    ?? 0;
    p.stats.endurance+= addStats.endurance?? 0;
    p.stats.agilite  += addStats.agilite  ?? 0;
    p.stats.mental   += addStats.mental   ?? 0;
    // gérer streakDays en dehors (via dateISO) si besoin
    return p;
  }

  static detectLevelUps(before: PlayerProfile, after: PlayerProfile): LevelUpEvent[] {
    const events: LevelUpEvent[] = [];
    const prevLevel = before.level;
    const newTotal  = after.totalXp;

    // Trouver le niveau correspondant au newTotal
    const targetLevel = LEVELS.reduce((acc, l) => (newTotal >= l.xpToReach ? l.level : acc), 1);

    if (targetLevel > prevLevel) {
      for (let lv = prevLevel + 1; lv <= targetLevel; lv++) {
        const cfg = LEVELS.find(l => l.level === lv)!;
        events.push({
          fromLevel: lv - 1,
          toLevel: lv,
          title: cfg.title,
          message: cfg.levelUpMessage,
          milestoneBadgeId: cfg.milestoneBadgeId,
          bossId: cfg.bossId
        });
      }
      after.level = targetLevel;
      // recalcul de currentXp relatif au niveau
      const currentLevelConfig = LEVELS.find(l => l.level === targetLevel);
      if (currentLevelConfig) {
        after.currentXp = newTotal - currentLevelConfig.xpToReach;
      }
    }
    return events;
  }

  static detectBadges(before: PlayerProfile, after: PlayerProfile): string[] {
    const newly: string[] = [];
    Object.values(BADGES).forEach(b => {
      const had = before.badges.includes(b.id);
      const now = after.badges.includes(b.id) || b.condition(after);
      if (!had && now) {
        newly.push(b.id);
        after.badges = Array.from(new Set([...after.badges, b.id]));
      }
    });
    return newly;
  }

  static detectBossTrigger(before: PlayerProfile, after: PlayerProfile, levelUps: LevelUpEvent[]) {
    const latest = levelUps[levelUps.length - 1];
    if (!latest?.bossId) return null;
    return BOSSES[latest.bossId] ?? null;
  }

  static buildMessages(xp: number, stats: Partial<Stats>, ups: LevelUpEvent[], newBadges: string[], boss?: any): string[] {
    const msgs: string[] = [];
    msgs.push(`+${xp} XP gagnés !`);
    if (stats.force)    msgs.push(`Ta Force augmente de +${stats.force}.`);
    if (stats.endurance)msgs.push(`Ton Endurance augmente de +${stats.endurance}.`);
    if (stats.agilite)  msgs.push(`Ton Agilité augmente de +${stats.agilite}.`);
    if (stats.mental)   msgs.push(`Ton Mental augmente de +${stats.mental}.`);

    ups.forEach(u => msgs.push(`Niveau ${u.toLevel} atteint — ${u.title} ! ${u.message}`));
    newBadges.forEach(id => msgs.push(`Badge débloqué : ${BADGES[id].label} — ${BADGES[id].description}`));
    if (boss) msgs.push(`Boss débloqué : ${boss.bossName} — ${boss.description}`);
    return msgs;
  }

  // Utilitaires pour calculer les niveaux
  static calculateLevelFromXp(totalXp: number): number {
    return LEVELS.reduce((acc, l) => (totalXp >= l.xpToReach ? l.level : acc), 1);
  }

  static getXpForNextLevel(currentLevel: number): number {
    const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
    return nextLevel ? nextLevel.xpToReach : LEVELS[LEVELS.length - 1].xpToReach;
  }

  static getCurrentLevelXp(currentLevel: number): number {
    const levelConfig = LEVELS.find(l => l.level === currentLevel);
    return levelConfig ? levelConfig.xpToReach : 0;
  }

  static getLevelTitle(level: number): string {
    const levelConfig = LEVELS.find(l => l.level === level);
    return levelConfig ? levelConfig.title : "Apprenti Éveillé";
  }

  // Convertir un profil Supabase en PlayerProfile RPG
  static profileToPlayerProfile(profile: any): PlayerProfile {
    return {
      id: profile.user_id,
      level: XpService.calculateLevelFromXp(profile.xp_total || 0),
      currentXp: profile.xp_total || 0,
      totalXp: profile.xp_total || 0,
      stats: {
        force: profile.stat_force || 0,
        endurance: profile.stat_endurance || 0,
        agilite: profile.stat_agilite || 0,
        mental: profile.stat_mental || 0,
      },
      badges: [], // À récupérer séparément
      streakDays: 0, // À implémenter
      completedBossIds: [], // À implémenter
    };
  }

  // Mapping des types d'entraînement de l'app vers les catégories RPG
  static getWorkoutCategory(workoutType: string): WorkoutCategory {
    switch (workoutType?.toLowerCase()) {
      case 'strength':
      case 'force':
        return 'STRENGTH';
      case 'endurance':
      case 'cardio':
        return 'ENDURANCE';
      case 'hiit':
      case 'tabata':
        return 'HIIT';
      case 'mobility':
      case 'yoga':
      case 'stretching':
        return 'MOBILITY';
      default:
        return 'MIXED';
    }
  }

  static getWorkoutFormat(workoutType: string): any {
    switch (workoutType?.toLowerCase()) {
      case 'amrap':
        return 'AMRAP';
      case 'emom':
        return 'EMOM';
      case 'tabata':
        return 'TABATA';
      case 'for_time':
        return 'FOR_TIME';
      default:
        return 'MIXED';
    }
  }
}