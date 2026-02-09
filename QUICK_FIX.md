# 🔧 QUICK FIX - RUN THIS NOW

## Step 1: Fix Matches Table (RUN IN SUPABASE)

Open Supabase Dashboard → SQL Editor and run this:

```sql
-- Copy entire file: backend/supabase/SAFE_fix_matches.sql
-- Paste and click RUN
```

This adds the missing `user_id` column WITHOUT deleting any data.

## Step 2: Test Profile Page

1. Go to https://wizard-connect.vercel.app/profile
2. Fill in your profile
3. Click Save
4. **Profile should save successfully**

## Step 3: Test Matches Page

1. Go to https://wizard-connect.vercel.app/matches
2. Click "Find Matches"
3. **Matches should generate successfully**

## What Was Fixed

1. ✅ Added `SAFE_fix_matches.sql` - adds columns without deleting data
2. ✅ Profile update now uses dynamic SQL - only updates changed fields
3. ✅ Added debug logging to see what's happening

## If Still Broken

Check Render logs for DEBUG messages:
- Go to Render Dashboard
- Click "wizard-connect-backend"
- Click "Logs"

Look for:
```
DEBUG: Fetching profile for userID=...
DEBUG: User found in database: ...
```

## If Profile Still Empty After Login

This means you have a "shell user" with no saved data.

Solution: Fill in your profile and save it. It will persist now.

## Backend Deployed in 2-3 minutes

Wait for deployment before testing!
