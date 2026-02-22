-- Create alternative_shortcuts_groups table
-- This table groups shortcuts that perform the same action
CREATE TABLE IF NOT EXISTS alternative_shortcuts_groups (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create alternative_shortcuts_members table
-- Links shortcuts to their alternative groups
CREATE TABLE IF NOT EXISTS alternative_shortcuts_members (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES alternative_shortcuts_groups(id) ON DELETE CASCADE,
  shortcut_keys VARCHAR(100) NOT NULL,
  platform VARCHAR(20), -- 'windows', 'mac', or NULL for cross-platform
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, shortcut_keys, platform)
);

-- Create indexes
CREATE INDEX idx_alt_shortcuts_group ON alternative_shortcuts_members(group_id);
CREATE INDEX idx_alt_shortcuts_keys ON alternative_shortcuts_members(shortcut_keys);
CREATE INDEX idx_alt_shortcuts_platform ON alternative_shortcuts_members(platform);

-- Enable Row Level Security
ALTER TABLE alternative_shortcuts_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_shortcuts_members ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to alternative_shortcuts_groups"
  ON alternative_shortcuts_groups FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to alternative_shortcuts_members"
  ON alternative_shortcuts_members FOR SELECT
  USING (true);

-- Add comments
COMMENT ON TABLE alternative_shortcuts_groups IS 'Groups of shortcuts that perform the same action';
COMMENT ON TABLE alternative_shortcuts_members IS 'Individual shortcuts within alternative groups';
COMMENT ON COLUMN alternative_shortcuts_members.is_primary IS 'Whether this is the primary/recommended shortcut in the group';
