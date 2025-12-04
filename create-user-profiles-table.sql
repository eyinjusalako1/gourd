-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  role TEXT CHECK (role IN ('disciple', 'steward')),
  interests TEXT[],
  availability TEXT[],
  notif_cadence TEXT CHECK (notif_cadence IN ('daily', 'weekly', 'off')),
  notif_channel TEXT CHECK (notif_channel IN ('push', 'email')),
  quiet_hours_start TEXT,
  quiet_hours_end TEXT,
  dismissed_suggestions TEXT[],
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  preferred_fellowship_id UUID,
  last_activity_at TIMESTAMPTZ,
  accessibility JSONB DEFAULT '{}'::jsonb,
  personalization_enabled JSONB DEFAULT '{}'::jsonb,
  profile_complete BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS user_profiles_id_idx ON public.user_profiles(id);

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles(email);

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON public.user_profiles(role);

-- Create index on preferred_fellowship_id
CREATE INDEX IF NOT EXISTS user_profiles_fellowship_idx ON public.user_profiles(preferred_fellowship_id);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

