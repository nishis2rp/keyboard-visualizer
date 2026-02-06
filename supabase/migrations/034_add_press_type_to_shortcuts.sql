-- Add press_type column to distinguish sequential vs. simultaneous shortcuts
-- This migration is designed to be run once.
-- It does not include 'IF NOT EXISTS' for ADD COLUMN, as it may not be supported on all PostgreSQL versions.
ALTER TABLE shortcuts ADD COLUMN press_type VARCHAR(20) NOT NULL DEFAULT 'simultaneous';

COMMENT ON COLUMN shortcuts.press_type IS 'Type of key press: ''simultaneous'' or ''sequential''';

-- Update existing sequential shortcuts based on key patterns
UPDATE shortcuts
SET press_type = 'sequential'
WHERE
    -- For comma-separated sequences (e.g., "Ctrl+K, C")
    keys LIKE '%,%' OR
    -- For "then" separated sequences (e.g., "Tab then Enter")
    keys LIKE '% then %' OR
    -- For space-separated sequences in Gmail (e.g., "g i")
    (application = 'gmail' AND keys ~ E'^[a-z] [a-z]$');

-- Note: 'word', 'powerpoint', and 'excel' shortcuts will be updated if they match these patterns.
-- Currently, no sequential shortcuts for these apps are in the DB.
