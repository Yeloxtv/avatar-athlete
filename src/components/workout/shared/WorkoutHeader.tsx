import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'

interface WorkoutHeaderProps {
  quest: {
    id: string
    title: string
    workout_type: string
    type?: string
    total_minutes?: number
  }
  onBack: () => void
  showLevelDisplay?: boolean
}

export default function WorkoutHeader({ quest, onBack }: WorkoutHeaderProps) {
  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case 'simple': return 'Simple'
      case 'for_time': return 'For Time'
      case 'tabata': return 'Tabata'
      case 'amrap': return 'AMRAP'
      case 'emom': return 'EMOM'
      case 'strength': return 'Musculation'
      default: return type
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="flex-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>{quest.type === 'boss' ? '👑' : quest.workout_type === 'strength' ? '🏋️' : '⚔️'}</span>
          {quest.title}
        </h1>
        <div className="flex gap-2 mt-1">
          <Badge variant="outline">{getWorkoutTypeLabel(quest.workout_type)}</Badge>
          {quest.type === 'boss' && (
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Boss Fight</Badge>
          )}
        </div>
      </div>
    </div>
  )
}