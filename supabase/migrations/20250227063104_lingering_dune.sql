/*
  # Add phone column to leave_applications table

  1. Changes
    - Add `phone` column to the `leave_applications` table
  
  2. Notes
    - This migration adds a phone column to store the applicant's contact number
    - The column is nullable to maintain compatibility with existing records
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leave_applications' AND column_name = 'phone'
  ) THEN
    ALTER TABLE leave_applications ADD COLUMN phone text;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leave_applications' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE leave_applications ADD COLUMN user_name text;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leave_applications' AND column_name = 'registration_number'
  ) THEN
    ALTER TABLE leave_applications ADD COLUMN registration_number text;
  END IF;
END $$;