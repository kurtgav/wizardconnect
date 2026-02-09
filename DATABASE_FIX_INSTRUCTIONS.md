# 🚨 CRITICAL DATABASE ISSUES - FIX INSTRUCTIONS

## Issues Identified

1. **Profile data disappearing on login/reload**
2. **Matches generation failing with "column user_id does not exist"**

## Step 1: Run Database Migrations (REQUIRED)

### Fix Matches Table Schema

Run this SQL in **Supabase Dashboard → SQL Editor**:

**File**: `backend/supabase/recreate_matches_table.sql`

This will:
- Drop and recreate the `matches` table with correct schema
- Ensure `user_id`, `matched_user_id`, `compatibility_score`, `rank`, `is_mutual_crush`, `created_at` columns exist
- Set up proper RLS policies
- Add performance indexes

### Fix Surveys Table Schema

If not already done, run:

**File**: `backend/supabase/fix_surveys_table.sql`

This will:
- Ensure `responses`, `personality_type`, `interests`, `values`, `lifestyle`, `is_complete`, `completed_at`, `updated_at` columns exist
- Fix RLS policies
- Add triggers

## Step 2: Check Render Logs for DEBUG Messages

After migrations are run and backend is deployed, check the logs:

1. Go to Render Dashboard
2. Click on your service (wizard-connect-backend)
3. Click "Logs"
4. Look for these DEBUG messages:

### Profile Loading Logs:
```
DEBUG: Fetching profile for userID=<uuid>, email=<email>
DEBUG: User found in database: <user data>
```

**If you see**:
```
DEBUG: User not found in database, creating shell user
ERROR: Failed to create shell user: <error>
```
→ This means the `users` table schema is also broken

### Profile Update Logs:
```
DEBUG: Updating profile for userID=<uuid>, email=<email>
DEBUG: User found in database: <user data>
DEBUG: Updating user with data: <user data>
DEBUG: User profile updated successfully
```

**If you see**:
```
DATABASE UPDATE ERROR: <error>
```
→ This means the users table update is failing

### Match Generation Logs:
```
ERROR: Failed to generate matches: <error>
```

**If you see**:
```
ERROR: pq: column "user_id" does not exist
```
→ The matches table wasn't recreated properly

## Step 3: Use Diagnostic Endpoint

Visit this URL (admin only):
```
https://wizardconnect-backend.onrender.com/api/v1/debug/schema
```

This will return:
```json
{
  "matches_table_columns": [
    "id (uuid)",
    "user_id (uuid)",
    "matched_user_id (uuid)",
    "compatibility_score (numeric)",
    "rank (integer)",
    "is_mutual_crush (boolean)",
    "created_at (timestamp with time zone)"
  ],
  "matches_count": 10,
  "database_status": "connected"
}
```

**Expected columns**:
- ✅ id (uuid)
- ✅ user_id (uuid)
- ✅ matched_user_id (uuid)
- ✅ compatibility_score (numeric)
- ✅ rank (integer)
- ✅ is_mutual_crush (boolean)
- ✅ created_at (timestamp with time zone)

**If `user_id` is missing**:
- Run `recreate_matches_table.sql` again
- Check Supabase SQL Editor for errors

## Step 4: Test Everything

After migrations and verification:

### Test 1: Profile
1. Logout from app
2. Login again
3. Go to `/profile`
4. **Profile data should load and display**

If not working:
- Check Render logs for DEBUG messages
- Check diagnostic endpoint

### Test 2: Survey
1. Go to `/survey`
2. Complete survey
3. Submit
4. **Should save without errors**

If not working:
- Check Render logs
- Run `fix_surveys_table.sql`

### Test 3: Matches
1. Go to `/matches`
2. Click "Find Matches"
3. **Should generate and display matches**

If not working:
- Check Render logs for actual error
- Run `recreate_matches_table.sql`
- Check diagnostic endpoint

## Common Issues & Solutions

### Issue: "column user_id does not exist"
**Cause**: matches table schema is outdated
**Solution**: Run `recreate_matches_table.sql`

### Issue: Profile data empty after login
**Cause**: User not in users table
**Solution**: The auto-create shell user should fix this automatically. Check logs for errors.

### Issue: Survey save fails
**Cause**: surveys table schema issues
**Solution**: Run `fix_surveys_table.sql`

## Deployment Status

After pushing changes:
- **Backend (Render)**: 2-3 minutes to deploy
- **Frontend (Vercel)**: 1-2 minutes to deploy

Wait for deployments to complete before testing!

## Contact for Support

If issues persist after running all migrations and checking logs:
1. Take screenshots of Render logs
2. Copy output from diagnostic endpoint
3. Share both for further investigation
