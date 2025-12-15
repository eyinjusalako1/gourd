-- Add cover_image_url column to user_profiles table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- The column will automatically be included in existing RLS policies
-- since they allow users to update their own profiles

