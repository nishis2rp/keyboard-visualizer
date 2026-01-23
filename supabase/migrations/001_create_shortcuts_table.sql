-- Create shortcuts table
CREATE TABLE IF NOT EXISTS shortcuts (
  id BIGSERIAL PRIMARY KEY,
  application VARCHAR(50) NOT NULL,
  keys VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(application, keys)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_shortcuts_application ON shortcuts(application);
CREATE INDEX IF NOT EXISTS idx_shortcuts_keys ON shortcuts(keys);

-- Enable Row Level Security (RLS)
ALTER TABLE shortcuts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON shortcuts
  FOR SELECT
  USING (true);

-- Add comment
COMMENT ON TABLE shortcuts IS 'Keyboard shortcuts for various applications';
