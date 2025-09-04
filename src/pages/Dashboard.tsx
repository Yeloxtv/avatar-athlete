import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Target, Clock, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Types basés sur votre structure
interface Exercise {
  id?: string;
  name: string;
  target_reps: number;
  order_index: number;
}

interface Quest {
  id?: string;
  title: string;
  description: string;
  workout_type: 'simple' | 'for_time' | 'tabata' | 'amrap' | 'emom';
  type: 'normal' | 'boss';
  order_index: number;
  work_seconds: number;
  rest_seconds: number;
  rounds_target: number;
  total_minutes: number;
  xp_force: number;
  xp_endurance: number;
  xp_agilite: number;
  xp_mental: number;
  exercises: Exercise[];
}

const emptyQuest: Quest = {
  title: '',
  description: '',
  workout_type: 'simple',
  type: 'normal',
  order_index: 1,
  work_seconds: 0,
  rest_seconds: 0,
  rounds_target: 0,
  total_minutes: 0,
  xp_force: 0,
  xp_endurance: 0,
  xp_agilite: 0,
  xp_mental: 0,
  exercises: []
};

const emptyExercise: Exercise = {
  name: '',
  target_reps: 0,
  order_index: 1
};

export default function Dashboard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data pour la démonstration - remplacez par vos vraies données
  useEffect(() => {
    setQuests([
      {
        id: '1',
        title: 'Éveil du Guerrier',
        description: 'Premier entraînement pour réveiller vos muscles',
        workout_type: 'simple',
        type: 'normal',
        order_index: 1,
        work_seconds: 0,
        rest_seconds: 0,
        rounds_target: 3,
        total_minutes: 0,
        xp_force: 10,
        xp_endurance: 15,
        xp_agilite: 5,
        xp_mental: 5,
        exercises: [
          { id: '1', name: 'Pompes', target_reps: 10, order_index: 1 },
          { id: '2', name: 'Squats', target_reps: 15, order_index: 2 }
        ]
      }
    ]);
  }, []);

  const handleCreateQuest = () => {
    setEditingQuest({ ...emptyQuest, order_index: quests.length + 1 });
    setIsCreating(true);
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest({ ...quest });
    setIsCreating(false);
  };

  const handleSaveQuest = async () => {
    if (!editingQuest) return;
    
    setLoading(true);
    try {
      // Simulation API call - remplacez par votre logique Supabase
      if (isCreating) {
        const newQuest = { ...editingQuest, id: Date.now().toString() };
        setQuests([...quests, newQuest]);
        toast({ title: "Quête créée avec succès !" });
      } else {
        setQuests(quests.map(q => q.id === editingQuest.id ? editingQuest : q));
        toast({ title: "Quête modifiée avec succès !" });
      }
      setEditingQuest(null);
      setIsCreating(false);
    } catch (error) {
      toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDeleteQuest = async (questId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette quête ?')) return;
    
    setLoading(true);
    try {
      setQuests(quests.filter(q => q.id !== questId));
      toast({ title: "Quête supprimée avec succès !" });
    } catch (error) {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleAddExercise = () => {
    if (!editingQuest) return;
    const newExercise = { ...emptyExercise, order_index: editingQuest.exercises.length + 1 };
    setEditingQuest({
      ...editingQuest,
      exercises: [...editingQuest.exercises, newExercise]
    });
  };

  const handleRemoveExercise = (index: number) => {
    if (!editingQuest) return;
    const newExercises = editingQuest.exercises.filter((_, i) => i !== index);
    setEditingQuest({
      ...editingQuest,
      exercises: newExercises.map((ex, i) => ({ ...ex, order_index: i + 1 }))
    });
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    if (!editingQuest) return;
    const newExercises = [...editingQuest.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setEditingQuest({ ...editingQuest, exercises: newExercises });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard Admin - Quêtes
            </h1>
            <p className="text-muted-foreground">Gérez les quêtes de la campagne "J'aime pas le cardio"</p>
          </div>
          <Button onClick={handleCreateQuest} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle Quête
          </Button>
        </div>

        {/* Liste des quêtes */}
        {!editingQuest && (
          <div className="grid gap-4">
            {quests.map((quest) => (
              <Card key={quest.id} className="border-accent/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-xl">{quest.type === 'boss' ? '👑' : '⚔️'}</span>
                        {quest.title}
                      </CardTitle>
                      <CardDescription>{quest.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditQuest(quest)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => quest.id && handleDeleteQuest(quest.id)}
                        className="text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{getWorkoutTypeLabel(quest.workout_type)}</Badge>
                    {quest.type === 'boss' && <Badge className="bg-yellow-500/20 text-yellow-500">Boss</Badge>}
                    <Badge variant="secondary">Ordre: {quest.order_index}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Détails workout */}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {quest.workout_type === 'tabata' && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quest.work_seconds}s / {quest.rest_seconds}s
                      </div>
                    )}
                    {quest.rounds_target > 0 && (
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {quest.rounds_target} tours
                      </div>
                    )}
                    {quest.total_minutes > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quest.total_minutes} min
                      </div>
                    )}
                  </div>

                  {/* Exercices */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Exercices ({quest.exercises.length})</h4>
                    <div className="flex gap-2 flex-wrap">
                      {quest.exercises.map((exercise, i) => (
                        <Badge key={i} variant="outline">
                          {exercise.name} {exercise.target_reps > 0 && `(${exercise.target_reps})`}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* XP */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Récompenses XP</h4>
                    <div className="flex gap-3 text-sm">
                      {quest.xp_force > 0 && <span className="text-red-500">💪 {quest.xp_force}</span>}
                      {quest.xp_endurance > 0 && <span className="text-green-500">🏃 {quest.xp_endurance}</span>}
                      {quest.xp_agilite > 0 && <span className="text-blue-500">⚡ {quest.xp_agilite}</span>}
                      {quest.xp_mental > 0 && <span className="text-purple-500">🧠 {quest.xp_mental}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Formulaire d'édition */}
        {editingQuest && (
          <Card className="border-accent">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{isCreating ? 'Créer une nouvelle quête' : 'Modifier la quête'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => {setEditingQuest(null); setIsCreating(false);}}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={editingQuest.title}
                    onChange={(e) => setEditingQuest({...editingQuest, title: e.target.value})}
                    placeholder="Nom de la quête"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order">Ordre *</Label>
                  <Input
                    id="order"
                    type="number"
                    value={editingQuest.order_index}
                    onChange={(e) => setEditingQuest({...editingQuest, order_index: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={editingQuest.description}
                  onChange={(e) => setEditingQuest({...editingQuest, description: e.target.value})}
                  placeholder="Description de l'entraînement"
                />
              </div>

              {/* Type de workout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de workout</Label>
                  <Select 
                    value={editingQuest.workout_type} 
                    onValueChange={(value: any) => setEditingQuest({...editingQuest, workout_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="for_time">For Time</SelectItem>
                      <SelectItem value="tabata">Tabata</SelectItem>
                      <SelectItem value="amrap">AMRAP</SelectItem>
                      <SelectItem value="emom">EMOM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type de quête</Label>
                  <Select 
                    value={editingQuest.type} 
                    onValueChange={(value: any) => setEditingQuest({...editingQuest, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="boss">Boss Fight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Paramètres spécifiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {editingQuest.workout_type === 'tabata' && (
                  <>
                    <div className="space-y-2">
                      <Label>Travail (sec)</Label>
                      <Input
                        type="number"
                        value={editingQuest.work_seconds}
                        onChange={(e) => setEditingQuest({...editingQuest, work_seconds: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Repos (sec)</Label>
                      <Input
                        type="number"
                        value={editingQuest.rest_seconds}
                        onChange={(e) => setEditingQuest({...editingQuest, rest_seconds: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label>Rounds</Label>
                  <Input
                    type="number"
                    value={editingQuest.rounds_target}
                    onChange={(e) => setEditingQuest({...editingQuest, rounds_target: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Minutes totales</Label>
                  <Input
                    type="number"
                    value={editingQuest.total_minutes}
                    onChange={(e) => setEditingQuest({...editingQuest, total_minutes: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              {/* Récompenses XP */}
              <div>
                <h4 className="font-semibold mb-3">Récompenses XP</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-red-500">💪 Force</Label>
                    <Input
                      type="number"
                      value={editingQuest.xp_force}
                      onChange={(e) => setEditingQuest({...editingQuest, xp_force: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-green-500">🏃 Endurance</Label>
                    <Input
                      type="number"
                      value={editingQuest.xp_endurance}
                      onChange={(e) => setEditingQuest({...editingQuest, xp_endurance: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-500">⚡ Agilité</Label>
                    <Input
                      type="number"
                      value={editingQuest.xp_agilite}
                      onChange={(e) => setEditingQuest({...editingQuest, xp_agilite: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-500">🧠 Mental</Label>
                    <Input
                      type="number"
                      value={editingQuest.xp_mental}
                      onChange={(e) => setEditingQuest({...editingQuest, xp_mental: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              {/* Exercices */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">Exercices</h4>
                  <Button variant="outline" size="sm" onClick={handleAddExercise}>
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {editingQuest.exercises.map((exercise, index) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          placeholder="Nom de l'exercice"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={exercise.target_reps}
                          onChange={(e) => handleExerciseChange(index, 'target_reps', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveExercise(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSaveQuest} disabled={loading} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {setEditingQuest(null); setIsCreating(false);}}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}