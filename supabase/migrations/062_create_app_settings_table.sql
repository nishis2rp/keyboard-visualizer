-- Create app_settings table for configuration
CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  value_type VARCHAR(20) NOT NULL CHECK (value_type IN ('string', 'number', 'boolean', 'json')),
  category VARCHAR(50),
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast key lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_app_settings_category ON app_settings(category);

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only public settings)
CREATE POLICY "Allow public read access to public app_settings"
  ON app_settings FOR SELECT
  USING (is_public = true);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO app_settings (setting_key, setting_value, value_type, category, description) VALUES
  ('quiz.input_cooldown_ms', '300', 'number', 'timings', 'Quiz input cooldown time in milliseconds'),
  ('quiz.timer_interval_ms', '100', 'number', 'timings', 'Quiz timer update interval in milliseconds'),
  ('quiz.default_time_limit_s', '10', 'number', 'timings', 'Default quiz time limit per question in seconds'),
  ('animation.delay_ms', '100', 'number', 'timings', 'UI animation delay in milliseconds'),
  ('intersection.threshold', '0.1', 'number', 'ui', 'IntersectionObserver threshold'),
  ('browser_conflict.exclude_apps', '["chrome"]', 'json', 'features', 'Apps excluded from browser conflict detection')
ON CONFLICT (setting_key) DO NOTHING;

-- Add comments
COMMENT ON TABLE app_settings IS 'Application-wide configuration settings';
COMMENT ON COLUMN app_settings.value_type IS 'Data type of the setting value (string, number, boolean, json)';
COMMENT ON COLUMN app_settings.is_public IS 'Whether this setting can be accessed by frontend';
