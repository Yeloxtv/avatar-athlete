import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'


export function useCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          quests(id)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Ajouter le compteur de quêtes
      const campaignsWithCount = data?.map(campaign => ({
        ...campaign,
        quests_count: campaign.quests?.length || 0
      })) || []
      
      setCampaigns(campaignsWithCount)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (campaign) => {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const updateCampaign = async (id, updates) => {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const deleteCampaign = async (id) => {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  return {
    campaigns,
    loading,
    refetch: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign
  }
}