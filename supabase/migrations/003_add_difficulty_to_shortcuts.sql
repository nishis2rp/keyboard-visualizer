-- Add difficulty column to shortcuts table
ALTER TABLE shortcuts
ADD COLUMN difficulty VARCHAR(20) DEFAULT 'standard';

-- Create index for faster queries on difficulty
CREATE INDEX IF NOT EXISTS idx_shortcuts_difficulty ON shortcuts(difficulty);

-- Update existing shortcuts with difficulty based on keys
-- This is a placeholder and should be replaced with a more robust script
-- For now, we'll set some examples.
-- The actual difficulty will be populated by a script later.

COMMENT ON COLUMN shortcuts.difficulty IS 'Difficulty level of the shortcut (e.g., basic, standard, hard, madmax)';
