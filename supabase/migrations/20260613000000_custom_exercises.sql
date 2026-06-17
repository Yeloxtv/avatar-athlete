-- ============================================================
-- Custom exercises
-- Permettre à un utilisateur de créer ses propres exercices
-- (ex : matériel spécifique à sa salle, variations) quand ils
-- ne sont pas dans la bibliothèque globale.
--
-- La table `exercises` était jusqu'ici un catalogue global en
-- lecture seule (alimenté par l'import ExerciseDB). On ajoute la
-- notion d'exercice "custom" appartenant à un utilisateur.
-- ============================================================

ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS is_custom boolean NOT NULL DEFAULT false;

-- Index pour filtrer rapidement les exercices d'un user
CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON public.exercises (created_by);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- ── Lecture ─────────────────────────────────────────────────
-- Exercices globaux (is_custom = false) visibles par tous,
-- exercices custom visibles uniquement par leur créateur.
DROP POLICY IF EXISTS "Public read exercises"      ON public.exercises;
DROP POLICY IF EXISTS "Anyone can view exercises"   ON public.exercises;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.exercises;
DROP POLICY IF EXISTS "Read global and own custom exercises" ON public.exercises;
CREATE POLICY "Read global and own custom exercises" ON public.exercises
  FOR SELECT USING (is_custom = false OR created_by = auth.uid());

-- ── Création ────────────────────────────────────────────────
-- Un user ne peut insérer que des exercices custom lui appartenant.
DROP POLICY IF EXISTS "Insert own custom exercises" ON public.exercises;
CREATE POLICY "Insert own custom exercises" ON public.exercises
  FOR INSERT WITH CHECK (is_custom = true AND created_by = auth.uid());

-- ── Modification ────────────────────────────────────────────
DROP POLICY IF EXISTS "Update own custom exercises" ON public.exercises;
CREATE POLICY "Update own custom exercises" ON public.exercises
  FOR UPDATE USING (is_custom = true AND created_by = auth.uid())
  WITH CHECK (is_custom = true AND created_by = auth.uid());

-- ── Suppression ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Delete own custom exercises" ON public.exercises;
CREATE POLICY "Delete own custom exercises" ON public.exercises
  FOR DELETE USING (is_custom = true AND created_by = auth.uid());
