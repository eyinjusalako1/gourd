-- Test manual insert to see what error we get
-- This will help us understand the RLS issue
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users

-- First, get your user ID
SELECT id, email FROM auth.users LIMIT 5;

-- Then try to manually insert (this will fail with RLS, but shows us the exact error)
-- Uncomment and replace YOUR_USER_ID_HERE with an actual user ID:
/*
INSERT INTO user_profiles (id, avatar_url, updated_at)
VALUES ('YOUR_USER_ID_HERE', 'https://example.com/test.jpg', NOW());
*/



