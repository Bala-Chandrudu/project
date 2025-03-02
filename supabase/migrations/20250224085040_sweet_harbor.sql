/*
  # Create leave applications table

  1. New Tables
    - `leave_applications`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `start_date` (date)
      - `end_date` (date)
      - `reason` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `leave_applications` table
    - Add policies for users to:
      - Create their own leave applications
      - Read their own leave applications
*/

CREATE TABLE IF NOT EXISTS leave_applications (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own leave applications
CREATE POLICY "Users can create their own leave applications"
  ON leave_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own leave applications
CREATE POLICY "Users can read their own leave applications"
  ON leave_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);