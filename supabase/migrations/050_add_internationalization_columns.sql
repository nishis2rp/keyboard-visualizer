-- Migration 050: Add internationalization columns for English support

-- Add English name column to applications table
ALTER TABLE applications
ADD COLUMN name_en VARCHAR(100);

-- Update existing applications with English names
UPDATE applications SET name_en = 'Windows 11' WHERE id = 'windows11';
UPDATE applications SET name_en = 'macOS' WHERE id = 'macos';
UPDATE applications SET name_en = 'Chrome' WHERE id = 'chrome';
UPDATE applications SET name_en = 'Excel' WHERE id = 'excel';
UPDATE applications SET name_en = 'Word' WHERE id = 'word';
UPDATE applications SET name_en = 'PowerPoint' WHERE id = 'powerpoint';
UPDATE applications SET name_en = 'Slack' WHERE id = 'slack';
UPDATE applications SET name_en = 'Gmail' WHERE id = 'gmail';
UPDATE applications SET name_en = 'VS Code' WHERE id = 'vscode';

-- Add English description and category columns to shortcuts table
ALTER TABLE shortcuts
ADD COLUMN description_en TEXT,
ADD COLUMN category_en VARCHAR(100);

-- Add comments explaining the new columns
COMMENT ON COLUMN applications.name_en IS 'English name of the application';
COMMENT ON COLUMN shortcuts.description_en IS 'English description of the shortcut';
COMMENT ON COLUMN shortcuts.category_en IS 'English category name';
