ALTER TABLE shortcuts
ADD COLUMN sort_order INTEGER;

CREATE INDEX IF NOT EXISTS idx_shortcuts_sort_order ON shortcuts(sort_order);

COMMENT ON COLUMN shortcuts.sort_order IS 'The sort order for the shortcuts.';
