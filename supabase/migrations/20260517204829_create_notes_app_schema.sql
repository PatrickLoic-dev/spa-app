/*
  # Notes App Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `color` (text, hex color)
      - `created_at` (timestamptz)
    - `notes`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text)
      - `category_id` (uuid, fk to categories)
      - `bg_color` (text, hex color)
      - `is_favorite` (boolean, default false)
      - `is_archived` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - RLS enabled on both tables
    - Public read/write for demo purposes (no auth)
    - Policies scoped to anon role
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text NOT NULL DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  bg_color text DEFAULT '#ffffff',
  is_favorite boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert categories"
  ON categories FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update categories"
  ON categories FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete categories"
  ON categories FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Public can read notes"
  ON notes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert notes"
  ON notes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update notes"
  ON notes FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete notes"
  ON notes FOR DELETE
  TO anon
  USING (true);

INSERT INTO categories (name, color) VALUES
  ('Personnel', '#10b981'),
  ('Travail', '#3b82f6'),
  ('Idées', '#f59e0b')
ON CONFLICT (name) DO NOTHING;
