-- Verify RLS Policies are correctly configured
-- Run this to check if your policies have the correct clauses

SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN qual::text
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN with_check::text
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY 
  CASE cmd
    WHEN 'SELECT' THEN 1
    WHEN 'INSERT' THEN 2
    WHEN 'UPDATE' THEN 3
    ELSE 4
  END,
  policyname;

-- Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';

