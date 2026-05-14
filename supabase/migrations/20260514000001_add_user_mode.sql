-- Add user_mode to profiles
-- NULL = not yet chosen → triggers onboarding on next login
-- 'guided'     → beginner, follows public campaigns with progressive unlock
-- 'autonomous' → intermediate/advanced, manages their own weekly program

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_mode TEXT
  CHECK (user_mode IN ('guided', 'autonomous'))
  DEFAULT NULL;

-- Optional: auto-assign existing users based on whether they already have a personal program
-- Users with a personal campaign → autonomous, everyone else → guided
UPDATE public.profiles p
SET user_mode = 'autonomous'
WHERE EXISTS (
  SELECT 1 FROM public.campaigns c
  WHERE c.owner_user_id = p.user_id
  AND c.is_active = true
);

UPDATE public.profiles
SET user_mode = 'guided'
WHERE user_mode IS NULL;
