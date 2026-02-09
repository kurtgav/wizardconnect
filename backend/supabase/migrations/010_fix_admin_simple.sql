-- Disable RLS first
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can manage allowlist" ON public.admin_allowlist;

-- Drop functions
DROP FUNCTION IF EXISTS public.add_admin CASCADE;
DROP FUNCTION IF EXISTS public.remove_admin CASCADE;

-- Add created_by column if missing
ALTER TABLE public.admin_users 
ADD COLUMN IF NOT EXISTS created_by TEXT DEFAULT 'system';

-- Migrate admins from allowlist
INSERT INTO public.admin_users (user_id, email, created_by)
SELECT 
    au.id as user_id,
    au.email,
    'migration_009' as created_by
FROM auth.users au
INNER JOIN public.admin_allowlist al ON au.email = al.email
ON CONFLICT (user_id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing read-only policy if it exists
DROP POLICY IF EXISTS "Admin status is readable by authenticated users" ON public.admin_users;

-- Create simple read-only policy
CREATE POLICY "Admin status is readable by authenticated users"
    ON public.admin_users FOR SELECT
    USING (true);

-- Create campaign policy
CREATE POLICY "Admins can manage campaigns"
    ON public.campaigns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Create allowlist policy
CREATE POLICY "Admins can manage allowlist"
    ON public.admin_allowlist FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Create add_admin function
CREATE OR REPLACE FUNCTION public.add_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    target_user_id UUID;
    is_current_admin BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid()
    ) INTO is_current_admin;
    
    IF NOT is_current_admin THEN
        RAISE EXCEPTION 'Only admins can add new admins';
    END IF;
    
    SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found: %', user_email;
    END IF;
    
    INSERT INTO public.admin_users (user_id, email, created_by)
    VALUES (target_user_id, user_email, auth.uid()::text)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create remove_admin function
CREATE OR REPLACE FUNCTION public.remove_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_current_admin BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid()
    ) INTO is_current_admin;
    
    IF NOT is_current_admin THEN
        RAISE EXCEPTION 'Only admins can remove admins';
    END IF;
    
    DELETE FROM public.admin_users WHERE email = user_email;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin TO authenticated;