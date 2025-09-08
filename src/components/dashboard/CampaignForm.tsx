import React from 'react';
import { Campaign } from '@/types/dashboard';
import { LEVELS, EQUIPMENT_OPTIONS } from '@/constants/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Settings, Filter } from 'lucide-react';

interface CampaignFormProps {
  campaign: Campaign;
  isCreating: boolean;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updates: Partial<Campaign>) => void;
  onEquipmentToggle: (equipment: string) => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  campaign,
  isCreating,
  loading,
  onSave,
  onCancel,
  onChange,
  onEquipmentToggle
}) => {
  return (
    <Card className="border-accent">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {isCreating ? "Créer une nouvelle campagne" : "Modifier la campagne"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informations de base */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Informations générales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nom de la campagne *</Label>
              <Input
                id="campaign-name"
                value={campaign.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Ex: Programme débutant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-slug">Slug (URL)</Label>
              <Input
                id="campaign-slug"
                value={campaign.slug}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="programme-debutant (auto-généré si vide)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-description">Description</Label>
            <Textarea
              id="campaign-description"
              value={campaign.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Description de la campagne"
              rows={3}
            />
          </div>
        </div>

        {/* Filtres de ciblage */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Paramètres de ciblage
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Niveau requis</Label>
              <Select
                value={campaign.level_required}
                onValueChange={(value) => onChange({ level_required: value as Campaign['level_required'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Durée estimée (semaines)</Label>
              <Input
                type="number"
                value={campaign.estimated_duration_weeks}
                onChange={(e) => onChange({ estimated_duration_weeks: parseInt(e.target.value) || 4 })}
                placeholder="4"
              />
            </div>

            <div className="flex items-center space-x-2 pt-7">
              <input
                type="checkbox"
                id="campaign-active"
                checked={campaign.is_active}
                onChange={(e) => onChange({ is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="campaign-active">Campagne active</Label>
            </div>
          </div>

          {/* Équipements requis */}
          <div className="space-y-3">
            <Label>Équipements requis</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <div key={equipment.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`equipment-${equipment.value}`}
                    checked={campaign.equipment_tags?.includes(equipment.value)}
                    onChange={() => onEquipmentToggle(equipment.value)}
                    className="rounded"
                  />
                  <Label 
                    htmlFor={`equipment-${equipment.value}`}
                    className="text-sm"
                  >
                    {equipment.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Les utilisateurs devront avoir au moins un de ces équipements
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
