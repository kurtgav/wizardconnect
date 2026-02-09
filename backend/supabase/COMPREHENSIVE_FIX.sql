-- COMPREHENSIVE FIX FOR ALL DATABASE ISSUES
-- Run this entire script in Supabase SQL Editor
-- This will fix profile updates, matches generation, and user creation

-- =====================================================
-- PART 1: FIX USERS TABLE SCHEMA
-- =====================================================

-- Step 1: Ensure users table has all required columns
DO $$
BEGIN
    -- Check and add year (TEXT) if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'year'
    ) THEN
        ALTER TABLE public.users ADD COLUMN year TEXT;
        RAISE NOTICE 'Added year column to users table';
    END IF;

    -- Check and add major (TEXT) if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'major'
    ) THEN
        ALTER TABLE public.users ADD COLUMN major TEXT;
        RAISE NOTICE 'Added major column to users table';
    END IF;

    -- Check and add gender (TEXT) if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'gender'
    ) THEN
        ALTER TABLE public.users ADD COLUMN gender TEXT;
        RAISE NOTICE 'Added gender column to users table';
    END IF;

    -- Check and add gender_preference (TEXT) if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'gender_preference'
    ) THEN
        ALTER TABLE public.users ADD COLUMN gender_preference TEXT;
        RAISE NOTICE 'Added gender_preference column to users table';
    END IF;

    -- Check and add visibility (TEXT) if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'visibility'
    ) THEN
        ALTER TABLE public.users ADD COLUMN visibility TEXT;
        RAISE NOTICE 'Added visibility column to users table';
    END IF;

    -- Check and add contact_preference (TEXT) if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'contact_preference'
    ) THEN
        ALTER TABLE public.users ADD COLUMN contact_preference TEXT;
        RAISE NOTICE 'Added contact_preference column to users table';
    END IF;

    -- Check and add instagram (TEXT) if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'instagram'
    ) THEN
        ALTER TABLE public.users ADD COLUMN instagram TEXT;
        RAISE NOTICE 'Added instagram column to users table';
    END IF;

    -- Check and add phone (TEXT) if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public' AND column_name = 'phone'
    ) THEN
        ALTER TABLE public.users ADD COLUMN phone TEXT;
        RAISE NOTICE 'Added phone column to users table';
    END IF;
END $$;

-- =====================================================
-- PART 2: FIX MATCHES TABLE SCHEMA
-- =====================================================

-- Step 1: Drop old policies
DROP POLICY IF EXISTS "Users can view their own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can insert their own matches" ON public.matches;

-- Step 2: Ensure matches table exists and has correct columns
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

-- Step 3: Add any missing columns to matches table
DO $$
BEGIN
    -- Add user_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added user_id column to matches table';
    END IF;

    -- Add matched_user_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'matched_user_id'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN matched_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added matched_user_id column to matches table';
    END IF;

    -- Add compatibility_score if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'compatibility_score'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN compatibility_score DECIMAL(5,2) NOT NULL DEFAULT 0.0;
        RAISE NOTICE 'Added compatibility_score column to matches table';
    END IF;

    -- Add rank if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'rank'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN rank INTEGER NOT NULL DEFAULT 1;
        RAISE NOTICE 'Added rank column to matches table';
    END IF;

    -- Add is_mutual_crush if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'is_mutual_crush'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN is_mutual_crush BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_mutual_crush column to matches table';
    END IF;

    -- Add created_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to matches table';
    END IF;
END $$;

-- Step 4: Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
CREATE POLICY "Users can view their own matches"
    ON public.matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own matches"
    ON public.matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_compatibility ON public.matches(compatibility_score DESC);

-- =====================================================
-- PART 3: ENABLE RLS ON USERS TABLE
-- =====================================================

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create/update RLS policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check users table columns
SELECT 'Users table columns:' as info, array_agg(column_name ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public';

-- Check matches table columns
SELECT 'Matches table columns:' as info, array_agg(column_name ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'matches' AND table_schema = 'public';

-- Success message
SELECT '========================================
COMPREHENSIVE FIX COMPLETED SUCCESSFULLY!
========================================' as status;

SELECT '
1. Users table: All required columns added/verified
2. Matches table: All required columns added/verified
3. RLS policies: Created/enabled
4. Indexes: Created

NEXT STEPS:
- Test /profile page (should load your data)
- Fill in profile and save (should work)
- Test /matches page (click Find Matches, should work)

If issues persist, check Render logs for DEBUG messages.' as instructions;
