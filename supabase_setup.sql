-- =======================================================================
-- SUPABASE AUTH -> PUBLIC USER SYNC TRIGGERS
-- =======================================================================
-- Copy and paste this script into the Supabase SQL Editor to automatically
-- sync all Supabase Auth registrations into your public database catalog.

-- 1. Create the sync trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (
    id, 
    "supabaseId", 
    name, 
    email, 
    "avatarUrl",
    "createdAt", 
    "updatedAt"
  )
  VALUES (
    new.id, -- Use the Supabase Auth UUID as the primary database key
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  )
  ON CONFLICT (email) DO UPDATE
  SET "supabaseId" = EXCLUDED."supabaseId",
      name = COALESCE(public."User".name, EXCLUDED.name),
      "updatedAt" = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger function to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Confirm trigger creation status
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table, 
  action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'users';
