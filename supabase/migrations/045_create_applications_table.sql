-- Migration 045: Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  os VARCHAR(20) NOT NULL, -- 'windows', 'mac', 'cross-platform'
  display_order INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to applications" ON applications
  FOR SELECT USING (true);

-- Insert initial data
INSERT INTO applications (id, name, icon, os, display_order) VALUES
('windows11', 'Windows 11', '🪟', 'windows', 1),
('macos', 'macOS', '🍎', 'mac', 2),
('chrome', 'Chrome', '🌐', 'cross-platform', 3),
('excel', 'Excel', '📊', 'cross-platform', 4),
('word', 'Word', '📝', 'cross-platform', 5),
('powerpoint', 'PowerPoint', '📽️', 'cross-platform', 6),
('slack', 'Slack', '💬', 'cross-platform', 7),
('gmail', 'Gmail', '📧', 'cross-platform', 8),
('vscode', 'VS Code', '💻', 'cross-platform', 9);

-- Add foreign key to shortcuts table (optional but recommended)
-- ALTER TABLE shortcuts ADD CONSTRAINT fk_shortcuts_application FOREIGN KEY (application) REFERENCES applications(id);
