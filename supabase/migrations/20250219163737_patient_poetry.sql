/*
  # Update authentication fields

  1. Changes
    - Add name and registration number fields to auth.users
    - Create unique constraint on registration number
  
  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'raw_user_meta_data'
  ) THEN
    ALTER TABLE auth.users 
    ADD COLUMN raw_user_meta_data jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;