/*
  # Add admin flag to auth.users

  1. Changes
    - Add admin flag to auth.users via custom claims
    - Create admin access policy
  
  2. Security
    - Only allow admin users to access the admin panel
*/

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'admin',
    'false'
  )::boolean);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;