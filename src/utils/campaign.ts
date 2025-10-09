export const getWorkoutTypeLabel = (type: string) => {
  switch (type) {
    case 'simple': return 'Simple'
    case 'for_time': return 'For Time'
    case 'tabata': return 'Tabata'
    case 'amrap': return 'AMRAP'
    case 'emom': return 'EMOM'
    default: return type
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30'
    case 'available': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
    case 'locked': return 'bg-muted/20 text-muted-foreground border-muted/30'
    default: return 'bg-muted/20 text-muted-foreground border-muted/30'
  }
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return '✅ Terminée'
    case 'available': return '🎯 Disponible'
    case 'locked': return '🔒 Verrouillée'
    default: return status
  }
}

export const isQuestAvailable = (quest: { user_status?: string }, index: number, quests: { user_status?: string }[]) => {
  // La première quête est toujours disponible
  if (index === 0) return quest.user_status === 'completed' ? 'completed' : 'available'

  // Les autres quêtes sont disponibles si la précédente est complétée
  const previousQuest = quests[index - 1]
  if (previousQuest?.user_status === 'completed') {
    return quest.user_status === 'completed' ? 'completed' : 'available'
  }

  return 'locked'
}
