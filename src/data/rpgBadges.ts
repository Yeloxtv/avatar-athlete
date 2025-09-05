import { BadgeDef, BossTrigger } from '@/types/rpg'

export const BADGES: Record<string, BadgeDef> = {
  badge_regularity_5: {
    id: "badge_regularity_5",
    label: "Régularité",
    description: "5 séances validées",
    condition: (p) => p.totalXp >= 3000 // ou remplacer par un vrai compteur de séances si dispo
  },
  badge_survivant_hiit: {
    id: "badge_survivant_hiit",
    label: "Survivant 🔥",
    description: "Tu as affronté le HIIT sans flancher",
    condition: (p) => p.level >= 7
  },
  badge_champion_local: {
    id: "badge_champion_local",
    label: "Champion Local",
    description: "Tu as atteint le niveau 10",
    condition: (p) => p.level >= 10
  },
  badge_esprit_equipe: {
    id: "badge_esprit_equipe",
    label: "Esprit d'Équipe",
    description: "Première comparaison en club/amis",
    condition: (p) => p.level >= 15 // MVP: simulé par palier
  },
  badge_hybride_confirme: {
    id: "badge_hybride_confirme",
    label: "Hybride Confirmé",
    description: "Tu as atteint le niveau 20",
    condition: (p) => p.level >= 20
  }
};

export const BOSSES: Record<string, BossTrigger> = {
  boss_cooper: {
    bossId: "boss_cooper",
    bossName: "Gardien de l'Endurance",
    description: "Test Cooper : cours 6 minutes à fond."
  },
  boss_mini_hyrox: {
    bossId: "boss_mini_hyrox",
    bossName: "Gardien de l'Arène",
    description: "Mini-Hyrox (version salle ou maison) : circuit hybride complet."
  }
};