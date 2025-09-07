import { useState, useEffect } from 'react';
import { ContentFilters, LevelType, EquipmentType, SortType, getLevelFromRpgLevel } from '@/types/content';
import { useProfile } from './useProfile';

const STORAGE_KEY = 'content-filters';

export function useContentFilters() {
  const { profile } = useProfile();
  
  const [filters, setFilters] = useState<ContentFilters>({
    level: undefined,
    equipment: [],
    sort: 'RECOMMENDED'
  });

  // Charger les filtres sauvegardés au démarrage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFilters(parsed);
      } catch (error) {
        console.error('Error parsing saved filters:', error);
      }
    }
  }, []);

  // Sauvegarder les filtres à chaque changement
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const updateLevel = (level: LevelType | undefined) => {
    setFilters(prev => ({ ...prev, level }));
  };

  const updateEquipment = (equipment: EquipmentType[]) => {
    setFilters(prev => ({ ...prev, equipment }));
  };

  const updateSort = (sort: SortType) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  const resetFilters = () => {
    setFilters({
      level: undefined,
      equipment: [],
      sort: 'RECOMMENDED'
    });
  };

  // Suggestion automatique basée sur le profil
  const suggestForMe = () => {
    if (!profile) return;
    
    const suggestedLevel = getLevelFromRpgLevel(profile.level || 1);
    
    // Récupérer le dernier équipement utilisé (simulé pour l'instant)
    const lastEquipment = localStorage.getItem('last-equipment');
    const suggestedEquipment: EquipmentType[] = lastEquipment 
      ? [lastEquipment as EquipmentType] 
      : ['POIDS_CORPS']; // Par défaut
    
    setFilters({
      level: suggestedLevel,
      equipment: suggestedEquipment,
      sort: 'RECOMMENDED'
    });
  };

  return {
    filters,
    updateLevel,
    updateEquipment,
    updateSort,
    resetFilters,
    suggestForMe
  };
}