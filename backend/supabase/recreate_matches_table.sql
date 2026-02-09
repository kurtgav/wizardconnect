-- Comprehensive fix for matches table
-- Run this in Supabase SQL Editor to fix match generation errors

-- Step 1: Drop and recreate matches table completely
DO $$
BEGIN
    -- Drop matches table if it exists
    DROP TABLE IF EXISTS public.matches CASCADE;

    -- Drop indexes if they exist
    DROP INDEX IF EXISTS public.idx_matches_user_id CASCADE;
    DROP INDEX IF EXISTS public.idx_matches_compatibility CASCADE;
END $$;

-- Step 2: Create matches table with correct schema
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    matched_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    compatibility_score DECIMAL(5,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    rank INTEGER NOT NULL,
    is_mutual_crush BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, matched_user_id)
);

-- Step 3: Enable Row Level Security
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
CREATE POLICY "Users can view their own matches"
    ON public.matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own matches"
    ON public.matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own matches"
    ON public.matches FOR DELETE
    USING (auth.uid() = user_id);

-- Step 5: Create indexes for performance
CREATE INDEX idx_matches_user_id ON public.matches(user_id);
CREATE INDEX idx_matches_compatibility ON public.matches(compatibility_score DESC);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Matches table has been successfully recreated with correct schema';
END $$;
