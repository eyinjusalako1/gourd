-- Final RLS Fix - Comprehensive solution
-- This addresses potential issues with auth.uid() and upsert operations

-- Step 1: Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (including any with different names)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', r.policyname);
    END LOOP;
END $$;

-- Step 3: Create policies that work with upsert
-- IMPORTANT: For INSERT, we need WITH CHECK to validate the new row
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

-- For UPDATE, we need both USING (to find rows) and WITH CHECK (to validate updates)
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- For SELECT, we need USING to filter rows
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid()::text = id::text);

-- Step 4: Verify policies
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN '✓'
    ELSE '✗'
  END as has_using,
  CASE 
    WHEN with_check IS NOT NULL THEN '✓'
    ELSE '✗'
  END as has_with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- Step 5: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';

