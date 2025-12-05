-- Fix INSERT policy for user_profiles
-- The error "new row violates row-level security policy" means the INSERT policy isn't working
-- Run this to fix it

-- First, check current INSERT policy
SELECT 
  policyname,
  cmd,
  qual as using_clause,
  with_check as with_check_clause
FROM pg_policies 
WHERE tablename = 'user_profiles'
  AND cmd = 'INSERT';

-- Drop and recreate INSERT policy with proper WITH CHECK clause
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also ensure UPDATE policy has both USING and WITH CHECK
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Verify all policies
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual::text
    ELSE 'No USING'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check::text
    ELSE 'No WITH CHECK'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

