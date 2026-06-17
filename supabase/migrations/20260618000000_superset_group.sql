-- Supersets en musculation : regroupement d'exercices au sein d'une quête.
-- Les exercices d'une même quête partageant la même valeur de superset_group
-- (et contigus par order_index) forment un superset. NULL = exercice simple.
ALTER TABLE public.quest_exercises
  ADD COLUMN IF NOT EXISTS superset_group integer;
