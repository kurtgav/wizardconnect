-- ============================================
-- COMPREHENSIVE DATABASE SETUP
-- Run this in Supabase SQL Editor to fix all issues
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    instagram TEXT,
    phone TEXT,
    contact_preference TEXT DEFAULT 'email' CHECK (contact_preference IN ('email', 'phone', 'instagram')),
    visibility TEXT DEFAULT 'matches_only' CHECK (visibility IN ('public', 'matches_only', 'private')),
    year TEXT,
    major TEXT,
    gender TEXT,
    gender_preference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'matches_only' CHECK (visibility IN ('public', 'matches_only', 'private'));
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS contact_preference TEXT DEFAULT 'email' CHECK (contact_preference IN ('email', 'phone', 'instagram'));
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS major TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender_preference TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Matches can view each other" ON public.users;
DROP POLICY IF EXISTS "Public profiles are visible to everyone" ON public.users;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);



CREATE POLICY "Public profiles are visible to everyone"
    ON public.users FOR SELECT
    USING (visibility = 'public');

-- ============================================
-- SURVEYS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    responses JSONB NOT NULL DEFAULT '{}',
    personality_type TEXT,
    interests TEXT[] DEFAULT '{}',
    values TEXT[] DEFAULT '{}',
    lifestyle TEXT,
    is_complete BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own survey" ON public.surveys;
DROP POLICY IF EXISTS "Users can create/update their own survey" ON public.surveys;

CREATE POLICY "Users can view their own survey"
    ON public.surveys FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create/update their own survey"
    ON public.surveys FOR ALL
    USING (auth.uid() = user_id);

-- ============================================
-- CRUSHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.crushes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crush_email TEXT NOT NULL,
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, crush_email)
);

ALTER TABLE public.crushes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own crushes" ON public.crushes;
DROP POLICY IF EXISTS "Users can create their own crushes" ON public.crushes;

CREATE POLICY "Users can view their own crushes"
    ON public.crushes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own crushes"
    ON public.crushes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- MATCHES TABLE
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_matches_user_id ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_compatibility ON public.matches(compatibility_score DESC);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own matches" ON public.matches;

CREATE POLICY "Users can view their own matches"
    ON public.matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Matches can view each other"
    ON public.users FOR SELECT
    USING (
        id IN (
            SELECT matched_user_id FROM matches
            WHERE user_id = auth.uid() AND user_id IS NOT NULL
        )
    );

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    participant2 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_message TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (participant1 < participant2)
);

CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON public.conversations(participant1);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON public.conversations(participant2);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON public.conversations(updated_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;

CREATE POLICY "Users can view their own conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = participant1 OR auth.uid() = participant2);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Senders can update their own messages" ON public.messages;

CREATE POLICY "Users can view messages in their conversations"
    ON public.messages FOR SELECT
    USING (
        conversation_id IN (
            SELECT id FROM conversations
            WHERE participant1 = auth.uid() OR participant2 = auth.uid()
        )
    );

CREATE POLICY "Users can send messages in their conversations"
    ON public.messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        conversation_id IN (
            SELECT id FROM conversations
            WHERE participant1 = auth.uid() OR participant2 = auth.uid()
        )
    );

CREATE POLICY "Senders can update their own messages"
    ON public.messages FOR UPDATE
    USING (sender_id = auth.uid());

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
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

-- ============================================
-- STORIES TABLE
-- ============================================
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

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved stories" ON public.stories;
DROP POLICY IF EXISTS "Authenticated users can create stories" ON public.stories;

CREATE POLICY "Public can view approved stories"
    ON public.stories FOR SELECT
    USING (is_approved = TRUE);

CREATE POLICY "Authenticated users can create stories"
    ON public.stories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- ADMIN USERS TABLE
-- ============================================

-- 1. Drop all admin-related functions first
DROP FUNCTION IF EXISTS public.add_admin CASCADE;
DROP FUNCTION IF EXISTS public.remove_admin CASCADE;

-- 2. Drop old policies that might reference the table
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can manage allowlist" ON public.admin_allowlist;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;

-- 3. Drop table to reset schema (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 4. Create fresh with user_id column to match policies
CREATE TABLE public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT DEFAULT 'system'
);

-- 5. Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 6. Only existing admins can manage admin_users
CREATE POLICY "Admins can manage admin_users"
    ON public.admin_users FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- 7. Recreate admin management policies for other tables
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
CREATE POLICY "Admins can manage campaigns"
    ON public.campaigns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can manage allowlist" ON public.admin_allowlist;
CREATE POLICY "Admins can manage allowlist"
    ON public.admin_allowlist FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- 8. Migrate existing admins from allowlist to admin_users
INSERT INTO public.admin_users (user_id, email, created_by)
SELECT 
    au.id as user_id,
    au.email,
    'migration_008' as created_by
FROM auth.users au
INNER JOIN public.admin_allowlist al ON au.email = al.email
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_surveys_updated_at ON public.surveys;
CREATE TRIGGER update_surveys_updated_at
    BEFORE UPDATE ON public.surveys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stories_updated_at ON public.stories;
CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update conversation last_message and updated_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET last_message = NEW.content,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conversation_on_message ON public.messages;
CREATE TRIGGER update_conversation_on_message
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add admin_users grant for authenticated users to check admin status
GRANT SELECT ON public.admin_users TO authenticated;

GRANT SELECT ON public.stories TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.campaigns TO anon;

-- ============================================
-- FUNCTIONS FOR ADMIN
-- ============================================

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

GRANT EXECUTE ON FUNCTION public.add_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin TO authenticated;
