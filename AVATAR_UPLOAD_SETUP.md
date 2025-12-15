# Avatar Upload Setup Guide

## Problem
You're getting this error when trying to upload an avatar:
```
Error: Failed to upload avatar: new row violates row-level security policy
StorageApiError: new row violates row-level security policy
```

## Solution

This error occurs because Supabase Storage buckets need Row Level Security (RLS) policies to allow users to upload files.

### Step 1: Create the Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"** or **"Create bucket"**
5. Configure the bucket:
   - **Name**: `avatars` (lowercase recommended)
   - **Public bucket**: ✅ **CHECKED** (this is important!)
   - **File size limit**: Leave default or set to 5MB
   - **Allowed MIME types**: Leave empty or add: `image/jpeg,image/png,image/gif,image/webp`
6. Click **"Create bucket"**

### Step 2: Set Up Storage RLS Policies

1. In your Supabase Dashboard, go to **SQL Editor**
2. Open the file `setup-avatar-storage-policies.sql` from this project
3. Copy the entire contents of that file
4. Paste it into the SQL Editor
5. Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

The SQL script will:
- Create policies that allow users to upload avatars to their own folder
- Allow users to update/delete their own avatars
- Allow public viewing of avatars (since the bucket is public)

### Step 3: Verify It Works

1. Go back to your app
2. Try uploading an avatar again
3. It should work now!

## Troubleshooting

### If you still get errors:

1. **Check bucket name**: Make sure the bucket name matches exactly (case-sensitive). The code tries: `avatars`, `Avatars`, `avatar`, `Avatar`

2. **Check bucket is public**: 
   - Go to Storage > Buckets
   - Click on your bucket
   - Make sure "Public bucket" is checked

3. **Verify policies were created**:
   - Go to SQL Editor
   - Run: `SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';`
   - You should see 4 policies for avatars

4. **Check file path format**: 
   - The code uploads to: `avatars/{user_id}/{timestamp}-{filename}`
   - Make sure your user ID is valid

5. **Check user authentication**:
   - Make sure you're logged in
   - The policies require `auth.uid()` to match the folder name

## Alternative: Use a Different Bucket Name

If you want to use a different bucket name (e.g., "profile-pictures"):

1. Create the bucket with that name
2. Update the SQL policies to use that bucket name instead of 'avatars'
3. Or update the code in `src/hooks/useUserProfile.ts` to include your bucket name in the `possibleBucketNames` array

