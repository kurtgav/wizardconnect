-- FIX FOR MISSING RANK COLUMN
-- This script ensures both matches and crushes tables have the rank column

DO $$
BEGIN
    -- 1. Fix matches table rank column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'matches' AND column_name = 'rank'
    ) THEN
        ALTER TABLE public.matches ADD COLUMN rank INTEGER NOT NULL DEFAULT 1;
        RAISE NOTICE 'Added rank column to matches';
    END IF;

    -- 2. Fix crushes table rank column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'crushes' AND column_name = 'rank'
    ) THEN
        ALTER TABLE public.crushes ADD COLUMN rank INTEGER NOT NULL DEFAULT 1;
        RAISE NOTICE 'Added rank column to crushes';
    END IF;
END $$;

SELECT 'Rank column fix completed' as status;
