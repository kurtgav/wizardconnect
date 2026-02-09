-- SAFER migration: Add missing columns if they don't exist
-- This will NOT delete any data

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

-- Step 2: Add missing columns using safer syntax
ALTER TABLE public.matches
    ADD COLUMN IF NOT EXISTS user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.matches
    ADD COLUMN IF NOT EXISTS matched_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.matches
    ADD COLUMN IF NOT EXISTS compatibility_score DECIMAL(5,2) NOT NULL DEFAULT 0.0;

ALTER TABLE public.matches
    ADD COLUMN IF NOT EXISTS rank INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.matches
    ADD COLUMN IF NOT EXISTS is_mutual_crush BOOLEAN DEFAULT FALSE;

ALTER TABLE public.matches
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Step 3: Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies
DROP POLICY IF EXISTS "Users can view their own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can insert their own matches" ON public.matches;

-- Step 5: Create policies
CREATE POLICY "Users can view their own matches"
    ON public.matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own matches"
    ON public.matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_compatibility ON public.matches(compatibility_score DESC);

-- Success message
SELECT 'Matches table migration completed successfully' as status;
