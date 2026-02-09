-- SAFER migration: Add missing columns if they don't exist
-- This will NOT delete any data, just add missing columns

-- Step 1: Ensure matches table exists
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

-- Step 2: Add missing columns to matches table (won't fail if they exist)
DO $$
BEGIN
    -- Add user_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add matched_user_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'matched_user_id'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN matched_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add compatibility_score if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'compatibility_score'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN compatibility_score DECIMAL(5,2) NOT NULL DEFAULT 0.0;
    END IF;

    -- Add rank if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'rank'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN rank INTEGER NOT NULL DEFAULT 0;
    END IF;

    -- Add is_mutual_crush if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'is_mutual_crush'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN is_mutual_crush BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add created_at if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    RAISE NOTICE 'Matches table columns verified/added successfully';
END $$;

-- Step 3: Enable RLS and create policies
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own matches"
    ON public.matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own matches"
    ON public.matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_compatibility ON public.matches(compatibility_score DESC);

-- Success message
SELECT 'Matches table migration completed successfully' as status;
