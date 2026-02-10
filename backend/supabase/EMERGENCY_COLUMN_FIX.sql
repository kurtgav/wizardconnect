-- EMERGENCY FIX: Ensure user_id column exists in all tables
-- This fixes the "pq: column user_id does not exist" error

DO $$
BEGIN
    -- 1. Fix surveys table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'surveys' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.surveys ADD COLUMN user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added user_id to surveys';
    END IF;

    -- 2. Fix crushes table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'crushes' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.crushes ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added user_id to crushes';
    END IF;

    -- 3. Fix matches table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added user_id to matches';
    END IF;

    -- 4. Fix matches table (matched_user_id)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND column_name = 'matched_user_id'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN matched_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added matched_user_id to matches';
    END IF;
END $$;

-- Enable RLS and re-create policies just in case
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own survey" ON public.surveys;
CREATE POLICY "Users can manage own survey" ON public.surveys FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.crushes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own crushes" ON public.crushes;
CREATE POLICY "Users can manage own crushes" ON public.crushes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own matches" ON public.matches;
CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT USING (auth.uid() = user_id);

SELECT 'Database self-heal completed' as status;
