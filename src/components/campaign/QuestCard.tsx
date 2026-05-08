import { Lock, CheckCircle2, ChevronRight, Swords, Crown, Clock, Zap, RotateCcw } from 'lucide-react'
import { getWorkoutTypeLabel } from '@/utils/campaign'

interface Quest {
  id: string
  title: string
  description: string
  workout_type: string
  type: string
  user_status?: string
  equipment_tags?: string[]
  exercises?: { id: string; name: string; target_reps: number; notes?: string }[]
  xp_force?: number
  xp_endurance?: number
  xp_agilite?: number
  xp_mental?: number
  work_seconds?: number
  rest_seconds?: number
  rounds_target?: number
  total_minutes?: number
}

interface QuestCardProps {
  quest: Quest
  index: number
  status: string
  onClick: () => void
}

const XP_STATS = [
  { key: 'xp_force',     label: 'Force',     color: 'text-stats-force' },
  { key: 'xp_endurance', label: 'End.',       color: 'text-stats-endurance' },
  { key: 'xp_agilite',   label: 'Agi.',       color: 'text-stats-agilite' },
  { key: 'xp_mental',    label: 'Mental',     color: 'text-stats-mental' },
] as const

function formatDuration(quest: Quest): string | null {
  if (quest.total_minutes && quest.total_minutes > 0) return `${quest.total_minutes} min`
  if (quest.workout_type === 'tabata' && quest.work_seconds) {
    return `${quest.work_seconds}s / ${quest.rest_seconds ?? 10}s`
  }
  return null
}

export function QuestCard({ quest, index, status, onClick }: QuestCardProps) {
  const isBoss     = quest.type === 'boss'
  const isAvailable = status === 'available'
  const isCompleted = status === 'completed'
  const isLocked    = status === 'locked'

  const totalXp = (quest.xp_force || 0) + (quest.xp_endurance || 0) + (quest.xp_agilite || 0) + (quest.xp_mental || 0)
  const duration = formatDuration(quest)
  const exerciseCount = quest.exercises?.length ?? 0

  return (
    <div
      className={[
        'relative rounded-2xl border transition-all duration-200 overflow-hidden',
        isBoss && isAvailable
          ? 'border-yellow-400/50 bg-yellow-400/5 shadow-lg shadow-yellow-400/10 cursor-pointer hover:border-yellow-400/80'
          : isBoss && isCompleted
          ? 'border-yellow-400/20 bg-yellow-400/5'
          : isCompleted
          ? 'border-green-500/20 bg-green-500/5'
          : isAvailable
          ? 'border-accent/40 bg-accent/5 shadow-md cursor-pointer hover:border-accent/70 hover:shadow-lg'
          : 'border-muted/20 bg-muted/5 opacity-60',
      ].join(' ')}
      onClick={isAvailable ? onClick : undefined}
    >
      {/* Barre top colorée */}
      <div className={[
        'absolute top-0 left-0 right-0 h-0.5',
        isBoss      ? 'bg-gradient-to-r from-yellow-400/60 via-yellow-400 to-yellow-400/60' :
        isCompleted ? 'bg-gradient-to-r from-green-500/40 via-green-500 to-green-500/40' :
        isAvailable ? 'bg-gradient-to-r from-accent/40 via-accent to-accent/40' :
                      'bg-muted/30',
      ].join(' ')} />

      <div className="p-4 space-y-3">

        {/* Header ligne 1 : numéro + icône + titre + statut */}
        <div className="flex items-start gap-3">
          {/* Icône statut */}
          <div className={[
            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
            isBoss && isAvailable ? 'bg-yellow-400/20 border border-yellow-400/40' :
            isBoss               ? 'bg-yellow-400/10 border border-yellow-400/20' :
            isCompleted          ? 'bg-green-500/15 border border-green-500/20' :
            isAvailable          ? 'bg-accent/15 border border-accent/20' :
                                   'bg-muted/20 border border-muted/20',
          ].join(' ')}>
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : isLocked ? (
              <Lock className="w-4 h-4 text-muted-foreground" />
            ) : isBoss ? (
              <Crown className="w-4 h-4 text-yellow-400" />
            ) : (
              <Swords className="w-4 h-4 text-accent" />
            )}
          </div>

          {/* Titre + description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={[
                'text-[10px] font-black uppercase tracking-widest',
                isBoss ? 'text-yellow-400/70' : 'text-muted-foreground',
              ].join(' ')}>
                {isBoss ? 'Boss' : `Quête ${index + 1}`}
              </span>
              {isBoss && isAvailable && (
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 animate-pulse">
                  ⚠️ Épreuve spéciale
                </span>
              )}
            </div>
            <h3 className={[
              'font-black text-base leading-tight mt-0.5',
              isBoss ? 'text-yellow-400' : '',
            ].join(' ')}>
              {quest.title}
            </h3>
            {quest.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
                "{quest.description}"
              </p>
            )}
          </div>

          {/* Chevron ou check */}
          {isAvailable && (
            <ChevronRight className={[
              'w-5 h-5 shrink-0 mt-1',
              isBoss ? 'text-yellow-400' : 'text-accent',
            ].join(' ')} />
          )}
        </div>

        {/* Metadata : type + durée + exercices */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={[
            'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border',
            isBoss
              ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'
              : 'bg-muted/30 text-muted-foreground border-muted/30',
          ].join(' ')}>
            {getWorkoutTypeLabel(quest.workout_type)}
          </span>

          {duration && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />{duration}
            </span>
          )}

          {exerciseCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <RotateCcw className="w-3 h-3" />{exerciseCount} exercices
            </span>
          )}

          {quest.rounds_target && quest.rounds_target > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {quest.rounds_target} rounds
            </span>
          )}
        </div>

        {/* XP Rewards — seulement si disponible ou complété */}
        {!isLocked && totalXp > 0 && (
          <div className="flex items-center gap-3 pt-1 border-t border-muted/10">
            <div className="flex items-center gap-1 text-xs font-bold text-accent">
              <Zap className="w-3 h-3" />
              +{totalXp} XP
            </div>
            <div className="flex gap-2">
              {XP_STATS.map(({ key, label, color }) => {
                const val = (quest as any)[key] || 0
                if (!val) return null
                return (
                  <span key={key} className={`text-[10px] font-semibold ${color}`}>
                    +{val} {label}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA boss */}
        {isBoss && isAvailable && (
          <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-xs text-yellow-400 font-semibold text-center">
            ⚔️ Tu es prêt ? Affronte le Boss
          </div>
        )}

        {/* Quête verrouillée */}
        {isLocked && (
          <p className="text-[10px] text-muted-foreground/60 text-center pt-1">
            Complète la quête précédente pour débloquer
          </p>
        )}
      </div>
    </div>
  )
}
