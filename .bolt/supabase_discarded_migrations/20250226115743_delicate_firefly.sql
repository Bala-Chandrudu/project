/*
  # Add two keys limit constraint

  1. Changes
    - Add trigger to enforce maximum of 2 access keys per user
    - Add check constraint for active keys

  2. Security
    - Maintains existing RLS policies
    - Adds server-side enforcement of key limit
*/

-- Create function to check number of keys
CREATE OR REPLACE FUNCTION check_access_keys_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM access_keys
    WHERE user_id = NEW.user_id
  ) >= 2 THEN
    RAISE EXCEPTION 'Maximum of 2 access keys allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce limit
DROP TRIGGER IF EXISTS enforce_access_keys_limit ON access_keys;
CREATE TRIGGER enforce_access_keys_limit
  BEFORE INSERT ON access_keys
  FOR EACH ROW
  EXECUTE FUNCTION check_access_keys_limit();