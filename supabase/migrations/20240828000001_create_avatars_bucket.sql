-- Migration: Create public 'avatars' storage bucket and policies
-- Run this in your Supabase SQL Editor if the 'avatars' bucket is missing.

-- 1. Create the 'avatars' bucket (Make public = true so avatar images can be loaded)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar." ON storage.objects;

-- 3. Policy: Anyone can view avatars (Public Access)
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- 4. Policy: Authenticated users can upload their own avatar
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Policy: Users can update/overwrite their own avatar
CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 6. Policy: Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
