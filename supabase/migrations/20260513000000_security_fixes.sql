-- Security fixes migration
-- 1. Fix SECURITY DEFINER functions missing SET search_path (prevents search_path hijacking)
-- 2. Fix complete_quest to enforce auth.uid() == p_user_id (prevents XP fraud on other accounts)
-- 3. Fix exercise_logs RLS policies to be granular per operation
-- 4. Create exercise_logs table with proper RLS if it doesn't exist

-- ============================================================
-- FIX 1 & 2 : handle_new_user — add SET search_path
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_emoji)
  VALUES (NEW.id, 'Nouvel Athlète', '🧑‍💻');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
   SET search_path = public;

-- ============================================================
-- FIX 1 & 2 : initialize_user_quests — add SET search_path + auth check
-- ============================================================
CREATE OR REPLACE FUNCTION public.initialize_user_quests(p_user_id UUID, p_campaign_id UUID)
RETURNS VOID AS $$
DECLARE
  quest_record RECORD;
  first_quest BOOLEAN := true;
BEGIN
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: cannot initialize quests for another user';
  END IF;

  FOR quest_record IN
    SELECT id FROM public.quests
    WHERE campaign_id = p_campaign_id
    ORDER BY order_index
  LOOP
    INSERT INTO public.user_quests (user_id, quest_id, status)
    VALUES (
      p_user_id,
      quest_record.id,
      CASE WHEN first_quest THEN 'available' ELSE 'locked' END
    )
    ON CONFLICT (user_id, quest_id) DO NOTHING;
    first_quest := false;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
   SET search_path = public;

-- ============================================================
-- FIX 1, 2 & 3 : complete_quest — add SET search_path + auth check
-- Removes p_user_id parameter, uses auth.uid() directly to make
-- cross-user XP fraud structurally impossible.
-- ============================================================
DROP FUNCTION IF EXISTS public.complete_quest(UUID, UUID);

CREATE OR REPLACE FUNCTION public.complete_quest(p_quest_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID := auth.uid();
  quest_record RECORD;
  next_quest_id UUID;
  result JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO quest_record FROM public.quests WHERE id = p_quest_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quest not found';
  END IF;

  UPDATE public.user_quests
  SET status = 'completed', completed_at = now()
  WHERE user_id = v_user_id AND quest_id = p_quest_id AND status = 'available';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quest not available for completion (not found, already completed, or locked)';
  END IF;

  UPDATE public.profiles SET
    xp_total      = xp_total + quest_record.xp_total,
    stat_force     = stat_force + quest_record.xp_force,
    stat_endurance = stat_endurance + quest_record.xp_endurance,
    stat_agilite   = stat_agilite + quest_record.xp_agilite,
    stat_mental    = stat_mental + quest_record.xp_mental,
    level          = GREATEST(0, FLOOR((xp_total + quest_record.xp_total) / 200)),
    updated_at     = now()
  WHERE user_id = v_user_id;

  INSERT INTO public.audit_xp (user_id, quest_id, delta_force, delta_endurance, delta_agilite, delta_mental, delta_total)
  VALUES (v_user_id, p_quest_id, quest_record.xp_force, quest_record.xp_endurance, quest_record.xp_agilite, quest_record.xp_mental, quest_record.xp_total);

  SELECT q.id INTO next_quest_id
  FROM public.quests q
  WHERE q.campaign_id = quest_record.campaign_id
    AND q.order_index = quest_record.order_index + 1;

  IF next_quest_id IS NOT NULL THEN
    UPDATE public.user_quests
    SET status = 'available'
    WHERE user_id = v_user_id AND quest_id = next_quest_id AND status = 'locked';
  END IF;

  result := jsonb_build_object(
    'success', true,
    'xp_gained', quest_record.xp_total,
    'next_quest_unlocked', next_quest_id IS NOT NULL
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
   SET search_path = public;

-- ============================================================
-- FIX 4 : exercise_logs table + granular RLS policies
-- Creates the table if it doesn't exist yet, then applies
-- per-operation RLS policies instead of a single permissive ALL.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  set_number INTEGER DEFAULT 1,
  reps_completed INTEGER DEFAULT 0,
  weight_kg NUMERIC(6,2),
  duration_seconds INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

-- Drop old catch-all policy if it exists
DROP POLICY IF EXISTS "Users can manage their exercise logs" ON public.exercise_logs;

CREATE POLICY "exercise_logs_select" ON public.exercise_logs
  FOR SELECT USING (
    session_id IN (SELECT id FROM public.workout_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "exercise_logs_insert" ON public.exercise_logs
  FOR INSERT WITH CHECK (
    session_id IN (SELECT id FROM public.workout_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "exercise_logs_update" ON public.exercise_logs
  FOR UPDATE USING (
    session_id IN (SELECT id FROM public.workout_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "exercise_logs_delete" ON public.exercise_logs
  FOR DELETE USING (
    session_id IN (SELECT id FROM public.workout_sessions WHERE user_id = auth.uid())
  );
