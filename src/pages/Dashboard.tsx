import React, { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client'
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
  Folder,
  ArrowLeft,
  Filter,
  Settings,
} from "lucide-react";

// Types étendus avec les champs de filtrage
interface Campaign {
  id?: string;
  title: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  quests_count?: number;
  level_required?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  equipment_tags?: string[];
  estimated_duration_weeks?: number;
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
  level_required?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  equipment_tags?: string[];
  estimated_duration_minutes?: number;
  is_one_shot?: boolean;
  is_published?: boolean;
}

// Constantes pour les filtres
const LEVELS = [
  { value: 'BEGINNER', label: 'Débutant' },
  { value: 'INTERMEDIATE', label: 'Intermédiaire' },
  { value: 'ADVANCED', label: 'Avancé' }
];

const EQUIPMENT_OPTIONS = [
  { value: 'POIDS_CORPS', label: 'Poids du corps' },
  { value: 'HALTERES', label: 'Haltères' },
  { value: 'BARRE', label: 'Barre' },
  { value: 'KETTLEBELL', label: 'Kettlebell' },
  { value: 'ELASTIQUES', label: 'Élastiques' },
  { value: 'BANC', label: 'Banc' },
  { value: 'CORDE', label: 'Corde à sauter' },
  { value: 'TAPIS', label: 'Tapis de sol' },
];

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
  // États existants (simulés pour l'exemple)
  const [campaigns, setCampaigns] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  
  const [editingQuest, setEditingQuest] = useState(null);
  const [isCreatingQuest, setIsCreatingQuest] = useState(false);
  
  const [activeTab, setActiveTab] = useState("campaigns");

  // Fonctions utilitaires pour les équipements
  const handleEquipmentToggle = (equipment, isQuest = false) => {
    const target = isQuest ? editingQuest : editingCampaign;
    const setter = isQuest ? setEditingQuest : setEditingCampaign;
    
    if (!target) return;
    
    const currentEquipment = target.equipment_tags || [];
    const newEquipment = currentEquipment.includes(equipment)
      ? currentEquipment.filter(e => e !== equipment)
      : [...currentEquipment, equipment];
    
    setter({
      ...target,
      equipment_tags: newEquipment
    });
  };

  const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;

  // Fonctions campagnes (adaptées)
  const handleCreateCampaign = () => {
    setEditingCampaign({ ...emptyCampaign });
    setIsCreatingCampaign(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign({ ...campaign });
    setIsCreatingCampaign(false);
  };

  const handleSaveCampaign = async () => {
  if (!editingCampaign || !editingCampaign.title?.trim()) {
    alert("Le nom de la campagne est requis");
    return;
  }

  // slug auto si vide
  const slug =
    (editingCampaign.slug || editingCampaign.title)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const payload = {
  title: editingCampaign.title,
  slug,
  description: editingCampaign.description || "",
  is_active: Boolean(editingCampaign.is_active),

  level_required: editingCampaign.level_required || 'BEGINNER',
  equipment_tags: editingCampaign.equipment_tags || [],
  estimated_duration_weeks: editingCampaign.estimated_duration_weeks || 4,
};

  try {
    // (optionnel) indicateur de chargement local
    // setLoading(true);

    if (isCreatingCampaign) {
      const { error } = await supabase.from("campaigns").insert([payload]);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("campaigns")
        .update(payload)
        .eq("id", editingCampaign.id);
      if (error) throw error;
    }

    await fetchCampaigns(); // ← re-charge la liste
    setEditingCampaign(null);
    setIsCreatingCampaign(false);
    alert(isCreatingCampaign ? "Campagne créée" : "Campagne mise à jour");
  } catch (e: any) {
    console.error("[handleSaveCampaign]", e);
    alert(e?.message || "Erreur lors de la sauvegarde de la campagne");
  } finally {
    // setLoading(false);
  }
};


 const handleDeleteCampaign = async (campaignId: string) => {
  if (!confirm("Supprimer cette campagne et ses quêtes ?")) return;
  try {
    await supabase.from("quest_exercises")
      .delete()
      .in("quest_id",
        (await supabase.from("quests").select("id").eq("campaign_id", campaignId)).data?.map(q => q.id) || []
      );
    await supabase.from("quests").delete().eq("campaign_id", campaignId);
    const { error } = await supabase.from("campaigns").delete().eq("id", campaignId);
    if (error) throw error;
    await fetchCampaigns();
    if (selectedCampaign?.id === campaignId) setSelectedCampaign(null);
  } catch (e: any) {
    alert(e?.message || "Erreur lors de la suppression");
  }
};
  const handleSelectCampaign = async (campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab("quests");
    await fetchQuests(campaign.id);
  };

  // Fonctions quêtes (adaptées)
  const handleCreateQuest = () => {
    if (!selectedCampaign) return;
    setEditingQuest({
      ...emptyQuest,
      campaign_id: selectedCampaign.id,
      order_index: quests.length + 1,
    });
    setIsCreatingQuest(true);
  };

  const handleEditQuest = (quest) => {
    setEditingQuest({ ...quest });
    setIsCreatingQuest(false);
  };
  const syncQuestExercises = async (questId: string, exercises: Exercise[]) => {
  // Normalise + réindexe (1..n), évite NaN/undefined
  const normalized = (exercises || [])
    .map((ex, idx) => ({
      id: ex.id, // conserve id si existant (pour update)
      quest_id: questId,
      name: String(ex.name ?? '').trim(),
      target_reps: Number(ex.target_reps ?? 0),
      order_index: Number(ex.order_index ?? idx + 1) || idx + 1,
      notes: (ex.notes?.trim?.() ? ex.notes : null) as string | null,
    }))
    .filter(ex => ex.name.length > 0) // on ignore les lignes vides

  // Récupère les IDs existants pour calculer les suppressions
  const { data: existing, error: existingErr } = await supabase
    .from('quest_exercises')
    .select('id')
    .eq('quest_id', questId)
  if (existingErr) throw existingErr

  const existingIds = new Set((existing ?? []).map(r => r.id as string))
  const incomingIds = new Set(normalized.map(r => r.id).filter(Boolean) as string[])
  const toDelete = [...existingIds].filter(id => !incomingIds.has(id))

  // Supprime celles retirées de l’UI
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase
      .from('quest_exercises')
      .delete()
      .in('id', toDelete)
    if (delErr) throw delErr
  }

  // Upsert le reste (insert/update)
  if (normalized.length > 0) {
    const { error: upErr } = await supabase
      .from('quest_exercises')
      .upsert(normalized, { onConflict: 'id', ignoreDuplicates: false })
    if (upErr) throw upErr
  }
};

  const handleSaveQuest = async () => {
  if (!editingQuest || !editingQuest.title?.trim()) {
    alert("Le titre de la quête est requis");
    return;
  }
  if (!selectedCampaign?.id) {
    alert("Aucune campagne sélectionnée");
    return;
  }

  const xp_total =
    (editingQuest.xp_force || 0) +
    (editingQuest.xp_endurance || 0) +
    (editingQuest.xp_agilite || 0) +
    (editingQuest.xp_mental || 0);

  const baseQuestPayload = {
    campaign_id: selectedCampaign.id,
    order_index: Number(editingQuest.order_index) || 1,
    title: editingQuest.title,
    description: editingQuest.description || "",
    type: editingQuest.type || "quete",

    xp_force: Number(editingQuest.xp_force) || 0,
    xp_endurance: Number(editingQuest.xp_endurance) || 0,
    xp_agilite: Number(editingQuest.xp_agilite) || 0,
    xp_mental: Number(editingQuest.xp_mental) || 0,
    xp_total,

    workout_type: editingQuest.workout_type || "simple",
    work_seconds: Number(editingQuest.work_seconds) || 0,
    rest_seconds: Number(editingQuest.rest_seconds) || 0,
    rounds_target: Number(editingQuest.rounds_target) || 0,
    total_minutes: Number(editingQuest.total_minutes) || 0,

    level_required: editingQuest.level_required || 'BEGINNER',
    equipment_tags: editingQuest.equipment_tags || [],
    estimated_duration_minutes: editingQuest.estimated_duration_minutes || 30,
    is_one_shot: Boolean(editingQuest.is_one_shot),
    is_published: Boolean(editingQuest.is_published),
  };

  const exercises = editingQuest.exercises || [];

  try {
    if (isCreatingQuest) {
      // CREATE quest
      const { data: created, error } = await supabase
        .from("quests")
        .insert([baseQuestPayload])
        .select()
        .single();
      if (error) throw error;

      // CREATE exercises (si présents)
      if (exercises.length) {
        const toInsert = exercises.map((ex, idx) => ({
          quest_id: created.id,
          order_index: Number(ex.order_index) || idx + 1,
          name: ex.name || "",
          target_reps: Number(ex.target_reps) || 0,
          notes: ex.notes?.trim?.() ? ex.notes : null,
        }));
        const { error: exErr } = await supabase.from("quest_exercises").insert(toInsert);
        if (exErr) throw exErr;
      }
    } else {
      // UPDATE quest
      const { error } = await supabase
        .from("quests")
        .update(baseQuestPayload)
        .eq("id", editingQuest.id);
      if (error) throw error;

      // UPSERT + DELETE exercises (synchro complète)
      await syncQuestExercises(editingQuest.id!, exercises);
    }

    await fetchQuests(selectedCampaign.id);
    setEditingQuest(null);
    setIsCreatingQuest(false);
    alert(isCreatingQuest ? "Quête créée" : "Quête mise à jour");
  } catch (e: any) {
    console.error("[handleSaveQuest]", e);
    alert(e?.message || "Erreur lors de la sauvegarde de la quête");
  }
};

  const handleDeleteQuest = async (questId: string) => {
  if (!confirm("Supprimer cette quête ?")) return;
  try {
    await supabase.from("quest_exercises").delete().eq("quest_id", questId);
    const { error } = await supabase.from("quests").delete().eq("id", questId);
    if (error) throw error;
    await fetchQuests(selectedCampaign!.id);
  } catch (e: any) {
    alert(e?.message || "Erreur lors de la suppression");
  }
};

const fetchQuests = async (campaignId) => {
  const { data: questsData, error: questsError } = await supabase
    .from('quests')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('order_index');

  if (questsError) {
    console.error('Erreur quests:', questsError);
    return;
  }

  // Récupérer les exercices pour chaque quête
  const questsWithExercises = await Promise.all(
    (questsData || []).map(async (quest) => {
      const { data: exercises, error: exError } = await supabase
        .from('quest_exercises')
        .select('*')
        .eq('quest_id', quest.id)
        .order('order_index');

      if (exError) {
        console.error('Erreur exercises:', exError);
      }

      // ✅ Assurer que equipment_tags est un tableau
      return {
        ...quest,
        equipment_tags: quest.equipment_tags || [], // ← FIX ICI AUSSI
        exercises: exercises || []
      };
    })
  );

  setQuests(questsWithExercises);
};

  const handleAddExercise = () => {
    if (!editingQuest) return;
    const newExercise = {
      ...emptyExercise,
      id: newId(),
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

  const handleRemoveExercise = (index) => {
    if (!editingQuest) return;
    const newExercises = editingQuest.exercises.filter((_, i) => i !== index);
    setEditingQuest({
      ...editingQuest,
      exercises: newExercises.map((ex, i) => ({ ...ex, order_index: i + 1 })),
    });
  };

  const handleExerciseChange = (index, field, value) => {
    if (!editingQuest) return;
    const newExercises = [...editingQuest.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setEditingQuest({ ...editingQuest, exercises: newExercises });
  };

  const getWorkoutTypeLabel = (type) => {
    switch (type) {
      case "simple": return "Simple";
      case "for_time": return "For Time";
      case "tabata": return "Tabata";
      case "amrap": return "AMRAP";
      case "emom": return "EMOM";
      default: return type;
    }
  };

  const getLevelLabel = (level) => {
    return LEVELS.find(l => l.value === level)?.label || level;
  };

  const getEquipmentLabel = (equipment) => {
    return EQUIPMENT_OPTIONS.find(e => e.value === equipment)?.label || equipment;
  };

  const getCurrentQuests = () => {
    if (!selectedCampaign) return [];
    return quests.filter((q) => q.campaign_id === selectedCampaign.id);
  };

const fetchCampaigns = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      id, slug, title, description, is_active,
      level_required,          
      equipment_tags,          
      estimated_duration_weeks 
    `)
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    alert("Erreur chargement campagnes");
    return;
  }

  // ✅ Assurez-vous que equipment_tags est toujours un tableau
  const cleanedData = (data || []).map(campaign => ({
    ...campaign,
    equipment_tags: campaign.equipment_tags || [] // ← FIX ICI
  }));

  setCampaigns(cleanedData);
};

useEffect(() => {
  fetchCampaigns();
}, []);

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

            {/* Formulaire campagne avec filtres */}
            {editingCampaign && (
              <Card className="border-accent">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {isCreatingCampaign ? "Créer une nouvelle campagne" : "Modifier la campagne"}
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
                          value={editingCampaign.title}
                          onChange={(e) =>
                            setEditingCampaign({
                              ...editingCampaign,
                              title: e.target.value,
                            })
                          }
                          placeholder="Ex: Programme débutant"
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
                          placeholder="programme-debutant (auto-généré si vide)"
                        />
                      </div>
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
                          value={editingCampaign.level_required}
                          onValueChange={(value) =>
                            setEditingCampaign({
                              ...editingCampaign,
                              level_required: value,
                            })
                          }
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
                          value={editingCampaign.estimated_duration_weeks}
                          onChange={(e) =>
                            setEditingCampaign({
                              ...editingCampaign,
                              estimated_duration_weeks: parseInt(e.target.value) || 4,
                            })
                          }
                          placeholder="4"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-7">
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
                              checked={editingCampaign.equipment_tags?.includes(equipment.value)}
                              onChange={() => handleEquipmentToggle(equipment.value, false)}
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

            {/* Formulaire quête avec filtres */}
            {editingQuest && (
              <Card className="border-accent">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {isCreatingQuest ? "Créer une nouvelle quête" : "Modifier la quête"}
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
                  <div className="space-y-4">
                    <h3 className="font-semibold">Informations générales</h3>
                    
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
                              workout_type: value,
                            })
                          }
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
                          onValueChange={(value) =>
                            setEditingQuest({
                              ...editingQuest,
                              type: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                          value={editingQuest.level_required}
                          onValueChange={(value) =>
                            setEditingQuest({
                              ...editingQuest,
                              level_required: value,
                            })
                          }
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
                          value={editingQuest.estimated_duration_minutes}
                          onChange={(e) =>
                            setEditingQuest({
                              ...editingQuest,
                              estimated_duration_minutes: parseInt(e.target.value) || 30,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="quest-oneshot"
                            checked={editingQuest.is_one_shot}
                            onChange={(e) =>
                              setEditingQuest({
                                ...editingQuest,
                                is_one_shot: e.target.checked,
                              })
                            }
                            className="rounded"
                          />
                          <Label htmlFor="quest-oneshot" className="text-sm">One-shot</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="quest-published"
                            checked={editingQuest.is_published}
                            onChange={(e) =>
                              setEditingQuest({
                                ...editingQuest,
                                is_published: e.target.checked,
                              })
                            }
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
                              checked={editingQuest.equipment_tags?.includes(equipment.value)}
                              onChange={() => handleEquipmentToggle(equipment.value, true)}
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
                  {(editingQuest.workout_type === "tabata" || editingQuest.workout_type === "emom") && (
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
                    </div>
                  )}

                  {editingQuest.workout_type === "for_time" && (
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-semibold">Paramètres For Time</h3>
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
                    </div>
                  )}

                  {/* Minutes totales */}
                  <div className="space-y-2 border-t pt-6">
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
                  <div className="space-y-4 border-t pt-6">
                    <h4 className="font-semibold">Récompenses XP</h4>
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
                  <div className="space-y-4 border-t pt-6">
                    <div className="flex justify-between items-center">
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
                        <div key={exercise.id ?? `tmp-${index}`} className="flex gap-4 items-end p-4 border rounded-lg">
                          <div className="flex-1 space-y-2">
                            <Label>Nom de l'exercice</Label>
                            <Input
                              value={exercise.name}
                              onChange={(e) =>
                                handleExerciseChange(index, "name", e.target.value)
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
                          <div className="w-32 space-y-2">
                            <Label>Notes</Label>
                            <Input
                              value={exercise.notes || ""}
                              onChange={(e) =>
                                handleExerciseChange(index, "notes", e.target.value)
                              }
                              placeholder="Optionnel"
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
                      
                      {editingQuest.exercises.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                          Aucun exercice ajouté
                        </div>
                      )}
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