-- Fix matches table - add missing columns safely
-- This will NOT delete any existing data

-- Step 1: Drop old policies first (safe)
DROP POLICY IF EXISTS "Users can view their own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can insert their own matches" ON public.matches;

-- Step 2: Add missing columns one by one
DO $$
BEGIN
    -- Add user_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added user_id column';
    END IF;

    -- Add matched_user_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'matched_user_id'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN matched_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added matched_user_id column';
    END IF;

    -- Add compatibility_score if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'compatibility_score'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN compatibility_score DECIMAL(5,2);
        RAISE NOTICE 'Added compatibility_score column';
    END IF;

    -- Add rank if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'rank'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN rank INTEGER DEFAULT 1;
        RAISE NOTICE 'Added rank column';
    END IF;

    -- Add is_mutual_crush if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'is_mutual_crush'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN is_mutual_crush BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_mutual_crush column';
    END IF;

    -- Add created_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND table_schema = 'public' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added created_at column';
    END IF;
END $$;

-- Step 3: Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies (no IF EXISTS on CREATE)
CREATE POLICY "Users can view their own matches"
    ON public.matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own matches"
    ON public.matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_compatibility ON public.matches(compatibility_score DESC);

-- Success message
SELECT 'Matches table migration completed successfully' as status;
