import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
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
    navigate("/profil");
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

        // 🔍 LOG UTILE : Vérifier les statuts récupérés
        console.log("🔍 QUEST DEBUG - Statuts récupérés de la DB:", userQuests);

        if (!userQuestsError && userQuests?.length) {
          statusByQuestId = new Map(
            userQuests.map((r: { quest_id: string; status: string }) => [
              r.quest_id,
              r.status,
            ])
          );
        }
      }

      // Calculer les statuts finaux avec logique de déblocage
      const questsWithStatus = (questsData || []).map((quest, index) => {
        const dbStatus = statusByQuestId.get(quest.id);

        let user_status = "locked";

        if (dbStatus === "completed") {
          user_status = "completed";
        } else if (dbStatus === "available") {
          user_status = "available";
        } else if (index === 0) {
          user_status = "available";
        } else {
          const previousQuest = questsData[index - 1];
          const previousStatus = statusByQuestId.get(previousQuest?.id);

          if (previousStatus === "completed") {
            user_status = "available";
          }
        }

        // 🔍 LOG UTILE : Vérifier la logique de chaque quête
        console.log(`🎯 QUEST DEBUG - ${quest.title}:`, {
          order_index: quest.order_index,
          dbStatus,
          user_status,
          previousCompleted: index > 0 ? statusByQuestId.get(questsData[index - 1]?.id) : 'N/A'
        });

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
  };
};