-- Add platform-specific columns to the shortcuts table
ALTER TABLE shortcuts
ADD COLUMN windows_keys TEXT,
ADD COLUMN macos_keys TEXT,
ADD COLUMN platform TEXT DEFAULT 'Cross-Platform';

-- Migrate existing Windows shortcuts
UPDATE shortcuts
SET
  platform = 'Windows',
  windows_keys = keys
WHERE application = 'windows11';

-- Migrate existing macOS shortcuts
UPDATE shortcuts
SET
  platform = 'macOS',
  macos_keys = keys
WHERE application = 'macos';

-- Migrate VS Code shortcuts (check for existing platform info)
-- VS Code shortcuts may already have windows_keys or could be cross-platform
UPDATE shortcuts
SET platform = 'Cross-Platform'
WHERE application LIKE 'vscode%' OR application IN ('chrome', 'excel', 'gmail', 'slack');

-- Create an index on platform for faster filtering
CREATE INDEX IF NOT EXISTS idx_shortcuts_platform ON shortcuts(platform);

-- Add comment explaining the new structure
COMMENT ON COLUMN shortcuts.windows_keys IS 'Windows-specific key combination';
COMMENT ON COLUMN shortcuts.macos_keys IS 'macOS-specific key combination (Cmd, Option, etc.)';
COMMENT ON COLUMN shortcuts.platform IS 'Platform: Windows, macOS, or Cross-Platform';
