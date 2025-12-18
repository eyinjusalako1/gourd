-- Test if the UPDATE policy works correctly
-- This simulates what happens when updating a profile

-- First, check the full policy details
SELECT 
  policyname,
  cmd,
  qual as using_clause_full,
  with_check as with_check_clause_full
FROM pg_policies 
WHERE tablename = 'user_profiles'
  AND cmd = 'UPDATE';

-- If the WITH CHECK clause is missing or NULL, we need to recreate the policy
-- Run this if WITH CHECK is missing:
/*
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
*/



