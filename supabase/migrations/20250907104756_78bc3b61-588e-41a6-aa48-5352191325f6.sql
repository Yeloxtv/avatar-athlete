-- Ajout des champs niveau et environnement pour les campagnes et quêtes
-- Campagnes: niveau, environnement, durée estimée, statut publié
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS level_required TEXT CHECK (level_required IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'));
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS equipment_tags TEXT[];
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS estimated_duration_weeks INTEGER DEFAULT 4;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Quêtes: niveau, environnement, durée par entraînement, type one-shot
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS level_required TEXT CHECK (level_required IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'));
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS equipment_tags TEXT[];
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 30;
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS is_one_shot BOOLEAN DEFAULT false;
ALTER TABLE public.quests ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Index pour améliorer les performances des filtres
CREATE INDEX IF NOT EXISTS idx_campaigns_level ON public.campaigns(level_required);
CREATE INDEX IF NOT EXISTS idx_campaigns_published ON public.campaigns(is_published);
CREATE INDEX IF NOT EXISTS idx_quests_level ON public.quests(level_required);
CREATE INDEX IF NOT EXISTS idx_quests_one_shot ON public.quests(is_one_shot);
CREATE INDEX IF NOT EXISTS idx_quests_published ON public.quests(is_published);