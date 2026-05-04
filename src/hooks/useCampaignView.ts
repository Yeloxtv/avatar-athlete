import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  owner_user_id: string | null;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  workout_type: string;
  type: string;
  user_status?: string;
  db_status?: string;
}

export const useCampaignView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const navigateToQuest = (questId: string) => {
    navigate(`/train/${questId}`);
  };

  const navigateBack = () => {
    navigate("/");
  };

  const resetCampaign = async () => {
    if (!activeCampaign || !user) return;

    try {
      // Récupérer toutes les quêtes de la campagne
      const { data: campaignQuests, error: questsError } = await supabase
        .from("quests")
        .select("id, order_index")
        .eq("campaign_id", activeCampaign.id)
        .order("order_index", { ascending: true });

      if (questsError) throw questsError;
      if (!campaignQuests || campaignQuests.length === 0) return;

      const questIds = campaignQuests.map(q => q.id);
      const firstQuest = campaignQuests[0];

      // Supprimer toutes les entrées user_quests pour cette campagne
      const { error: deleteError } = await supabase
        .from("user_quests")
        .delete()
        .eq("user_id", user.id)
        .in("quest_id", questIds);

      if (deleteError) {
        console.error("Erreur lors de la suppression:", deleteError);
        throw deleteError;
      }

      // Attendre un peu pour s'assurer que la suppression est bien propagée
      await new Promise(resolve => setTimeout(resolve, 100));

      // Créer ou mettre à jour l'entrée pour la première quête
      const { error: upsertError } = await supabase
        .from("user_quests")
        .upsert({
          user_id: user.id,
          quest_id: firstQuest.id,
          status: "available"
        }, {
          onConflict: "user_id,quest_id"
        });

      if (upsertError) {
        console.error("Erreur lors de l'upsert:", upsertError);
        throw upsertError;
      }

      // Recharger les données
      await fetchCampaignAndQuests();
    } catch (error) {
      console.error("Erreur lors du reset de la campagne:", error);
      throw error;
    }
  };

  const fetchCampaignAndQuests = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Récupérer la campagne
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (campaignError) throw campaignError;
      if (!campaignData) {
        setActiveCampaign(null);
        setQuests([]);
        setLoading(false);
        return;
      }

      setActiveCampaign(campaignData);

      // Récupérer les quêtes
      const { data: questsData, error: questsError } = await supabase
        .from("quests")
        .select("*")
        .eq("campaign_id", campaignData.id)
        .order("order_index", { ascending: true });

      if (questsError) throw questsError;

      // Récupérer les statuts utilisateur
      let statusByQuestId = new Map<string, string>();

      if (user && questsData && questsData.length > 0) {
        const questIds = questsData.map((q) => q.id);

        const { data: userQuests, error: userQuestsError } = await supabase
          .from("user_quests")
          .select("quest_id, status")
          .eq("user_id", user.id)
          .in("quest_id", questIds);

        if (!userQuestsError && userQuests?.length) {
          statusByQuestId = new Map(
            userQuests.map((r: { quest_id: string; status: string }) => [
              r.quest_id,
              r.status,
            ])
          );
        }
      }

      const isPersonalProgram = campaignData.owner_user_id === user?.id

      // Calculer les statuts finaux avec logique de déblocage
      const questsWithStatus = (questsData || []).map((quest, index) => {
        const dbStatus = statusByQuestId.get(quest.id);

        let user_status: string

        if (dbStatus === "completed") {
          user_status = "completed";
        } else if (isPersonalProgram) {
          // Programme perso : tout est accessible librement
          user_status = "available";
        } else if (dbStatus === "available") {
          user_status = "available";
        } else if (index === 0) {
          user_status = "available";
        } else {
          const previousQuest = questsData[index - 1];
          const previousStatus = statusByQuestId.get(previousQuest?.id);
          user_status = previousStatus === "completed" ? "available" : "locked";
        }

        return {
          ...quest,
          user_status,
          db_status: dbStatus || "aucun",
        };
      });

      setQuests(questsWithStatus);
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error);
      setActiveCampaign(null);
      setQuests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignAndQuests();
  }, [slug, user]);

  return {
    activeCampaign,
    quests,
    loading,
    navigateToQuest,
    navigateBack,
    resetCampaign,
  };
};