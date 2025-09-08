import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  exercises?: { id: string; name: string; target_reps: number; notes?: string }[];
  xp_force?: number;
  xp_endurance?: number;
  xp_agilite?: number;
  xp_mental?: number;
  work_seconds?: number;
  rest_seconds?: number;
  rounds_target?: number;
  total_minutes?: number;
}

export const useCampaignView = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  // États
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questsLoading, setQuestsLoading] = useState(false);

  const loading = campaignLoading || questsLoading;

  // Charger la campagne
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (slug) {
          // Si on a un slug dans l'URL, récupérer cette campagne spécifique
          const { data, error } = await supabase
            .from('campaigns')
            .select('id, slug, title, description')
            .eq('slug', slug)
            .single();

          if (error) throw error;
          setActiveCampaign(data);
        } else {
          // Sinon, récupérer la première campagne active
          const { data, error } = await supabase
            .from('campaigns')
            .select('id, slug, title, description')
            .eq('is_active', true)
            .limit(1)
            .single();

          if (error) throw error;
          setActiveCampaign(data);
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la campagne",
          variant: "destructive"
        });
      } finally {
        setCampaignLoading(false);
      }
    };

    fetchCampaign();
  }, [slug]);

  // Charger les quêtes quand la campagne change
  useEffect(() => {
    if (activeCampaign?.id) {
      fetchQuests(activeCampaign.id);
    }
  }, [activeCampaign?.id]);

  const fetchQuests = async (campaignId: string) => {
    setQuestsLoading(true);
    try {
      // Utiliser le hook existant useQuests si disponible
      // Pour l'instant, on fait un appel direct
      const { data: questsData, error } = await supabase
        .from('quests')
        .select(`
          id,
          title,
          description,
          workout_type,
          type,
          work_seconds,
          rest_seconds,
          rounds_target,
          total_minutes,
          xp_force,
          xp_endurance,
          xp_agilite,
          xp_mental,
          exercises:quest_exercises(*)
        `)
        .eq('campaign_id', campaignId)
        .eq('is_published', true)
        .order('order_index');

      if (error) throw error;

      // Pour l'instant, on simule le user_status
      // TODO: Intégrer avec le vrai système de progression utilisateur
      const questsWithStatus = (questsData || []).map((quest, index) => ({
        ...quest,
        user_status: index === 0 ? 'unlocked' : 'locked' // Simulation simple
      }));

      setQuests(questsWithStatus);
    } catch (error) {
      console.error('Error fetching quests:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les quêtes",
        variant: "destructive"
      });
    } finally {
      setQuestsLoading(false);
    }
  };

  const navigateToQuest = (questId: string) => {
    navigate(`/train/${questId}`);
  };

  const navigateBack = () => {
    navigate('/');
  };

  return {
    activeCampaign,
    quests,
    loading,
    navigateToQuest,
    navigateBack
  };
};
