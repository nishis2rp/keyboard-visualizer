-- 018_add_protection_level_columns.sql

-- shortcutsテーブルにwindows_protection_levelとmacos_protection_levelカラムを追加
ALTER TABLE shortcuts
ADD COLUMN windows_protection_level TEXT DEFAULT 'none' NOT NULL,
ADD COLUMN macos_protection_level TEXT DEFAULT 'none' NOT NULL;

COMMENT ON COLUMN shortcuts.windows_protection_level IS 'Windows環境におけるショートカットの保護レベル (none, fullscreen-preventable, always-protected)';
COMMENT ON COLUMN shortcuts.macos_protection_level IS 'macOS環境におけるショートカットの保護レベル (none, fullscreen-preventable, always-protected)';
