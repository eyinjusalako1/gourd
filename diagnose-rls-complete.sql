-- Complete RLS Diagnosis
-- Run this to see exactly what's happening

-- 1. Check current user (should show your authenticated user)
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- 2. Check all policies on user_profiles
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual as using_clause_full,
  with_check as with_check_clause_full
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- 3. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';

-- 4. Check table structure - especially the id column type
SELECT 
  column_name,
  data_type,
  udt_name,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name IN ('id', 'avatar_url')
ORDER BY ordinal_position;

-- 5. Check if there are any existing profiles
SELECT COUNT(*) as profile_count FROM user_profiles;

-- 6. List a few user IDs from auth.users to compare format
SELECT id, email FROM auth.users LIMIT 3;



