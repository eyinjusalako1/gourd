-- Complete RLS Fix for user_profiles
-- This fixes both INSERT and UPDATE policies to work with upsert operations
-- Run this in your Supabase SQL Editor

-- Step 1: Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', r.policyname);
    END LOOP;
END $$;

-- Step 3: Create INSERT policy (critical for upsert when profile doesn't exist)
-- WITH CHECK validates the new row being inserted
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 4: Create UPDATE policy (critical for upsert when profile exists)
-- USING checks existing rows, WITH CHECK validates the updated row
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 5: Create SELECT policy (for reading profiles)
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Step 6: Verify all policies are correct
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN '✓ USING: ' || substring(qual::text, 1, 50)
    ELSE '✗ No USING'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN '✓ WITH CHECK: ' || substring(with_check::text, 1, 50)
    ELSE '✗ No WITH CHECK'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY 
  CASE cmd
    WHEN 'SELECT' THEN 1
    WHEN 'INSERT' THEN 2
    WHEN 'UPDATE' THEN 3
    ELSE 4
  END;

