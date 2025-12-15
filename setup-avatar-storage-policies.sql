-- Storage Bucket RLS Policies for Avatar Uploads
-- Run this SQL in your Supabase SQL Editor to enable avatar uploads
-- 
-- IMPORTANT: Make sure you have created a storage bucket named "avatars" (or "Avatars")
-- in your Supabase Storage dashboard and set it to PUBLIC
--
-- Steps to create the bucket:
-- 1. Go to Storage > Buckets in your Supabase dashboard
-- 2. Click "New bucket"
-- 3. Name it "avatars" (lowercase recommended for consistency)
-- 4. Make it PUBLIC (uncheck "Private bucket")
-- 5. Click "Create bucket"

-- Drop existing policies if they exist (safe to run multiple times)
-- Handle both lowercase "avatars" and capitalized "Avatars" bucket names
DO $$ 
BEGIN
  -- Drop policies for lowercase bucket
  DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
  
  -- Drop policies for capitalized bucket
  DROP POLICY IF EXISTS "Users can upload their own Avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own Avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own Avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Public can view Avatars" ON storage.objects;
END $$;

-- Policy: Allow users to upload avatars to their own folder
-- Path format in code: {bucketName.toLowerCase()}/{userId}/{timestamp}-{filename}
-- Example: bucket "Avatars", user "abc123" -> path "avatars/abc123/timestamp-file.jpg"
-- The 'name' field in storage.objects is the full path: "avatars/abc123/timestamp-file.jpg"
-- When split by '/': ['avatars', 'abc123', 'timestamp-file.jpg']
-- PostgreSQL arrays are 1-indexed: [1]='avatars', [2]='abc123' (user ID), [3]='timestamp-file.jpg'
-- So [2] is the user ID
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  (bucket_id = 'avatars' OR bucket_id = 'Avatars' OR bucket_id = 'avatar' OR bucket_id = 'Avatar') AND
  auth.uid()::text = (string_to_array(name, '/'))[2]
);

-- Policy: Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
USING (
  (bucket_id = 'avatars' OR bucket_id = 'Avatars' OR bucket_id = 'avatar' OR bucket_id = 'Avatar') AND
  auth.uid()::text = (string_to_array(name, '/'))[2]
)
WITH CHECK (
  (bucket_id = 'avatars' OR bucket_id = 'Avatars' OR bucket_id = 'avatar' OR bucket_id = 'Avatar') AND
  auth.uid()::text = (string_to_array(name, '/'))[2]
);

-- Policy: Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
USING (
  (bucket_id = 'avatars' OR bucket_id = 'Avatars' OR bucket_id = 'avatar' OR bucket_id = 'Avatar') AND
  auth.uid()::text = (string_to_array(name, '/'))[2]
);

-- Policy: Allow public to view avatars (since bucket is public)
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars' OR bucket_id = 'Avatars' OR bucket_id = 'avatar' OR bucket_id = 'Avatar');

-- Verify the policies were created
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
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

