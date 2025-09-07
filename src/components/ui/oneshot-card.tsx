import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OneShotWithFilters, LEVEL_LABELS, EQUIPMENT_LABELS } from '@/types/content';
import { Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OneShotCardProps {
  oneShot: OneShotWithFilters;
}

export function OneShotCard({ oneShot }: OneShotCardProps) {
  const navigate = useNavigate();
  
  const isNew = () => {
    const createdDate = new Date(oneShot.created_at);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    return createdDate > fourteenDaysAgo;
  };

  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case 'simple': return 'Simple';
      case 'for_time': return 'For Time';
      case 'tabata': return 'Tabata';
      case 'amrap': return 'AMRAP';
      case 'emom': return 'EMOM';
      default: return type;
    }
  };

  const handleStart = () => {
    navigate(`/train/${oneShot.id}`);
  };

  return (
    <Card className="border-accent/20 hover:shadow-lg transition-all hover:border-accent/40">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {oneShot.type === 'boss' ? '👑' : '⚡'}
                {oneShot.title}
              </CardTitle>
              {isNew() && (
                <Badge variant="secondary" className="text-xs">
                  Nouveau
                </Badge>
              )}
            </div>
            <CardDescription>{oneShot.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Badges niveau et équipement */}
        <div className="flex flex-wrap gap-2">
          {oneShot.level_required && (
            <Badge variant="outline" className="text-xs">
              {LEVEL_LABELS[oneShot.level_required]}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {getWorkoutTypeLabel(oneShot.workout_type)}
          </Badge>
          {oneShot.equipment_tags?.map((equipment) => (
            <Badge key={equipment} variant="secondary" className="text-xs">
              {EQUIPMENT_LABELS[equipment]}
            </Badge>
          ))}
        </div>

        {/* Informations */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            ~{oneShot.estimated_duration_minutes || 30} min
          </div>
          {oneShot.type === 'boss' && (
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Boss Battle
            </div>
          )}
        </div>

        {/* CTA */}
        <Button 
          onClick={handleStart}
          className="w-full"
          size="sm"
          variant={oneShot.type === 'boss' ? 'default' : 'outline'}
        >
          Lancer
        </Button>
      </CardContent>
    </Card>
  );
}