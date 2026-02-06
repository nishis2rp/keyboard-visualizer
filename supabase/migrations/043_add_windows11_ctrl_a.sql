-- Add Windows11 Ctrl+A shortcut for "Select All"
-- This prevents browser's default "Select All" behavior in visualizer mode
INSERT INTO shortcuts (
  application,
  keys,
  description,
  category,
  difficulty,
  platform,
  windows_keys,
  macos_keys,
  windows_protection_level,
  macos_protection_level
)
VALUES (
  'windows11',
  'Ctrl + A',
  'すべて選択',
  'Edit',
  'basic',
  'Windows',
  'Ctrl + A',
  NULL,
  'none',
  'none'
)
ON CONFLICT (application, keys) DO NOTHING;
