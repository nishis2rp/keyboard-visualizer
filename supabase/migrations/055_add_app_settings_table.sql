-- Migration 055: Add application settings table for database-driven configuration
-- This allows dynamic configuration of app-specific settings without code changes

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(application_id, setting_key)
);

-- Add indexes for performance
CREATE INDEX idx_app_settings_application ON app_settings(application_id);
CREATE INDEX idx_app_settings_key ON app_settings(setting_key);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to app_settings" ON app_settings
  FOR SELECT USING (true);

-- Add comments
COMMENT ON TABLE app_settings IS 'Application-specific settings stored in database for dynamic configuration';
COMMENT ON COLUMN app_settings.application_id IS 'Reference to applications table';
COMMENT ON COLUMN app_settings.setting_key IS 'Unique setting identifier (e.g., default_layout, allow_browser_conflict_detection)';
COMMENT ON COLUMN app_settings.setting_value IS 'Setting value stored as text (parse based on setting_type)';
COMMENT ON COLUMN app_settings.setting_type IS 'Data type for parsing: string, number, boolean, or json';

-- Insert initial settings for Chrome (browser conflict detection)
INSERT INTO app_settings (application_id, setting_key, setting_value, setting_type, description) VALUES
('chrome', 'enable_browser_conflict_detection', 'true', 'boolean', 'Enable detection of shortcuts that conflict with Chrome in other apps'),
('chrome', 'browser_conflict_protection_levels', '["preventable_fullscreen"]', 'json', 'Protection levels that trigger browser conflict warnings');

-- Insert default layout settings
INSERT INTO app_settings (application_id, setting_key, setting_value, setting_type, description) VALUES
('windows11', 'default_layout', 'windows-jis', 'string', 'Default keyboard layout for Windows 11'),
('macos', 'default_layout', 'mac-jis', 'string', 'Default keyboard layout for macOS'),
('chrome', 'default_layout', 'windows-jis', 'string', 'Default keyboard layout for Chrome');
