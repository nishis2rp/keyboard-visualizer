-- Create releases table for database-driven release notes
CREATE TABLE IF NOT EXISTS releases (
  id BIGSERIAL PRIMARY KEY,
  version VARCHAR(20) NOT NULL UNIQUE,
  release_date DATE NOT NULL,
  title_en VARCHAR(200) NOT NULL,
  title_ja VARCHAR(200) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create release_changes table for individual changes within a release
CREATE TABLE IF NOT EXISTS release_changes (
  id BIGSERIAL PRIMARY KEY,
  release_id BIGINT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  category VARCHAR(20) NOT NULL CHECK (category IN ('feature', 'improvement', 'fix', 'breaking')),
  description_en TEXT NOT NULL,
  description_ja TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(release_id, display_order)
);

-- Create indexes for performance
CREATE INDEX idx_releases_version ON releases(version);
CREATE INDEX idx_releases_display_order ON releases(display_order DESC);
CREATE INDEX idx_release_changes_release_id ON release_changes(release_id);
CREATE INDEX idx_release_changes_display_order ON release_changes(release_id, display_order);

-- Enable Row Level Security
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_changes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to releases"
  ON releases FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to release_changes"
  ON release_changes FOR SELECT
  USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_releases_updated_at
  BEFORE UPDATE ON releases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE releases IS 'Database-driven release notes with version information';
COMMENT ON TABLE release_changes IS 'Individual changes/features for each release';
COMMENT ON COLUMN releases.display_order IS 'Order for displaying releases (0 = latest, higher = older)';
COMMENT ON COLUMN release_changes.category IS 'Type of change: feature, improvement, fix, or breaking';
