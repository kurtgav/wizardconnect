-- Fix function search_path warnings
-- This sets search_path to '$schema' for better security

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Update update_conversation_last_message function
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET last_message = NEW.content,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Update add_admin function
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

    -- Add to admin_users with created_by tracking
    INSERT INTO public.admin_users (user_id, email, created_by)
    VALUES (target_user_id, user_email, auth.uid()::text)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Update remove_admin function
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Update is_admin function (if it exists)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;
