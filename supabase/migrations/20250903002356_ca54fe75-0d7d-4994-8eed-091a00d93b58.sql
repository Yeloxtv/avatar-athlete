-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT DEFAULT 'Nouvel Athlète',
  avatar_emoji TEXT DEFAULT '🧑‍💻',
  level INTEGER DEFAULT 0,
  xp_total INTEGER DEFAULT 0,
  stat_force INTEGER DEFAULT 0,
  stat_endurance INTEGER DEFAULT 0,
  stat_agilite INTEGER DEFAULT 0,
  stat_mental INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quests table
CREATE TABLE public.quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('quete', 'boss')),
  xp_force INTEGER DEFAULT 0,
  xp_endurance INTEGER DEFAULT 0,
  xp_agilite INTEGER DEFAULT 0,
  xp_mental INTEGER DEFAULT 0,
  xp_total INTEGER DEFAULT 0,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('emom', 'tabata', 'amrap', 'for_time', 'simple')),
  work_seconds INTEGER DEFAULT 0,
  rest_seconds INTEGER DEFAULT 0,
  rounds_target INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quest_exercises table
CREATE TABLE public.quest_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  name TEXT NOT NULL,
  target_reps INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_quests table
CREATE TABLE public.user_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  condition_type TEXT NOT NULL CHECK (condition_type IN ('min_sessions', 'first_superset', 'beat_final_boss')),
  condition_value INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create workout_sessions table
CREATE TABLE public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  workout_type TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  rounds_completed INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session_rounds table
CREATE TABLE public.session_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  round_no INTEGER NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  reps_total INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_xp table
CREATE TABLE public.audit_xp (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  delta_force INTEGER DEFAULT 0,
  delta_endurance INTEGER DEFAULT 0,
  delta_agilite INTEGER DEFAULT 0,
  delta_mental INTEGER DEFAULT 0,
  delta_total INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_xp ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Campaigns policies (public read)
CREATE POLICY "Anyone can view campaigns" ON public.campaigns FOR SELECT USING (true);

-- Quests policies (public read)
CREATE POLICY "Anyone can view quests" ON public.quests FOR SELECT USING (true);

-- Quest exercises policies (public read)
CREATE POLICY "Anyone can view quest exercises" ON public.quest_exercises FOR SELECT USING (true);

-- User quests policies
CREATE POLICY "Users can view their own quest progress" ON public.user_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own quest progress" ON public.user_quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quest progress" ON public.user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges policies (public read)
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Workout sessions policies
CREATE POLICY "Users can view their own sessions" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Session rounds policies
CREATE POLICY "Users can view their own session rounds" ON public.session_rounds 
FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.workout_sessions WHERE id = session_id));
CREATE POLICY "Users can insert their own session rounds" ON public.session_rounds 
FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.workout_sessions WHERE id = session_id));

-- Audit XP policies
CREATE POLICY "Users can view their own XP audit" ON public.audit_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own XP audit" ON public.audit_xp FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_emoji)
  VALUES (NEW.id, 'Nouvel Athlète', '🧑‍💻');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to initialize user quests for new users
CREATE OR REPLACE FUNCTION public.initialize_user_quests(p_user_id UUID, p_campaign_id UUID)
RETURNS VOID AS $$
DECLARE
  quest_record RECORD;
  first_quest BOOLEAN := true;
BEGIN
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
    );
    first_quest := false;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert seed data
-- Campaign
INSERT INTO public.campaigns (slug, title, description, is_active) VALUES
('jaime-pas-le-cardio', 'J''aime pas le cardio', 'Parcours débutant pour progresser sans ''cardio'' classique, via musculation légère, supersets et mini-HIIT.', true);

-- Get campaign ID for quests
DO $$
DECLARE
  campaign_uuid UUID;
BEGIN
  SELECT id INTO campaign_uuid FROM public.campaigns WHERE slug = 'jaime-pas-le-cardio';
  
  -- Insert quests
  INSERT INTO public.quests (campaign_id, order_index, title, description, type, xp_force, xp_endurance, xp_agilite, xp_mental, xp_total, workout_type, work_seconds, rest_seconds, rounds_target, total_minutes) VALUES
  (campaign_uuid, 1, 'Première séance full-body haltères', 'Séance simple : squats haltères, pompes, sit-ups.', 'quete', 20, 5, 0, 5, 30, 'simple', 0, 0, 0, 0),
  (campaign_uuid, 2, 'Découverte des supersets', 'Ton premier superset : squats + pompes enchaînés.', 'quete', 30, 10, 5, 5, 50, 'for_time', 0, 0, 3, 0),
  (campaign_uuid, 3, 'Mini Boss – 3 rounds squats & pompes', '3 rounds de 10 squats + 10 pompes (chronométré).', 'boss', 20, 15, 5, 10, 50, 'for_time', 0, 0, 3, 0),
  (campaign_uuid, 4, 'HIIT débutant 4×20sec', 'Jumping jacks, air squats, push-up, sit-ups (4×20s / 10s repos).', 'quete', 10, 30, 10, 10, 60, 'tabata', 20, 10, 4, 0),
  (campaign_uuid, 5, 'Superset haut/bas', 'Développé haltères + fentes en superset.', 'quete', 30, 15, 10, 10, 65, 'for_time', 0, 0, 4, 0),
  (campaign_uuid, 6, 'Boss Final – Dungeon Challenge (15 min for time)', 'Pendant 15 min : 10 squats haltères, 10 pompes, 10 sit-ups (max tours).', 'boss', 40, 40, 20, 20, 120, 'amrap', 0, 0, 0, 15);
END $$;

-- Insert quest exercises
DO $$
DECLARE
  quest_uuid UUID;
BEGIN
  -- Q1 exercises
  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Première séance full-body haltères';
  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES
  (quest_uuid, 1, 'Squats haltères', 12),
  (quest_uuid, 2, 'Pompes', 10),
  (quest_uuid, 3, 'Sit-ups', 15);
  
  -- Q2 exercises
  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Découverte des supersets';
  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES
  (quest_uuid, 1, 'Squats', 12),
  (quest_uuid, 2, 'Pompes', 10);
  
  -- Q3 exercises
  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Mini Boss – 3 rounds squats & pompes';
  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES
  (quest_uuid, 1, 'Squats', 10),
  (quest_uuid, 2, 'Pompes', 10);
  
  -- Q4 exercises
  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'HIIT débutant 4×20sec';
  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES
  (quest_uuid, 1, 'Jumping jacks', 0),
  (quest_uuid, 2, 'Air squats', 0),
  (quest_uuid, 3, 'Push-ups', 0),
  (quest_uuid, 4, 'Sit-ups', 0);
  
  -- Q5 exercises
  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Superset haut/bas';
  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES
  (quest_uuid, 1, 'Développé haltères', 10),
  (quest_uuid, 2, 'Fentes', 10);
  
  -- Q6 exercises
  SELECT id INTO quest_uuid FROM public.quests WHERE title = 'Boss Final – Dungeon Challenge (15 min for time)';
  INSERT INTO public.quest_exercises (quest_id, order_index, name, target_reps) VALUES
  (quest_uuid, 1, 'Squats haltères', 10),
  (quest_uuid, 2, 'Pompes', 10),
  (quest_uuid, 3, 'Sit-ups', 10);
END $$;

-- Insert badges
INSERT INTO public.badges (slug, name, emoji, condition_type, condition_value, description) VALUES
('novice-sans-cardio', 'Novice sans cardio', '🥉', 'min_sessions', 3, '3 séances complétées dans la campagne.'),
('superset-slayer', 'Superset Slayer', '⚡', 'first_superset', 1, 'Tu as réussi ta première séance en superset.'),
('boss-final-vaincu', 'Boss Final Vaincu', '🏆', 'beat_final_boss', 1, 'Tu as vaincu le Dungeon Challenge.');

-- Create function to handle quest completion
CREATE OR REPLACE FUNCTION public.complete_quest(p_user_id UUID, p_quest_id UUID)
RETURNS JSONB AS $$
DECLARE
  quest_record RECORD;
  profile_record RECORD;
  next_quest_id UUID;
  result JSONB;
BEGIN
  -- Get quest details
  SELECT * INTO quest_record FROM public.quests WHERE id = p_quest_id;
  
  -- Get current profile
  SELECT * INTO profile_record FROM public.profiles WHERE user_id = p_user_id;
  
  -- Update quest status
  UPDATE public.user_quests 
  SET status = 'completed', completed_at = now()
  WHERE user_id = p_user_id AND quest_id = p_quest_id AND status = 'available';
  
  -- Update profile stats
  UPDATE public.profiles SET
    xp_total = xp_total + quest_record.xp_total,
    stat_force = stat_force + quest_record.xp_force,
    stat_endurance = stat_endurance + quest_record.xp_endurance,
    stat_agilite = stat_agilite + quest_record.xp_agilite,
    stat_mental = stat_mental + quest_record.xp_mental,
    level = GREATEST(0, FLOOR((xp_total + quest_record.xp_total) / 200)),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Log XP audit
  INSERT INTO public.audit_xp (user_id, quest_id, delta_force, delta_endurance, delta_agilite, delta_mental, delta_total)
  VALUES (p_user_id, p_quest_id, quest_record.xp_force, quest_record.xp_endurance, quest_record.xp_agilite, quest_record.xp_mental, quest_record.xp_total);
  
  -- Unlock next quest
  SELECT q.id INTO next_quest_id
  FROM public.quests q
  WHERE q.campaign_id = quest_record.campaign_id 
    AND q.order_index = quest_record.order_index + 1;
  
  IF next_quest_id IS NOT NULL THEN
    UPDATE public.user_quests 
    SET status = 'available'
    WHERE user_id = p_user_id AND quest_id = next_quest_id AND status = 'locked';
  END IF;
  
  result := jsonb_build_object(
    'success', true,
    'xp_gained', quest_record.xp_total,
    'next_quest_unlocked', next_quest_id IS NOT NULL
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;