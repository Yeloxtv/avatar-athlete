import { useNavigate } from 'react-router-dom'
import { useWorkoutSessionContext } from '@/contexts/WorkoutSessionContext'
import { Dumbbell, ChevronRight } from 'lucide-react'

export default function LiveWorkoutBar() {
  const { liveSession } = useWorkoutSessionContext()
  const navigate = useNavigate()

  if (!liveSession) return null

  const { questId, questTitle, currentExerciseName, currentExerciseIndex, totalExercises, progressPercentage } = liveSession

  return (
    <button
      onClick={() => navigate(`/train/${questId}`)}
      className="fixed bottom-16 left-0 right-0 z-40 mx-3 mb-2"
      aria-label="Reprendre l'entraînement en cours"
    >
      <div className="bg-primary text-primary-foreground rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-primary/30">
        {/* Icône pulsante */}
        <div className="relative shrink-0">
          <Dumbbell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* Infos session */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Live</span>
            <span className="text-xs opacity-60">·</span>
            <span className="text-xs opacity-80 truncate">{questTitle}</span>
          </div>
          <p className="text-sm font-semibold truncate">{currentExerciseName}</p>
        </div>

        {/* Progression + flèche */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs opacity-80">{currentExerciseIndex + 1}/{totalExercises}</span>
          <ChevronRight className="w-4 h-4 opacity-70" />
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mx-1 h-1 bg-primary/20 rounded-b-full overflow-hidden -mt-1">
        <div
          className="h-full bg-green-400 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </button>
  )
}
