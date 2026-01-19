-- Enable Row Level Security for the games table
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for reading games
CREATE POLICY "Allow read access to games" ON games
FOR SELECT
USING (true);

-- Create RLS policy for inserting games
CREATE POLICY "Allow insert access to games" ON games
FOR INSERT
WITH CHECK (true);

-- Create RLS policy for updating games
CREATE POLICY "Allow update access to games" ON games
FOR UPDATE
USING (true);

-- Enable Row Level Security for the teams table
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for reading teams
CREATE POLICY "Allow read access to teams" ON teams
FOR SELECT
USING (true);

-- Create RLS policy for inserting teams
CREATE POLICY "Allow insert access to teams" ON teams
FOR INSERT
WITH CHECK (true);

-- Create RLS policy for updating teams
CREATE POLICY "Allow update access to teams" ON teams
FOR UPDATE
USING (true);