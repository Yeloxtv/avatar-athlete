// Données de jeu pour le MVP RPG Hybride

export interface UserProfile {
  id: string
  name: string
  level: number
  xp: number
  xpToNext: number
  stats: {
    force: number
    endurance: number
    agilite: number
    mental: number
  }
}

export interface Quest {
  id: string
  title: string
  description: string
  type: 'quest' | 'boss'
  difficulty: 'facile' | 'moyen' | 'difficile'
  duration: string
  xpReward: number
  statRewards: {
    force?: number
    endurance?: number
    agilite?: number
    mental?: number
  }
  unlockCondition?: string
  completed: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: string
  unlocked: boolean
  unlockedAt?: Date
}

// Profil utilisateur initial
export const initialUserProfile: UserProfile = {
  id: 'kevin',
  name: 'Kevin',
  level: 1,
  xp: 0,
  xpToNext: 100,
  stats: {
    force: 10,
    endurance: 8,
    agilite: 12,
    mental: 15
  }
}

// Parcours "J'aime pas le cardio"
export const cardioAvoidancePath: Quest[] = [
  {
    id: 'q1',
    title: 'Réveil Musculaire',
    description: 'Échauffement dynamique et exercices de base pour réveiller tes muscles en douceur.',
    type: 'quest',
    difficulty: 'facile',
    duration: '15 min',
    xpReward: 50,
    statRewards: { force: 2, mental: 1 },
    completed: false
  },
  {
    id: 'q2', 
    title: 'Force & Coordination',
    description: 'Supersets de musculation légère pour développer force et coordination.',
    type: 'quest',
    difficulty: 'facile',
    duration: '20 min',
    xpReward: 75,
    statRewards: { force: 3, agilite: 2 },
    unlockCondition: 'q1',
    completed: false
  },
  {
    id: 'q3',
    title: 'Circuit Énergique',
    description: 'Mini-circuit qui booste ton énergie sans avoir l\'impression de faire du cardio !',
    type: 'quest',
    difficulty: 'moyen',
    duration: '25 min',
    xpReward: 100,
    statRewards: { endurance: 3, agilite: 2, mental: 1 },
    unlockCondition: 'q2',
    completed: false
  },
  {
    id: 'q4',
    title: 'Puissance Explosive',
    description: 'Développe ta puissance avec des mouvements dynamiques et des pauses actives.',
    type: 'quest',
    difficulty: 'moyen',
    duration: '25 min',
    xpReward: 100,
    statRewards: { force: 2, agilite: 3, mental: 1 },
    unlockCondition: 'q3',
    completed: false
  },
  {
    id: 'q5',
    title: 'Endurance Cachée',
    description: 'Améliore ton endurance par le jeu et les défis, sans courir en rond !',
    type: 'quest',
    difficulty: 'moyen',
    duration: '30 min',
    xpReward: 125,
    statRewards: { endurance: 4, mental: 2 },
    unlockCondition: 'q4',
    completed: false
  },
  {
    id: 'q6',
    title: 'Complexe Guerrier',
    description: 'Enchaînements fluides qui combinent force, agilité et condition physique.',
    type: 'quest',
    difficulty: 'difficile',
    duration: '35 min',
    xpReward: 150,
    statRewards: { force: 3, endurance: 2, agilite: 3, mental: 2 },
    unlockCondition: 'q5',
    completed: false
  },
  {
    id: 'boss1',
    title: 'Boss: Test du Novice',
    description: 'Démontre que tu maîtrises les bases ! Test de force, coordination et mental.',
    type: 'boss',
    difficulty: 'moyen',
    duration: '20 min',
    xpReward: 200,
    statRewards: { force: 5, agilite: 3, mental: 3 },
    unlockCondition: 'q6',
    completed: false
  },
  {
    id: 'boss2',
    title: 'Boss Final: Maître Anti-Cardio',
    description: 'L\'épreuve ultime ! Prouve que tu peux être en forme sans aimer le cardio traditionnel.',
    type: 'boss',
    difficulty: 'difficile',
    duration: '40 min',
    xpReward: 300,
    statRewards: { force: 5, endurance: 5, agilite: 5, mental: 5 },
    unlockCondition: 'boss1',
    completed: false
  }
]

// Badges disponibles
export const availableBadges: Badge[] = [
  {
    id: 'b1',
    name: 'Premier Pas',
    description: 'Commence ton aventure',
    icon: '🚀',
    condition: 'Complete ta première quête',
    unlocked: false
  },
  {
    id: 'b2',
    name: 'Novice Sans Cardio',
    description: 'Termine 3 séances',
    icon: '🎯',
    condition: 'Complete 3 quêtes',
    unlocked: false
  },
  {
    id: 'b3',
    name: 'Force Montante',
    description: 'Atteins 20 en Force',
    icon: '💪',
    condition: 'Force >= 20',
    unlocked: false
  },
  {
    id: 'b4',
    name: 'Tueur de Boss',
    description: 'Vaincs ton premier boss',
    icon: '👑',
    condition: 'Complete un boss battle',
    unlocked: false
  },
  {
    id: 'b5',
    name: 'Légende Anti-Cardio',
    description: 'Termine le parcours complet',
    icon: '🏆',
    condition: 'Complete toutes les quêtes',
    unlocked: false
  },
  {
    id: 'b6',
    name: 'Esprit Fort',
    description: 'Atteins 25 en Mental',
    icon: '🧠',
    condition: 'Mental >= 25',
    unlocked: false
  }
]