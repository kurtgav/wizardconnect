-- ============================================
-- FIX ADMIN_USERS TABLE SCHEMA
-- ============================================

-- Step 1: Disable RLS to avoid circular reference issues
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all policies that might cause issues
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can manage allowlist" ON public.admin_allowlist;

-- Step 3: Drop admin functions that reference the table
DROP FUNCTION IF EXISTS public.add_admin CASCADE;
DROP FUNCTION IF EXISTS public.remove_admin CASCADE;

-- Step 4: Check current schema and migrate data if needed
DO $$
DECLARE
    has_user_id BOOLEAN;
    has_id BOOLEAN;
BEGIN
    -- Check which columns exist
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_users' 
        AND column_name = 'user_id'
    ) INTO has_user_id;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_users' 
        AND column_name = 'id'
    ) INTO has_id;
    
    -- If table has 'id' instead of 'user_id', recreate it
    IF has_id AND NOT has_user_id THEN
        RAISE NOTICE 'Migrating admin_users from id to user_id schema';
        
        -- Backup existing data
        CREATE TEMP TABLE admin_users_backup AS SELECT * FROM public.admin_users;
        
        -- Drop and recreate table
        DROP TABLE public.admin_users CASCADE;
        
        CREATE TABLE public.admin_users (
            user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            created_by TEXT DEFAULT 'system'
        );
        
        -- Restore data
        INSERT INTO public.admin_users (user_id, email, created_at, created_by)
        SELECT id, email, created_at, 'migration' FROM admin_users_backup
        ON CONFLICT (user_id) DO NOTHING;
        
        DROP TABLE admin_users_backup;
    END IF;
END $$;

-- Step 5: Add created_by column if it doesn't exist
ALTER TABLE public.admin_users 
ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'system';

-- Step 6: Migrate admins from allowlist to admin_users
INSERT INTO public.admin_users (user_id, email, created_by)
SELECT 
    au.id as user_id,
    au.email,
    'migration_008' as created_by
FROM auth.users au
INNER JOIN public.admin_allowlist al ON au.email = al.email
ON CONFLICT (user_id) DO NOTHING;

-- Step 7: Enable RLS with simple policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Simple policy: allow authenticated users to see admin status (read-only)
CREATE POLICY "Admin status is readable by authenticated users"
    ON public.admin_users FOR SELECT
    USING (true);

-- Step 8: Recreate campaign and allowlist policies using admin_users
CREATE POLICY "Admins can manage campaigns"
    ON public.campaigns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage allowlist"
    ON public.admin_allowlist FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Step 9: Recreate admin functions with proper checks
CREATE OR REPLACE FUNCTION public.add_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    target_user_id UUID;
    is_current_admin BOOLEAN;
BEGIN
    -- Check if current user is admin
    SELECT EXISTS(
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid()
    ) INTO is_current_admin;
    
    IF NOT is_current_admin THEN
        RAISE EXCEPTION 'Only admins can add new admins';
    END IF;
    
    -- Get the target user ID
    SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found: %', user_email;
    END IF;
    
    -- Add to admin_users
    INSERT INTO public.admin_users (user_id, email, created_by)
    VALUES (target_user_id, user_email, auth.uid()::text)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.remove_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_current_admin BOOLEAN;
BEGIN
    -- Check if current user is admin
    SELECT EXISTS(
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid()
    ) INTO is_current_admin;
    
    IF NOT is_current_admin THEN
        RAISE EXCEPTION 'Only admins can remove admins';
    END IF;
    
    -- Remove from admin_users
    DELETE FROM public.admin_users WHERE email = user_email;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Grant permissions
GRANT SELECT ON public.admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin TO authenticated;

-- Step 11: Verify the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'admin_users'
AND table_schema = 'public'
ORDER BY ordinal_position;