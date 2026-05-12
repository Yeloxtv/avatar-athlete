-- Enable RLS on all public tables that have policies but RLS disabled
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_exercises   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_rounds    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_xp          ENABLE ROW LEVEL SECURITY;
