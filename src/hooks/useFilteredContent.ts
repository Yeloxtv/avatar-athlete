import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentFilters, CampaignWithFilters, OneShotWithFilters, LevelType, EquipmentType } from '@/types/content';

export function useFilteredContent(filters: ContentFilters) {
  const [campaigns, setCampaigns] = useState<CampaignWithFilters[]>([]);
  const [oneShots, setOneShots] = useState<OneShotWithFilters[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCampaigns(), fetchOneShots()]);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    let query = supabase
      .from('campaigns')
      .select(`
        *,
        quests(id)
      `)
      .eq('is_published', true)
      .eq('is_active', true);

    // Filtrer par niveau
    if (filters.level) {
      query = query.eq('level_required', filters.level);
    }

    // Filtrer par équipement (si l'équipement sélectionné est dans les tags)
    if (filters.equipment.length > 0) {
      query = query.overlaps('equipment_tags', filters.equipment);
    }

    // Tri
    switch (filters.sort) {
      case 'NEWEST':
        query = query.order('created_at', { ascending: false });
        break;
      case 'DURATION_ASC':
        query = query.order('estimated_duration_weeks', { ascending: true });
        break;
      case 'DURATION_DESC':
        query = query.order('estimated_duration_weeks', { ascending: false });
        break;
      case 'RECOMMENDED':
      default:
        // Ordre par défaut: actives d'abord, puis par date
        query = query.order('is_active', { ascending: false })
          .order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    const campaignsWithCount = data?.map(campaign => ({
      ...campaign,
      quests_count: campaign.quests?.length || 0,
      level_required: campaign.level_required as LevelType | null,
      equipment_tags: campaign.equipment_tags as EquipmentType[] | null
    })) || [];
    
    setCampaigns(campaignsWithCount);
  };

  const fetchOneShots = async () => {
    let query = supabase
      .from('quests')
      .select('*')
      .eq('is_published', true)
      .eq('is_one_shot', true);

    // Filtrer par niveau
    if (filters.level) {
      query = query.eq('level_required', filters.level);
    }

    // Filtrer par équipement
    if (filters.equipment.length > 0) {
      query = query.overlaps('equipment_tags', filters.equipment);
    }

    // Tri
    switch (filters.sort) {
      case 'NEWEST':
        query = query.order('created_at', { ascending: false });
        break;
      case 'DURATION_ASC':
        query = query.order('estimated_duration_minutes', { ascending: true });
        break;
      case 'DURATION_DESC':
        query = query.order('estimated_duration_minutes', { ascending: false });
        break;
      case 'RECOMMENDED':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    const oneShotsTyped = data?.map(oneShot => ({
      ...oneShot,
      level_required: oneShot.level_required as LevelType | null,
      equipment_tags: oneShot.equipment_tags as EquipmentType[] | null,
      type: oneShot.type as 'quete' | 'boss'
    })) || [];
    
    setOneShots(oneShotsTyped);
  };

  const refetch = () => {
    fetchContent();
  };

  return {
    campaigns,
    oneShots,
    loading,
    refetch
  };
}