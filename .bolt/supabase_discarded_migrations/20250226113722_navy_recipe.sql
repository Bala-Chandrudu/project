/*
  # Add parent phone column to leave_applications table

  1. Changes
    - Add `parent_phone` column to `leave_applications` table
      - Type: text
      - Initially nullable to handle existing rows
      - Add NOT NULL constraint after setting default value
*/

DO $$ 
BEGIN
  -- First add the column as nullable
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leave_applications' 
    AND column_name = 'parent_phone'
  ) THEN
    -- Add column as nullable first
    ALTER TABLE leave_applications 
    ADD COLUMN parent_phone text;

    -- Set a default value for existing rows
    UPDATE leave_applications
    SET parent_phone = 'Not provided'
    WHERE parent_phone IS NULL;

    -- Now make it NOT NULL
    ALTER TABLE leave_applications
    ALTER COLUMN parent_phone SET NOT NULL;
  END IF;
END $$;