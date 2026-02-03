-- Create a function to delete user account
-- This function will be called from the frontend when a user wants to delete their account

CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user ID from auth context
  current_user_id := auth.uid();

  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete quiz history (child table)
  DELETE FROM quiz_history WHERE user_id = current_user_id;

  -- Delete quiz sessions (child table)
  DELETE FROM quiz_sessions WHERE user_id = current_user_id;

  -- Delete user profile
  DELETE FROM user_profiles WHERE id = current_user_id;

  -- Delete auth user (this is the final step)
  DELETE FROM auth.users WHERE id = current_user_id;

END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- Add comment to function
COMMENT ON FUNCTION delete_user() IS 'Deletes the current authenticated user and all their related data';
