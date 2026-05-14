import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Campaign } from '@/types/dashboard';
import { generateSlug } from '@/utils/dashboard';

export const useCampaignManager = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          id, slug, title, description, is_active,
          level_required,          
          equipment_tags,          
          estimated_duration_weeks 
        `)
        .order('id', { ascending: true });

      if (error) throw error;

      // Assurer que equipment_tags est toujours un tableau et typer correctement
      const cleanedData = (data || []).map(campaign => ({
        ...campaign,
        equipment_tags: campaign.equipment_tags || [],
        level_required: campaign.level_required as Campaign['level_required']
      }));

      setCampaigns(cleanedData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveCampaign = async (campaign: Campaign, isCreating: boolean, ownerUserId?: string) => {
    if (!campaign.title?.trim()) {
      throw new Error("Le nom de la campagne est requis");
    }

    const slug = generateSlug(campaign.title, campaign.slug);

    const payload = {
      title: campaign.title,
      slug,
      description: campaign.description || "",
      is_active: Boolean(campaign.is_active),
      level_required: campaign.level_required || 'BEGINNER',
      equipment_tags: campaign.equipment_tags || [],
      estimated_duration_weeks: campaign.estimated_duration_weeks || 4,
    };

    try {
      if (isCreating) {
        const insertPayload = ownerUserId
          ? { ...payload, owner_user_id: ownerUserId }
          : payload
        const { data: created, error } = await supabase
          .from("campaigns")
          .insert([insertPayload])
          .select('id')
          .single()
        if (error) throw error;
        await fetchCampaigns();
        return created.id as string
      } else {
        const { error } = await supabase
          .from("campaigns")
          .update(payload)
          .eq("id", campaign.id);
        if (error) throw error;
        await fetchCampaigns();
        return campaign.id as string
      }
    } catch (error) {
      console.error('[saveCampaign]', error);
      throw error;
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      // Supprimer les exercices des quêtes
      await supabase.from("quest_exercises")
        .delete()
        .in("quest_id",
          (await supabase.from("quests").select("id").eq("campaign_id", campaignId)).data?.map(q => q.id) || []
        );
      
      // Supprimer les quêtes
      await supabase.from("quests").delete().eq("campaign_id", campaignId);
      
      // Supprimer la campagne
      const { error } = await supabase.from("campaigns").delete().eq("id", campaignId);
      if (error) throw error;

      await fetchCampaigns();
    } catch (error) {
      console.error('[deleteCampaign]', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    fetchCampaigns,
    saveCampaign,
    deleteCampaign
  };
};
