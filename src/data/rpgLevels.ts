import { LevelConfig } from '@/types/rpg'

export const LEVELS: LevelConfig[] = [
  { level: 1,  xpToReach: 0,     title: "Apprenti Éveillé",      levelUpMessage: "Tu te lances dans l'aventure. Un pas de plus vers ta légende." },
  { level: 2,  xpToReach: 300,   title: "Novice du Fer",         levelUpMessage: "Ton corps s'habitue. Tu gagnes +10 Force." },
  { level: 3,  xpToReach: 700,   title: "Coureur d'Aube",        levelUpMessage: "Ton souffle s'éveille. +10 Endurance !" },
  { level: 4,  xpToReach: 1500,  title: "Disciple Agile",        levelUpMessage: "Tes mouvements deviennent plus fluides. +10 Agilité." },
  { level: 5,  xpToReach: 3000,  title: "Guerrier en Devenir",   levelUpMessage: "Tu as prouvé ta régularité. Tu gagnes +15 Mental.", milestoneBadgeId: "badge_regularity_5" },
  { level: 6,  xpToReach: 5000,  title: "Voyageur Persévérant",  levelUpMessage: "Ton chemin s'allonge, mais ta volonté grandit." },
  { level: 7,  xpToReach: 7500,  title: "Survivant du HIIT",     levelUpMessage: "Tu as dompté l'intensité. +20 Endurance !", milestoneBadgeId: "badge_survivant_hiit" },
  { level: 8,  xpToReach: 10500, title: "Forgeron du Corps",     levelUpMessage: "Chaque effort sculpte ton avatar. +20 Force !" },
  { level: 9,  xpToReach: 14000, title: "Maître de la Discipline", levelUpMessage: "Ton Mental devient ton arme la plus forte." },
  { level:10,  xpToReach: 18000, title: "Champion Local",        levelUpMessage: "Tu franchis un cap. Prépare-toi à affronter ton premier Boss !", milestoneBadgeId: "badge_champion_local", bossId: "boss_cooper" },
  { level:11,  xpToReach: 22500, title: "Explorateur Endurant",  levelUpMessage: "Tes pas résonnent plus loin. +25 Endurance !" },
  { level:12,  xpToReach: 27500, title: "Gladiateur Agile",      levelUpMessage: "Ton agilité fait de toi un adversaire redoutable." },
  { level:13,  xpToReach: 33000, title: "Sentinelle de Fer",     levelUpMessage: "Ta force inspire le respect." },
  { level:14,  xpToReach: 39000, title: "Adepte de l'Hybride",   levelUpMessage: "Tu commences à unir force et endurance." },
  { level:15,  xpToReach: 45500, title: "Guerrier du Clan",      levelUpMessage: "Tu gagnes en influence. Tes pairs reconnaissent tes progrès.", milestoneBadgeId: "badge_esprit_equipe" },
  { level:16,  xpToReach: 52500, title: "Maître des Quêtes",     levelUpMessage: "Aucune mission ne t'arrête. +30 Mental !" },
  { level:17,  xpToReach: 60000, title: "Héros en Devenir",      levelUpMessage: "Ton parcours inspire les autres." },
  { level:18,  xpToReach: 68000, title: "Combattant Hybride",    levelUpMessage: "Force et Endurance atteignent l'équilibre." },
  { level:19,  xpToReach: 76500, title: "Vétéran de l'Arène",    levelUpMessage: "Ton Mental ne flanche plus. Tu es prêt pour l'épreuve." },
  { level:20,  xpToReach: 85500, title: "Hybride Confirmé",      levelUpMessage: "Tu deviens une légende locale. Affronte le Gardien de l'Arène !", milestoneBadgeId: "badge_hybride_confirme", bossId: "boss_mini_hyrox" },
];