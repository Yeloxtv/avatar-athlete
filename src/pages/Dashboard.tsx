import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Target,
  Clock,
  Zap,
  Folder,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useQuests } from "@/hooks/useQuests";

// Types
interface Campaign {
  id?: string;
  title: string;
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
  notes?: string;
  created_at?: string;
}

interface Quest {
  id?: string;
  campaign_id: string;
  title: string;
  description: string;
  workout_type: "simple" | "for_time" | "tabata" | "amrap" | "emom";
  type: "quete" | "boss";
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
  title: "",
  slug: "",
  description: "",
  is_active: true,
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
};

const emptyExercise: Exercise = {
  name: "",
  target_reps: 0,
  order_index: 1,
};

export default function QuestAdminDashboard() {
  // Hooks Supabase
  const {
    campaigns,
    loading: campaignsLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refetch: refetchCampaigns,
  } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  // Ajoute les hooks pour les quêtes
  const {
    quests,
    loading: questsLoading,
    createQuest,
    updateQuest,
    deleteQuest,
    saveQuestExercises,
    refetch: refetchQuests,
  } = useQuests({
    campaignId: selectedCampaign?.id,
  });
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isCreatingQuest, setIsCreatingQuest] = useState(false);

  const [activeTab, setActiveTab] = useState("campaigns");

  // État de chargement global
  const loading = campaignsLoading || questsLoading;

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
    if (!editingCampaign || !editingCampaign.title.trim()) {
      toast({
        title: "Le nom de la campagne est requis",
        variant: "destructive",
      });
      return;
    }
    try {
      // Génération automatique du slug si vide
      if (!editingCampaign.slug.trim()) {
        editingCampaign.slug = editingCampaign.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      if (isCreatingCampaign) {
        await createCampaign(editingCampaign);
        toast({ title: "Campagne créée avec succès !" });
      } else {
        await updateCampaign(editingCampaign.id!, editingCampaign);
        toast({ title: "Campagne modifiée avec succès !" });
      }
      setEditingCampaign(null);
      setIsCreatingCampaign(false);
      await refetchCampaigns();
    } catch (error) {
      toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer la campagne "${campaign?.title}" ? Toutes les quêtes associées seront supprimées.`
      )
    )
      return;
    try {
      await deleteCampaign(campaignId);
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
      }
      toast({ title: "Campagne supprimée avec succès !" });
      await refetchCampaigns();
    } catch (error) {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab("quests");
    // Ici on chargerait les vraies quêtes de la campagne depuis Supabase
  };

  // ====== FONCTIONS QUÊTES (inchangées) ======
  const handleCreateQuest = () => {
    if (!selectedCampaign) return;
    const questsInCampaign = quests.filter(
      (q) => q.campaign_id === selectedCampaign.id
    );
    setEditingQuest({
      ...emptyQuest,
      campaign_id: selectedCampaign.id!,
      order_index: questsInCampaign.length + 1,
    });
    setIsCreatingQuest(true);
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest({ ...quest });
    setIsCreatingQuest(false);
  };

const handleSaveQuest = async () => {
  if (!editingQuest || !editingQuest.title.trim()) {
    toast({
      title: "Le titre de la quête est requis",
      variant: "destructive",
    });
    return;
  }

  // Vérifie que le type est valide
  if (!['quete', 'boss'].includes(editingQuest.type)) {
    toast({
      title: "Type de quête invalide",
      variant: "destructive",
    });
    return;
  }
  
  try {
    if (isCreatingQuest) {
      const { exercises, ...questData } = editingQuest;
      
      // Assure-toi que tous les champs requis sont présents
      const dataToSend = {
        ...questData,
        campaign_id: selectedCampaign?.id,
        type: questData.type || 'quete', // Valeur par défaut si non définie
        workout_type: questData.workout_type || 'simple', // Valeur par défaut si non définie
      };
      
      // Ajouter xp_total manquant
      const questWithTotal = {
        ...dataToSend,
        xp_total: (dataToSend.xp_force || 0) + (dataToSend.xp_endurance || 0) + 
                  (dataToSend.xp_agilite || 0) + (dataToSend.xp_mental || 0)
      };
      
      const newQuest = await createQuest(questWithTotal);
      
      if (exercises && exercises.length > 0) {
        const exercisesWithRequiredFields = exercises.map(ex => ({
          ...ex,
          notes: ex.notes || '',
          created_at: ex.created_at || new Date().toISOString()
        }));
        await saveQuestExercises(newQuest.id, exercisesWithRequiredFields);
      }
      toast({ title: "Quête créée avec succès !" });
    } else {
      // ... reste du code inchangé
    }
    setEditingQuest(null);
    setIsCreatingQuest(false);
    await refetchQuests();
  } catch (error) {
    console.error('Error saving quest:', error);
    toast({ 
      title: "Erreur lors de la sauvegarde", 
      description: error.message,
      variant: "destructive" 
    });
  }
};
  const handleDeleteQuest = async (questId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette quête ?")) return;
    try {
      await deleteQuest(questId);
      toast({ title: "Quête supprimée avec succès !" });
      await refetchQuests();
    } catch (error) {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  const handleAddExercise = () => {
    if (!editingQuest) return;
    const newExercise = {
      ...emptyExercise,
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

  const handleExerciseChange = (
    index: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    if (!editingQuest) return;
    const newExercises = [...editingQuest.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setEditingQuest({ ...editingQuest, exercises: newExercises });
  };

  // Utilitaires
  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case "simple":
        return "Simple";
      case "for_time":
        return "For Time";
      case "tabata":
        return "Tabata";
      case "amrap":
        return "AMRAP";
      case "emom":
        return "EMOM";
      default:
        return type;
    }
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
                <Button
                  onClick={handleCreateCampaign}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle Campagne
                </Button>
              </div>
            )}

            {/* Liste des campagnes */}
            {!editingCampaign && (
              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="border-accent/30 hover:shadow-lg transition-all"
                  >
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
                          <div className="flex gap-2 mt-3">
                            <Badge
                              variant={
                                campaign.is_active ? "default" : "secondary"
                              }
                            >
                              {campaign.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {campaign.quests_count || 0} quête
                              {(campaign.quests_count || 0) > 1 ? "s" : ""}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
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
                            onClick={() =>
                              campaign.id && handleDeleteCampaign(campaign.id)
                            }
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
                    <CardTitle>
                      {isCreatingCampaign
                        ? "Créer une nouvelle campagne"
                        : "Modifier la campagne"}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCampaign(null);
                        setIsCreatingCampaign(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Nom de la campagne *</Label>
                    <Input
                      id="campaign-name"
                      value={editingCampaign.title}
                      onChange={(e) =>
                        setEditingCampaign({
                          ...editingCampaign,
                          title: e.target.value,
                        })
                      }
                      placeholder="Ex: J'aime pas le cardio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-slug">Slug (URL)</Label>
                    <Input
                      id="campaign-slug"
                      value={editingCampaign.slug}
                      onChange={(e) =>
                        setEditingCampaign({
                          ...editingCampaign,
                          slug: e.target.value,
                        })
                      }
                      placeholder="jaime-pas-le-cardio (auto-généré si vide)"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /campaign/{editingCampaign.slug || "slug-auto"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-description">Description</Label>
                    <Textarea
                      id="campaign-description"
                      value={editingCampaign.description}
                      onChange={(e) =>
                        setEditingCampaign({
                          ...editingCampaign,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description de la campagne"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="campaign-active"
                      checked={editingCampaign.is_active}
                      onChange={(e) =>
                        setEditingCampaign({
                          ...editingCampaign,
                          is_active: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="campaign-active">Campagne active</Label>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={handleSaveCampaign} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingCampaign(null);
                        setIsCreatingCampaign(false);
                      }}
                    >
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
                <Button
                  onClick={handleCreateQuest}
                  className="flex items-center gap-2"
                >
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
                            onClick={() =>
                              quest.id && handleDeleteQuest(quest.id)
                            }
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
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Détails workout */}
                      <div className="flex gap-4 text-sm text-muted-foreground">
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
                      </div>

                      {/* Exercices */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Exercices ({quest.exercises.length})
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {quest.exercises.map((exercise, i) => (
                            <Badge key={i} variant="outline">
                              {exercise.name}{" "}
                              {exercise.target_reps > 0 &&
                                `(${exercise.target_reps})`}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* XP */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Récompenses XP
                        </h4>
                        <div className="flex gap-3 text-sm">
                          {quest.xp_force > 0 && (
                            <span className="text-red-500">
                              💪 {quest.xp_force}
                            </span>
                          )}
                          {quest.xp_endurance > 0 && (
                            <span className="text-green-500">
                              🏃 {quest.xp_endurance}
                            </span>
                          )}
                          {quest.xp_agilite > 0 && (
                            <span className="text-blue-500">
                              ⚡ {quest.xp_agilite}
                            </span>
                          )}
                          {quest.xp_mental > 0 && (
                            <span className="text-purple-500">
                              🧠 {quest.xp_mental}
                            </span>
                          )}
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
                    <CardTitle>
                      {isCreatingQuest
                        ? "Créer une nouvelle quête"
                        : "Modifier la quête"}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingQuest(null);
                        setIsCreatingQuest(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Titre de la quête *</Label>
                      <Input
                        value={editingQuest.title}
                        onChange={(e) =>
                          setEditingQuest({
                            ...editingQuest,
                            title: e.target.value,
                          })
                        }
                        placeholder="Ex: Cardio de l'enfer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type de workout</Label>
                      <Select
                        value={editingQuest.workout_type}
                        onValueChange={(value) =>
                          setEditingQuest({
                            ...editingQuest,
                            workout_type: value as Quest["workout_type"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
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
                        onValueChange={(value) =>
                          setEditingQuest({
                            ...editingQuest,
                            type: value as Quest["type"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quete">Normal</SelectItem>
                          <SelectItem value="boss">Boss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Ordre d'affichage</Label>
                      <Input
                        type="number"
                        value={editingQuest.order_index}
                        onChange={(e) =>
                          setEditingQuest({
                            ...editingQuest,
                            order_index: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingQuest.description}
                        onChange={(e) =>
                          setEditingQuest({
                            ...editingQuest,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description de la quête"
                      />
                    </div>
                  </div>

                  {/* Paramètres workout selon le type */}
                  {(editingQuest.workout_type === "tabata" ||
                    editingQuest.workout_type === "emom") && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Secondes de travail</Label>
                        <Input
                          type="number"
                          value={editingQuest.work_seconds}
                          onChange={(e) =>
                            setEditingQuest({
                              ...editingQuest,
                              work_seconds: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondes de repos</Label>
                        <Input
                          type="number"
                          value={editingQuest.rest_seconds}
                          onChange={(e) =>
                            setEditingQuest({
                              ...editingQuest,
                              rest_seconds: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {editingQuest.workout_type === "for_time" && (
                    <div className="space-y-2">
                      <Label>Nombre de tours</Label>
                      <Input
                        type="number"
                        value={editingQuest.rounds_target}
                        onChange={(e) =>
                          setEditingQuest({
                            ...editingQuest,
                            rounds_target: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  )}
                  {/* Minutes totales */}
                  <div className="space-y-2">
                    <Label>Minutes totales</Label>
                    <Input
                      type="number"
                      value={editingQuest.total_minutes}
                      onChange={(e) =>
                        setEditingQuest({
                          ...editingQuest,
                          total_minutes: parseInt(e.target.value) || 0,
                        })
                      }
                    />
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
                          onChange={(e) =>
                            setEditingQuest({
                              ...editingQuest,
                              xp_force: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-green-500">🏃 Endurance</Label>
                        <Input
                          type="number"
                          value={editingQuest.xp_endurance}
                          onChange={(e) =>
                            setEditingQuest({
                              ...editingQuest,
                              xp_endurance: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-blue-500">⚡ Agilité</Label>
                        <Input
                          type="number"
                          value={editingQuest.xp_agilite}
                          onChange={(e) =>
                            setEditingQuest({
                              ...editingQuest,
                              xp_agilite: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-purple-500">🧠 Mental</Label>
                        <Input
                          type="number"
                          value={editingQuest.xp_mental}
                          onChange={(e) =>
                            setEditingQuest({
                              ...editingQuest,
                              xp_mental: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Exercices */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">
                        Exercices ({editingQuest.exercises.length})
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddExercise}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {editingQuest.exercises.map((exercise, index) => (
                        <div key={index} className="flex gap-4 items-end">
                          <div className="flex-1 space-y-2">
                            <Label>Nom de l'exercice</Label>
                            <Input
                              value={exercise.name}
                              onChange={(e) =>
                                handleExerciseChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Ex: Pompes"
                            />
                          </div>
                          <div className="w-32 space-y-2">
                            <Label>Répétitions</Label>
                            <Input
                              type="number"
                              value={exercise.target_reps}
                              onChange={(e) =>
                                handleExerciseChange(
                                  index,
                                  "target_reps",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveExercise(index)}
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={handleSaveQuest} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingQuest(null);
                        setIsCreatingQuest(false);
                      }}
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
