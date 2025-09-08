import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Target, Clock, Folder, ArrowLeft } from "lucide-react";

// Import des nouveaux composants et hooks
import { CampaignForm } from "@/components/dashboard/CampaignForm";
import { QuestForm } from "@/components/dashboard/QuestForm";
import { useCampaignManager } from "@/hooks/useCampaignManager";
import { useQuestManager } from "@/hooks/useQuestManager";

// Import des types et utilitaires
import { Campaign, Quest, Exercise } from "@/types/dashboard";
import { getWorkoutTypeLabel, getLevelLabel, getEquipmentLabel, generateId } from "@/utils/dashboard";

// Objets vides pour initialisation
const emptyCampaign: Campaign = {
  title: "",
  slug: "",
  description: "",
  is_active: true,
  level_required: 'BEGINNER',
  equipment_tags: [],
  estimated_duration_weeks: 4,
};

const emptyQuest: Quest = {
  campaign_id: "",
  title: "",
  description: "",
  workout_type: "simple",
  type: "quete",
  order_index: 1,
  work_seconds: 0,
  rest_seconds: 0,
  rounds_target: 0,
  total_minutes: 0,
  xp_force: 0,
  xp_endurance: 0,
  xp_agilite: 0,
  xp_mental: 0,
  exercises: [],
  level_required: 'BEGINNER',
  equipment_tags: [],
  estimated_duration_minutes: 30,
  is_one_shot: false,
  is_published: true,
};

const emptyExercise: Exercise = {
  name: "",
  target_reps: 0,
  order_index: 1,
};

export default function QuestAdminDashboard() {
  // Utilisation des nouveaux hooks
  const { campaigns, loading: campaignsLoading, saveCampaign, deleteCampaign } = useCampaignManager();
  const { quests, loading: questsLoading, fetchQuests, saveQuest, deleteQuest } = useQuestManager();

  // États locaux pour l'interface
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isCreatingQuest, setIsCreatingQuest] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");

  const loading = campaignsLoading || questsLoading;

  // Gestion des campagnes
  const handleCreateCampaign = () => {
    setEditingCampaign({ ...emptyCampaign });
    setIsCreatingCampaign(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign({ ...campaign });
    setIsCreatingCampaign(false);
  };

  const handleSaveCampaign = async () => {
    if (!editingCampaign) return;

    try {
      await saveCampaign(editingCampaign, isCreatingCampaign);
      setEditingCampaign(null);
      setIsCreatingCampaign(false);
      alert(isCreatingCampaign ? "Campagne créée" : "Campagne mise à jour");
    } catch (error: any) {
      console.error('[handleSaveCampaign]', error);
      alert(error?.message || "Erreur lors de la sauvegarde de la campagne");
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm("Supprimer cette campagne et ses quêtes ?")) return;

    try {
      await deleteCampaign(campaignId);
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
      }
      alert("Campagne supprimée");
    } catch (error: any) {
      console.error('[handleDeleteCampaign]', error);
      alert(error?.message || "Erreur lors de la suppression");
    }
  };

  const handleSelectCampaign = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab("quests");
    await fetchQuests(campaign.id);
  };

  // Gestion des quêtes
  const handleCreateQuest = () => {
    if (!selectedCampaign) return;
    setEditingQuest({
      ...emptyQuest,
      campaign_id: selectedCampaign.id,
      order_index: quests.length + 1,
    });
    setIsCreatingQuest(true);
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest({ ...quest });
    setIsCreatingQuest(false);
  };

  const handleSaveQuest = async () => {
    if (!editingQuest || !selectedCampaign) return;

    try {
      await saveQuest(editingQuest, isCreatingQuest, selectedCampaign.id);
      setEditingQuest(null);
      setIsCreatingQuest(false);
      alert(isCreatingQuest ? "Quête créée" : "Quête mise à jour");
    } catch (error: any) {
      console.error('[handleSaveQuest]', error);
      alert(error?.message || "Erreur lors de la sauvegarde de la quête");
    }
  };

  const handleDeleteQuest = async (questId: string) => {
    if (!confirm("Supprimer cette quête ?")) return;

    try {
      await deleteQuest(questId, selectedCampaign!.id);
      alert("Quête supprimée");
    } catch (error: any) {
      console.error('[handleDeleteQuest]', error);
      alert(error?.message || "Erreur lors de la suppression");
    }
  };

  // Gestion des équipements
  const handleCampaignEquipmentToggle = (equipment: string) => {
    if (!editingCampaign) return;

    const currentEquipment = editingCampaign.equipment_tags || [];
    const newEquipment = currentEquipment.includes(equipment)
      ? currentEquipment.filter(e => e !== equipment)
      : [...currentEquipment, equipment];

    setEditingCampaign({
      ...editingCampaign,
      equipment_tags: newEquipment
    });
  };

  const handleQuestEquipmentToggle = (equipment: string) => {
    if (!editingQuest) return;

    const currentEquipment = editingQuest.equipment_tags || [];
    const newEquipment = currentEquipment.includes(equipment)
      ? currentEquipment.filter(e => e !== equipment)
      : [...currentEquipment, equipment];

    setEditingQuest({
      ...editingQuest,
      equipment_tags: newEquipment
    });
  };

  // Gestion des exercices
  const handleAddExercise = () => {
    if (!editingQuest) return;
    const newExercise = {
      ...emptyExercise,
      id: generateId(),
      name: "",
      target_reps: 0,
      notes: "",
      order_index: editingQuest.exercises.length + 1,
    };
    setEditingQuest({
      ...editingQuest,
      exercises: [...editingQuest.exercises, newExercise],
    });
  };

  const handleRemoveExercise = (index: number) => {
    if (!editingQuest) return;
    const newExercises = editingQuest.exercises.filter((_, i) => i !== index);
    setEditingQuest({
      ...editingQuest,
      exercises: newExercises.map((ex, i) => ({ ...ex, order_index: i + 1 })),
    });
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    if (!editingQuest) return;
    const newExercises = [...editingQuest.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setEditingQuest({ ...editingQuest, exercises: newExercises });
  };

  const getCurrentQuests = () => {
    if (!selectedCampaign) return [];
    return quests.filter((q) => q.campaign_id === selectedCampaign.id);
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
            <p className="text-muted-foreground">
              Gérez vos campagnes et quêtes d'entraînement
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Campagnes ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger
              value="quests"
              disabled={!selectedCampaign}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Quêtes {selectedCampaign && `(${getCurrentQuests().length})`}
            </TabsTrigger>
          </TabsList>

          {/* ONGLET CAMPAGNES */}
          <TabsContent value="campaigns" className="space-y-4">
            {!editingCampaign && (
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gestion des Campagnes</h2>
                <Button onClick={handleCreateCampaign}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Campagne
                </Button>
              </div>
            )}

            {/* Liste des campagnes existantes */}
            {!editingCampaign && campaigns.length > 0 && (
              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="border-accent/30 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-3">
                            <Folder className="w-5 h-5 text-primary" />
                            {campaign.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {campaign.description}
                          </CardDescription>
                          <div className="flex gap-2 mt-3 flex-wrap">
                            <Badge variant={campaign.is_active ? "default" : "secondary"}>
                              {campaign.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {getLevelLabel(campaign.level_required)}
                            </Badge>
                            <Badge variant="outline">
                              {campaign.estimated_duration_weeks} semaines
                            </Badge>
                            <Badge variant="outline" className="font-mono text-xs">
                              /{campaign.slug}
                            </Badge>
                          </div>
                          {campaign.equipment_tags && campaign.equipment_tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {campaign.equipment_tags.map(eq => (
                                <Badge key={eq} variant="secondary" className="text-xs">
                                  {getEquipmentLabel(eq)}
                                </Badge>
                              ))}
                            </div>
                          )}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCampaign(campaign)}
                          >
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

            {/* Message si aucune campagne */}
            {!editingCampaign && campaigns.length === 0 && (
              <Card className="border-dashed border-muted/50">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">Aucune campagne créée</p>
                  <Button onClick={handleCreateCampaign}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer votre première campagne
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Formulaire campagne */}
            {editingCampaign && (
              <CampaignForm
                campaign={editingCampaign}
                isCreating={isCreatingCampaign}
                loading={loading}
                onSave={handleSaveCampaign}
                onCancel={() => {
                  setEditingCampaign(null);
                  setIsCreatingCampaign(false);
                }}
                onChange={setEditingCampaign}
                onEquipmentToggle={handleCampaignEquipmentToggle}
              />
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
                    onClick={() => {
                      setSelectedCampaign(null);
                      setActiveTab("campaigns");
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Quêtes - {selectedCampaign.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {getCurrentQuests().length} quête(s)
                    </p>
                  </div>
                </div>
                <Button onClick={handleCreateQuest}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Quête
                </Button>
              </div>
            )}

            {/* Liste des quêtes existantes */}
            {selectedCampaign && !editingQuest && getCurrentQuests().length > 0 && (
              <div className="grid gap-4">
                {getCurrentQuests().map((quest) => (
                  <Card key={quest.id} className="border-accent/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <span className="text-xl">
                              {quest.type === "boss" ? "👑" : "⚔️"}
                            </span>
                            {quest.title}
                          </CardTitle>
                          <CardDescription>{quest.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQuest(quest)}
                          >
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
                        <Badge variant="outline">
                          {getWorkoutTypeLabel(quest.workout_type)}
                        </Badge>
                        {quest.type === "boss" && (
                          <Badge className="bg-yellow-500/20 text-yellow-500">
                            Boss
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          Ordre: {quest.order_index}
                        </Badge>
                        <Badge variant="outline">
                          {getLevelLabel(quest.level_required)}
                        </Badge>
                        {quest.is_one_shot && (
                          <Badge variant="outline" className="text-blue-600">
                            One-shot
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Détails workout */}
                      <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                        {quest.workout_type === "tabata" && (
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
                        {quest.estimated_duration_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            ~{quest.estimated_duration_minutes} min
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
                                {getEquipmentLabel(equipment)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Exercices */}
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

                      {/* XP */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Récompenses XP</h4>
                        <div className="flex gap-3 text-sm">
                          {quest.xp_force > 0 && (
                            <span className="text-red-500">💪 {quest.xp_force}</span>
                          )}
                          {quest.xp_endurance > 0 && (
                            <span className="text-green-500">🏃 {quest.xp_endurance}</span>
                          )}
                          {quest.xp_agilite > 0 && (
                            <span className="text-blue-500">⚡ {quest.xp_agilite}</span>
                          )}
                          {quest.xp_mental > 0 && (
                            <span className="text-purple-500">🧠 {quest.xp_mental}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Message si aucune quête */}
            {selectedCampaign && !editingQuest && getCurrentQuests().length === 0 && (
              <Card className="border-dashed border-muted/50">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">Aucune quête dans cette campagne</p>
                  <Button onClick={handleCreateQuest}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer votre première quête
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Formulaire quête */}
            {editingQuest && (
              <QuestForm
                quest={editingQuest}
                isCreating={isCreatingQuest}
                loading={loading}
                onSave={handleSaveQuest}
                onCancel={() => {
                  setEditingQuest(null);
                  setIsCreatingQuest(false);
                }}
                onChange={setEditingQuest}
                onEquipmentToggle={handleQuestEquipmentToggle}
                onAddExercise={handleAddExercise}
                onRemoveExercise={handleRemoveExercise}
                onExerciseChange={handleExerciseChange}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
