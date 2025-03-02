/*
  # Add user details to leave applications

  1. Changes
    - Add columns to `leave_applications`:
      - `user_name` (text)
      - `registration_number` (text)
    - Remove status column
*/

DO $$ 
BEGIN
  ALTER TABLE leave_applications 
    ADD COLUMN user_name text NOT NULL,
    ADD COLUMN registration_number text NOT NULL;

  ALTER TABLE leave_applications 
    DROP COLUMN status;
END $$;