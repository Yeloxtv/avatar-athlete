import React from 'react';
import { Quest, Exercise } from '@/types/dashboard';
import { LEVELS, EQUIPMENT_OPTIONS, WORKOUT_TYPES, QUEST_TYPES } from '@/constants/dashboard';
import { generateId } from '@/utils/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, X, Clock, Filter } from 'lucide-react';

interface QuestFormProps {
  quest: Quest;
  isCreating: boolean;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (quest: Quest | ((prev: Quest) => Quest)) => void;
  onEquipmentToggle: (equipment: string) => void;
  onAddExercise: () => void;
  onRemoveExercise: (index: number) => void;
  onExerciseChange: (index: number, field: keyof Exercise, value: string | number) => void;
}

export const QuestForm: React.FC<QuestFormProps> = ({
  quest,
  isCreating,
  loading,
  onSave,
  onCancel,
  onChange,
  onEquipmentToggle,
  onAddExercise,
  onRemoveExercise,
  onExerciseChange
}) => {
  return (
    <Card className="border-accent">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {isCreating ? "Créer une nouvelle quête" : "Modifier la quête"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informations de base */}
        <div className="space-y-4">
          <h3 className="font-semibold">Informations générales</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titre de la quête *</Label>
              <Input
                value={quest.title}
                onChange={(e) => onChange((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Cardio de l'enfer"
              />
            </div>

            <div className="space-y-2">
              <Label>Type de workout</Label>
              <Select
                value={quest.workout_type}
                onValueChange={(value) => onChange((prev) => ({ ...prev, workout_type: value as Quest['workout_type'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORKOUT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type de quête</Label>
              <Select
                value={quest.type}
                onValueChange={(value) => onChange((prev) => ({ ...prev, type: value as Quest['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUEST_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ordre d'affichage</Label>
              <Input
                type="number"
                value={quest.order_index}
                onChange={(e) => onChange((prev) => ({ ...prev, order_index: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={quest.description}
              onChange={(e) => onChange((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la quête"
              rows={3}
            />
          </div>
        </div>

        {/* Filtres de ciblage pour les quêtes */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Paramètres de ciblage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Niveau requis</Label>
              <Select
                value={quest.level_required}
                onValueChange={(value) => onChange((prev) => ({ ...prev, level_required: value as Quest['level_required'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Durée estimée (minutes)</Label>
              <Input
                type="number"
                value={quest.estimated_duration_minutes}
                onChange={(e) => onChange((prev) => ({ ...prev, estimated_duration_minutes: parseInt(e.target.value) || 30 }))}
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="quest-oneshot"
                  checked={quest.is_one_shot}
                  onChange={(e) => onChange((prev) => ({ ...prev, is_one_shot: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="quest-oneshot" className="text-sm">One-shot</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="quest-published"
                  checked={quest.is_published}
                  onChange={(e) => onChange((prev) => ({ ...prev, is_published: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="quest-published" className="text-sm">Publié</Label>
              </div>
            </div>
          </div>

          {/* Équipements requis pour les quêtes */}
          <div className="space-y-3">
            <Label>Équipements requis</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <div key={equipment.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`quest-equipment-${equipment.value}`}
                    checked={quest.equipment_tags?.includes(equipment.value)}
                    onChange={() => onEquipmentToggle(equipment.value)}
                    className="rounded"
                  />
                  <Label
                    htmlFor={`quest-equipment-${equipment.value}`}
                    className="text-sm"
                  >
                    {equipment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paramètres workout selon le type */}
        {(quest.workout_type === "tabata" || quest.workout_type === "emom") && (
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Paramètres de timing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Secondes de travail</Label>
                <Input
                  type="number"
                  value={quest.work_seconds}
                  onChange={(e) => onChange((prev) => ({ ...prev, work_seconds: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondes de repos</Label>
                <Input
                  type="number"
                  value={quest.rest_seconds}
                  onChange={(e) => onChange((prev) => ({ ...prev, rest_seconds: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>
        )}

        {quest.workout_type === "for_time" && (
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold">Paramètres For Time</h3>
            <div className="space-y-2">
              <Label>Nombre de tours</Label>
              <Input
                type="number"
                value={quest.rounds_target}
                onChange={(e) => onChange((prev) => ({ ...prev, rounds_target: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        )}

        {/* Minutes totales */}
        <div className="space-y-2 border-t pt-6">
          <Label>Minutes totales</Label>
          <Input
            type="number"
            value={quest.total_minutes}
            onChange={(e) => onChange((prev) => ({ ...prev, total_minutes: parseInt(e.target.value) || 0 }))}
          />
        </div>

        {/* Récompenses XP */}
        <div className="space-y-4 border-t pt-6">
          <h4 className="font-semibold">Récompenses XP</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-red-500">💪 Force</Label>
              <Input
                type="number"
                value={quest.xp_force}
                onChange={(e) => onChange((prev) => ({ ...prev, xp_force: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-green-500">🏃 Endurance</Label>
              <Input
                type="number"
                value={quest.xp_endurance}
                onChange={(e) => onChange((prev) => ({ ...prev, xp_endurance: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-500">⚡ Agilité</Label>
              <Input
                type="number"
                value={quest.xp_agilite}
                onChange={(e) => onChange((prev) => ({ ...prev, xp_agilite: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-purple-500">🧠 Mental</Label>
              <Input
                type="number"
                value={quest.xp_mental}
                onChange={(e) => onChange((prev) => ({ ...prev, xp_mental: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </div>

        {/* Exercices */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">
              Exercices ({quest.exercises.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddExercise}
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          <div className="space-y-4">
            {quest.exercises.map((exercise, index) => (
              <div key={exercise.id ?? `tmp-${index}`} className="flex gap-4 items-end p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label>Nom de l'exercice</Label>
                  <Input
                    value={exercise.name}
                    onChange={(e) => onExerciseChange(index, "name", e.target.value)}
                    placeholder="Ex: Développé couché"
                  />
                </div>
                
                <div className="w-32 space-y-2">
                  <Label>Répétitions</Label>
                  <Input
                    type="number"
                    value={exercise.target_reps}
                    onChange={(e) => onExerciseChange(index, "target_reps", parseInt(e.target.value) || 0)}
                  />
                </div>

                {/* 🏋️ Champs spécifiques musculation */}
                {quest.workout_type === "strength" && (
                  <>
                    <div className="w-32 space-y-2">
                      <Label>Séries</Label>
                      <Input
                        type="number"
                        value={exercise.sets_count || quest.sets_count || 3}
                        onChange={(e) => onExerciseChange(index, "sets_count", parseInt(e.target.value) || 3)}
                        placeholder="3"
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Poids (kg)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={exercise.target_weight || ""}
                        onChange={(e) => onExerciseChange(index, "target_weight", parseFloat(e.target.value) || undefined)}
                        placeholder="Optionnel"
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Repos (s)</Label>
                      <Input
                        type="number"
                        value={exercise.rest_seconds || quest.rest_seconds || 60}
                        onChange={(e) => onExerciseChange(index, "rest_seconds", parseInt(e.target.value) || 60)}
                        placeholder="60"
                      />
                    </div>
                  </>
                )}

                <div className="w-32 space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={exercise.notes || ""}
                    onChange={(e) => onExerciseChange(index, "notes", e.target.value)}
                    placeholder="Optionnel"
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveExercise(index)}
                  className="text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {quest.exercises.length === 0 && (
              <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                Aucun exercice ajouté
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
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
