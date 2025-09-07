import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  LevelType, 
  EquipmentType, 
  SortType, 
  LEVEL_LABELS, 
  EQUIPMENT_LABELS, 
  SORT_LABELS 
} from '@/types/content';
import { Sparkles, RotateCcw } from 'lucide-react';

interface ContentFiltersProps {
  level?: LevelType;
  equipment: EquipmentType[];
  sort: SortType;
  onLevelChange: (level: LevelType | undefined) => void;
  onEquipmentChange: (equipment: EquipmentType[]) => void;
  onSortChange: (sort: SortType) => void;
  onSuggestForMe: () => void;
  onReset: () => void;
}

export function ContentFilters({
  level,
  equipment,
  sort,
  onLevelChange,
  onEquipmentChange,
  onSortChange,
  onSuggestForMe,
  onReset
}: ContentFiltersProps) {
  
  const toggleEquipment = (equipmentType: EquipmentType) => {
    if (equipment.includes(equipmentType)) {
      onEquipmentChange(equipment.filter(e => e !== equipmentType));
    } else {
      onEquipmentChange([...equipment, equipmentType]);
    }
  };

  return (
    <Card className="border-accent/20">
      <CardContent className="p-4 space-y-4">
        {/* Actions rapides */}
        <div className="flex gap-2 justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSuggestForMe}
            className="text-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Suggérer pour moi
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Niveau */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Niveau</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(LEVEL_LABELS).map(([key, label]) => (
                <Button
                  key={key}
                  variant={level === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => onLevelChange(level === key ? undefined : key as LevelType)}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Équipement */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Équipement</label>
            <div className="flex flex-wrap gap-1">
              {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => (
                <Badge
                  key={key}
                  variant={equipment.includes(key as EquipmentType) ? "default" : "outline"}
                  className="cursor-pointer text-xs hover:bg-accent"
                  onClick={() => toggleEquipment(key as EquipmentType)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tri */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trier par</label>
            <Select value={sort} onValueChange={(value) => onSortChange(value as SortType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}