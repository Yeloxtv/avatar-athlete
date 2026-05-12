-- ============================================================
-- FIX 1 : rls_policy_always_true
-- "Enable read access for all users" sur campaigns/quests/quest_exercises
-- sont des politiques FOR ALL avec USING(true) — elles autorisent aussi
-- INSERT/UPDATE/DELETE sans restriction. On les remplace par FOR SELECT only.
-- ============================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON public.campaigns;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.quests;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.quest_exercises;

DROP POLICY IF EXISTS "Public read campaigns"       ON public.campaigns;
DROP POLICY IF EXISTS "Public read quests"          ON public.quests;
DROP POLICY IF EXISTS "Public read quest_exercises" ON public.quest_exercises;

-- Recréer en FOR SELECT uniquement (les données de campagne/quête sont publiques en lecture)
CREATE POLICY "Public read campaigns"       ON public.campaigns       FOR SELECT USING (true);
CREATE POLICY "Public read quests"          ON public.quests          FOR SELECT USING (true);
CREATE POLICY "Public read quest_exercises" ON public.quest_exercises FOR SELECT USING (true);

-- workout_sessions INSERT : WITH CHECK était "true" → restreindre à l'utilisateur connecté
DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.workout_sessions;
CREATE POLICY "Users can insert their own sessions" ON public.workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FIX 2 : anon_security_definer_function_executable
-- Les 3 fonctions SECURITY DEFINER ne doivent pas être appelables
-- par le rôle anon via l'API REST.
-- complete_quest : seuls les utilisateurs connectés peuvent l'appeler
-- handle_new_user : trigger interne, jamais appelé via API
-- initialize_user_quests : réservé aux utilisateurs connectés
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.complete_quest(uuid)           FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()              FROM anon;
REVOKE EXECUTE ON FUNCTION public.initialize_user_quests(uuid, uuid) FROM anon;

-- handle_new_user est un trigger, pas une RPC publique — révoquer aussi authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- ============================================================
-- FIX 3 : pg_graphql_anon_table_exposed
-- Révoquer SELECT de anon sur les tables qui ne doivent pas être
-- accessibles sans connexion.
-- campaigns/quests/quest_exercises/badges/exercises sont publiques → on les garde.
-- Les données utilisateur (profiles, sessions, etc.) ne doivent pas
-- être accessibles sans authentification.
-- ============================================================
REVOKE SELECT ON public.profiles         FROM anon;
REVOKE SELECT ON public.audit_xp         FROM anon;
REVOKE SELECT ON public.user_quests      FROM anon;
REVOKE SELECT ON public.user_badges      FROM anon;
REVOKE SELECT ON public.workout_sessions FROM anon;
REVOKE SELECT ON public.session_rounds   FROM anon;
REVOKE SELECT ON public.exercise_logs    FROM anon;
