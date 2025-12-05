-- Create a database function that can update profiles with elevated privileges
-- This bypasses RLS for the function execution
-- WARNING: This function runs with SECURITY DEFINER, meaning it runs with the creator's privileges

CREATE OR REPLACE FUNCTION update_user_profile_avatar(
  p_user_id UUID,
  p_avatar_url TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update or insert the profile
  INSERT INTO user_profiles (id, avatar_url, updated_at)
  VALUES (p_user_id, p_avatar_url, NOW())
  ON CONFLICT (id) 
  DO UPDATE SET 
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_profile_avatar(UUID, TEXT) TO authenticated;

-- Test the function (replace with actual user ID)
-- SELECT update_user_profile_avatar('YOUR_USER_ID_HERE'::UUID, 'https://example.com/avatar.jpg');

