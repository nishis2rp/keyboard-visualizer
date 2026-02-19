-- Migration 056: Add global settings table for system-wide configuration
-- This allows configuration of app-wide settings like setup version, default values, etc.

-- Create global_settings table
CREATE TABLE IF NOT EXISTS global_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  description TEXT,
  is_public BOOLEAN DEFAULT true, -- Whether setting should be publicly readable
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX idx_global_settings_key ON global_settings(setting_key);

-- Enable RLS
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access only for public settings
CREATE POLICY "Allow public read access to public global_settings" ON global_settings
  FOR SELECT USING (is_public = true);

-- Add comments
COMMENT ON TABLE global_settings IS 'Global application settings stored in database';
COMMENT ON COLUMN global_settings.setting_key IS 'Unique global setting identifier';
COMMENT ON COLUMN global_settings.setting_value IS 'Setting value stored as text (parse based on setting_type)';
COMMENT ON COLUMN global_settings.setting_type IS 'Data type for parsing: string, number, boolean, or json';
COMMENT ON COLUMN global_settings.is_public IS 'Whether this setting can be read publicly';

-- Insert initial global settings
INSERT INTO global_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
-- Setup configuration
('setup_version', 'v2', 'string', 'Setup screen version - increments force re-setup', true),
('default_app', 'windows11', 'string', 'Default application for first-time users', true),
('default_layout', 'windows-jis', 'string', 'Default keyboard layout for first-time users', true),

-- Feature flags
('enable_quiz_mode', 'true', 'boolean', 'Enable quiz mode feature', true),
('enable_fullscreen_mode', 'true', 'boolean', 'Enable fullscreen practice mode', true),
('enable_user_authentication', 'true', 'boolean', 'Enable user login and progress tracking', true),
('enable_browser_conflict_warnings', 'true', 'boolean', 'Enable browser shortcut conflict warnings globally', true),

-- Language configuration
('supported_languages', '["ja", "en"]', 'json', 'List of supported language codes', true),
('default_language', 'ja', 'string', 'Default language for first-time users', true),

-- Analytics and tracking
('enable_analytics', 'false', 'boolean', 'Enable Google Analytics tracking', true),

-- UI configuration
('show_keyboard_layout', 'true', 'boolean', 'Show keyboard layout visualization', true),
('show_difficulty_badges', 'true', 'boolean', 'Show difficulty badges on shortcut cards', true),
('compact_mode_default', 'false', 'boolean', 'Use compact mode for shortcut cards by default', true);
