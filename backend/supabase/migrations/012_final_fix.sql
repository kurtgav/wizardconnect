-- ============================================
-- FINAL SYSTEM RECOVERY SCRIPT
-- ============================================
-- Run this script in Supabase SQL Editor.
-- It will fix the "Table not found" errors and the "user_id" errors.

BEGIN;

-- 1. Fix Admin Users Schema (The root cause of 008 failure)
-- We drop dependent policies first to avoid "column does not exist" errors
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can manage allowlist" ON public.admin_allowlist;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
DROP FUNCTION IF EXISTS public.add_admin CASCADE;
DROP FUNCTION IF EXISTS public.remove_admin CASCADE;

-- Safely recreate admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT DEFAULT 'system'
);

-- Ensure correct columns exist (in case table already existed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_users' AND column_name = 'id') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_users' AND column_name = 'user_id') THEN
        ALTER TABLE public.admin_users RENAME COLUMN id TO user_id;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_users' AND column_name = 'created_by') THEN
        ALTER TABLE public.admin_users ADD COLUMN created_by TEXT DEFAULT 'system';
    END IF;
END $$;


-- 2. Ensure Core Tables Exist (Fixes "Table not found in cache")
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    display_name VARCHAR(100),
    program VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    survey_open_date TIMESTAMPTZ NOT NULL,
    survey_close_date TIMESTAMPTZ NOT NULL,
    profile_update_start_date TIMESTAMPTZ,
    profile_update_end_date TIMESTAMPTZ,
    results_release_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    total_participants INTEGER DEFAULT 0,
    total_matches_generated INTEGER DEFAULT 0,
    algorithm_version TEXT DEFAULT '1.0',
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Fix Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    matched_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    compatibility_score DECIMAL(5,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    rank INTEGER NOT NULL,
    is_mutual_crush BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, matched_user_id)
);
-- Ensure matched_user_id column exists
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS matched_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;


-- 4. Re-Enable Policies (Fixes "Permission denied" or "Empty data")

-- Admin Policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Admins can manage admin_users" ON public.admin_users FOR ALL
    USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Admin status is readable by authenticated users" ON public.admin_users;
CREATE POLICY "Admin status is readable by authenticated users" ON public.admin_users FOR SELECT
    USING (true); -- Allow all auth users to check IF they are admin

-- Stories Policies
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view approved stories" ON public.stories;
CREATE POLICY "Public can view approved stories" ON public.stories FOR SELECT USING (is_approved = TRUE);

DROP POLICY IF EXISTS "Authenticated users can create stories" ON public.stories;
CREATE POLICY "Authenticated users can create stories" ON public.stories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Fix Admin Functions
CREATE OR REPLACE FUNCTION public.add_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    target_user_id UUID;
    is_current_admin BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) INTO is_current_admin;
    IF NOT is_current_admin THEN RAISE EXCEPTION 'Only admins can add new admins'; END IF;
    SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
    IF target_user_id IS NULL THEN RAISE EXCEPTION 'User not found: %', user_email; END IF;
    INSERT INTO public.admin_users (user_id, email, created_by) VALUES (target_user_id, user_email, auth.uid()::text) ON CONFLICT (user_id) DO NOTHING;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.remove_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_current_admin BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) INTO is_current_admin;
    IF NOT is_current_admin THEN RAISE EXCEPTION 'Only admins can remove admins'; END IF;
    DELETE FROM public.admin_users WHERE email = user_email;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.add_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin TO authenticated;


-- 6. GRANT PERMISSIONS (Fixes "404" errors which are actually 403s)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;

-- 7. Force Schema Cache Reload
NOTIFY pgrst, 'reload config';
