-- Fix RLS Policies for user_profiles table
-- This script will safely update existing policies or create new ones
-- Run this in your Supabase SQL Editor

-- Step 1: Enable RLS (safe to run multiple times)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on user_profiles (we'll recreate them)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', r.policyname);
    END LOOP;
END $$;

-- Step 3: Create the policies fresh
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile (CRITICAL for avatar uploads)
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 4: Verify the policies were created
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual::text
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check::text
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;



