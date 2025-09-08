import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target } from 'lucide-react';
import { getWorkoutTypeLabel, getStatusColor, getStatusLabel } from '@/utils/campaign';

interface Quest {
  id: string;
  title: string;
  description: string;
  workout_type: string;
  type: string;
  user_status?: string;
  equipment_tags?: string[];
  exercises?: { id: string; name: string; target_reps: number; notes?: string }[];
  xp_force?: number;
  xp_endurance?: number;
  xp_agilite?: number;
  xp_mental?: number;
  work_seconds?: number;
  rest_seconds?: number;
  rounds_target?: number;
  total_minutes?: number;
}

interface QuestCardProps {
  quest: Quest;
  index: number;
  status: string;
  onClick: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  index,
  status,
  onClick
}) => {
  const isClickable = status === 'unlocked';

  return (
    <Card
      className={`border transition-all ${
        status === 'done'
          ? 'border-green-500/30 bg-green-500/5'
          : status === 'unlocked'
          ? 'border-accent/30 shadow-lg hover:shadow-xl cursor-pointer'
          : 'border-muted/30 opacity-70'
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">
                {quest.type === 'boss' ? '👑' : '⚔️'}
              </span>
              <span>{quest.title}</span>
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Badge className={getStatusColor(status)}>
                {getStatusLabel(status)}
              </Badge>
              <Badge variant="outline">
                {getWorkoutTypeLabel(quest.workout_type)}
              </Badge>
              {quest.type === 'boss' && (
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  Boss Fight
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            Quête {index + 1}
          </div>
        </div>
        <CardDescription>
          {quest.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Détails workout */}
        <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
          {quest.workout_type === 'tabata' && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {quest.work_seconds}s travail / {quest.rest_seconds}s repos
            </div>
          )}
          {quest.rounds_target && quest.rounds_target > 0 && (
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {quest.rounds_target} tours
            </div>
          )}
          {quest.total_minutes && quest.total_minutes > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {quest.total_minutes} minutes
            </div>
          )}
        </div>

        {/* Équipements */}
        {quest.equipment_tags && quest.equipment_tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Équipements requis</h4>
            <div className="flex gap-2 flex-wrap">
              {quest.equipment_tags.map((equipment, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {equipment}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Exercices */}
        {quest.exercises && quest.exercises.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">
              Exercices ({quest.exercises.length})
            </h4>
            <div className="flex gap-2 flex-wrap">
              {quest.exercises.map((exercise, i) => (
                <Badge key={i} variant="outline">
                  {exercise.name}{" "}
                  {exercise.target_reps > 0 && `(${exercise.target_reps})`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* XP Rewards */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Récompenses XP :</h4>
          <div className="grid grid-cols-2 gap-2">
            {quest.xp_force && quest.xp_force > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <span>💪</span>
                <span className="text-red-500">+{quest.xp_force} Force</span>
              </div>
            )}
            {quest.xp_endurance && quest.xp_endurance > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <span>🏃</span>
                <span className="text-green-500">+{quest.xp_endurance} Endurance</span>
              </div>
            )}
            {quest.xp_agilite && quest.xp_agilite > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <span>⚡</span>
                <span className="text-blue-500">+{quest.xp_agilite} Agilité</span>
              </div>
            )}
            {quest.xp_mental && quest.xp_mental > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <span>🧠</span>
                <span className="text-purple-500">+{quest.xp_mental} Mental</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {status === 'unlocked' && (
          <button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Commencer la quête
          </button>
        )}

        {status === 'done' && (
          <div className="text-center py-2 text-green-500 font-medium">
            ✅ Quête terminée !
          </div>
        )}

        {status === 'locked' && (
          <div className="text-center py-2 text-muted-foreground">
            🔒 Complète la quête précédente pour débloquer
          </div>
        )}
      </CardContent>
    </Card>
  );
};
