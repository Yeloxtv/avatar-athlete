import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Save, X, Target, Clock, Zap, Folder, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Types
interface Campaign {
  id?: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  quests_count?: number;
}

interface Exercise {
  id?: string;
  name: string;
  target_reps: number;
  order_index: number;
}

interface Quest {
  id?: string;
  campaign_id: string;
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

const emptyCampaign: Campaign = {
  name: '',
  slug: '',
  description: '',
  is_active: true
};

const emptyQuest: Quest = {
  campaign_id: '',
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

export default function QuestAdminDashboard() {
  // États pour les campagnes
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  // États pour les quêtes
  const [quests, setQuests] = useState<Quest[]>([]);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isCreatingQuest, setIsCreatingQuest] = useState(false);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");

  // Mock data pour la démonstration
  useEffect(() => {
    // Données de campagnes mock
    setCampaigns([
      {
        id: '1',
        name: "J'aime pas le cardio",
        slug: 'jaime-pas-le-cardio',
        description: 'Une campagne pour ceux qui détestent le cardio mais veulent se remettre en forme',
        is_active: true,
        quests_count: 12
      },
      {
        id: '2',
        name: 'Force & Puissance',
        slug: 'force-puissance',
        description: 'Développez votre force et votre explosivité',
        is_active: true,
        quests_count: 8
      }
    ]);

    // Quêtes mock pour la campagne 1
    setQuests([
      {
        id: '1',
        campaign_id: '1',
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

  // ====== FONCTIONS CAMPAGNES ======
  const handleCreateCampaign = () => {
    setEditingCampaign({ ...emptyCampaign });
    setIsCreatingCampaign(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign({ ...campaign });
    setIsCreatingCampaign(false);
  };

  const handleSaveCampaign = async () => {
    if (!editingCampaign || !editingCampaign.name.trim()) {
      toast({ title: "Le nom de la campagne est requis", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      // Génération automatique du slug si vide
      if (!editingCampaign.slug.trim()) {
        editingCampaign.slug = editingCampaign.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      if (isCreatingCampaign) {
        const newCampaign = { ...editingCampaign, id: Date.now().toString(), quests_count: 0 };
        setCampaigns([...campaigns, newCampaign]);
        toast({ title: "Campagne créée avec succès !" });
      } else {
        setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? editingCampaign : c));
        toast({ title: "Campagne modifiée avec succès !" });
      }
      setEditingCampaign(null);
      setIsCreatingCampaign(false);
    } catch (error) {
      toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la campagne "${campaign?.name}" ? Toutes les quêtes associées seront supprimées.`)) return;
    
    setLoading(true);
    try {
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      setQuests(quests.filter(q => q.campaign_id !== campaignId));
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
      }
      toast({ title: "Campagne supprimée avec succès !" });
    } catch (error) {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab("quests");
    // Ici on chargerait les vraies quêtes de la campagne depuis Supabase
  };

  // ====== FONCTIONS QUÊTES (inchangées) ======
  const handleCreateQuest = () => {
    if (!selectedCampaign) return;
    const questsInCampaign = quests.filter(q => q.campaign_id === selectedCampaign.id);
    setEditingQuest({ 
      ...emptyQuest, 
      campaign_id: selectedCampaign.id!,
      order_index: questsInCampaign.length + 1 
    });
    setIsCreatingQuest(true);
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest({ ...quest });
    setIsCreatingQuest(false);
  };

  const handleSaveQuest = async () => {
    if (!editingQuest || !editingQuest.title.trim()) {
      toast({ title: "Le titre de la quête est requis", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      if (isCreatingQuest) {
        const newQuest = { ...editingQuest, id: Date.now().toString() };
        setQuests([...quests, newQuest]);
        toast({ title: "Quête créée avec succès !" });
      } else {
        setQuests(quests.map(q => q.id === editingQuest.id ? editingQuest : q));
        toast({ title: "Quête modifiée avec succès !" });
      }
      setEditingQuest(null);
      setIsCreatingQuest(false);
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

  // Utilitaires
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

  const getCurrentQuests = () => {
    if (!selectedCampaign) return [];
    return quests.filter(q => q.campaign_id === selectedCampaign.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard Admin
            </h1>
            <p className="text-muted-foreground">Gérez vos campagnes et quêtes d'entraînement</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Campagnes ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger value="quests" disabled={!selectedCampaign} className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Quêtes {selectedCampaign && `(${getCurrentQuests().length})`}
            </TabsTrigger>
          </TabsList>

          {/* ONGLET CAMPAGNES */}
          <TabsContent value="campaigns" className="space-y-4">
            {!editingCampaign && (
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gestion des Campagnes</h2>
                <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvelle Campagne
                </Button>
              </div>
            )}

            {/* Liste des campagnes */}
            {!editingCampaign && (
              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="border-accent/30 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-3">
                            <Folder className="w-5 h-5 text-primary" />
                            {campaign.name}
                          </CardTitle>
                          <CardDescription className="mt-1">{campaign.description}</CardDescription>
                          <div className="flex gap-2 mt-3">
                            <Badge variant={campaign.is_active ? "default" : "secondary"}>
                              {campaign.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">
                              {campaign.quests_count || 0} quête{(campaign.quests_count || 0) > 1 ? 's' : ''}
                            </Badge>
                            <Badge variant="outline" className="font-mono text-xs">
                              /{campaign.slug}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSelectCampaign(campaign)}
                            className="text-blue-600"
                          >
                            <Target className="w-4 h-4 mr-1" />
                            Quêtes
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditCampaign(campaign)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => campaign.id && handleDeleteCampaign(campaign.id)}
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            {/* Formulaire campagne */}
            {editingCampaign && (
              <Card className="border-accent">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{isCreatingCampaign ? 'Créer une nouvelle campagne' : 'Modifier la campagne'}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => {setEditingCampaign(null); setIsCreatingCampaign(false);}}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Nom de la campagne *</Label>
                    <Input
                      id="campaign-name"
                      value={editingCampaign.name}
                      onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})}
                      placeholder="Ex: J'aime pas le cardio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-slug">Slug (URL)</Label>
                    <Input
                      id="campaign-slug"
                      value={editingCampaign.slug}
                      onChange={(e) => setEditingCampaign({...editingCampaign, slug: e.target.value})}
                      placeholder="jaime-pas-le-cardio (auto-généré si vide)"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /campaign/{editingCampaign.slug || 'slug-auto'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-description">Description</Label>
                    <Textarea
                      id="campaign-description"
                      value={editingCampaign.description}
                      onChange={(e) => setEditingCampaign({...editingCampaign, description: e.target.value})}
                      placeholder="Description de la campagne"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="campaign-active"
                      checked={editingCampaign.is_active}
                      onChange={(e) => setEditingCampaign({...editingCampaign, is_active: e.target.checked})}
                    />
                    <Label htmlFor="campaign-active">Campagne active</Label>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={handleSaveCampaign} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                    <Button variant="outline" onClick={() => {setEditingCampaign(null); setIsCreatingCampaign(false);}}>
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ONGLET QUÊTES */}
          <TabsContent value="quests" className="space-y-4">
            {selectedCampaign && !editingQuest && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {setSelectedCampaign(null); setActiveTab("campaigns");}}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold">Quêtes - {selectedCampaign.name}</h2>
                    <p className="text-sm text-muted-foreground">{getCurrentQuests().length} quête(s)</p>
                  </div>
                </div>
                <Button onClick={handleCreateQuest} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvelle Quête
                </Button>
              </div>
            )}

            {/* Liste des quêtes (code existant adapté) */}
            {selectedCampaign && !editingQuest && (
              <div className="grid gap-4">
                {getCurrentQuests().map((quest) => (
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

            {/* Formulaire quête (code existant inchangé mais conditionné) */}
            {editingQuest && (
              <Card className="border-accent">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{isCreatingQuest ? 'Créer une nouvelle quête' : 'Modifier la quête'}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => {setEditingQuest(null); setIsCreatingQuest(false);}}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      onClick={() => {setEditingQuest(null); setIsCreatingQuest(false);}}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}