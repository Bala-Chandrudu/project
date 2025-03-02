/*
  # Add access key system for leave applications

  1. New Tables
    - `access_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `key` (text, unique)
      - `name` (text)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `last_used` (timestamptz)

  2. Security
    - Enable RLS on `access_keys` table
    - Add policies for users to manage their own keys
*/

-- Create access keys table
CREATE TABLE IF NOT EXISTS access_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  key text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  name text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz
);

-- Enable RLS
ALTER TABLE access_keys ENABLE ROW LEVEL SECURITY;

-- Policies for access_keys table
CREATE POLICY "Users can view their own access keys"
  ON access_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own access keys"
  ON access_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own access keys"
  ON access_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own access keys"
  ON access_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);