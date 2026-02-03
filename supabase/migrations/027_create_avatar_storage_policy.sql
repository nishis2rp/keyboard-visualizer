-- Helper function to extract user ID from object name
-- Assumes object names are in the format: <user_id>-<random_string>.<extension>
CREATE OR REPLACE FUNCTION name_to_auth_uid(object_name TEXT)
RETURNS TEXT AS $$
SELECT SPLIT_PART(object_name, '-', 1);
$$ LANGUAGE SQL IMMUTABLE;

-- Create a storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the avatars bucket
-- Allow authenticated users to insert files into the 'avatars' folder
CREATE POLICY "Allow authenticated user to upload avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = name_to_auth_uid(name));

-- Allow anyone to view avatar images
CREATE POLICY "Allow public read access to avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to update their own avatar
CREATE POLICY "Allow authenticated user to update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = name_to_auth_uid(name));

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Allow authenticated user to delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = name_to_auth_uid(name));