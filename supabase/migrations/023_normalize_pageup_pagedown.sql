-- Normalize "Page Up" and "Page Down" to "PageUp" and "PageDown"
-- This fixes the key mapping issue where keyboard layout uses "PageUp" but database has "Page Up"

-- Update all "Page Up" to "PageUp"
UPDATE shortcuts
SET keys = REPLACE(keys, 'Page Up', 'PageUp')
WHERE keys LIKE '%Page Up%';

-- Update all "Page Down" to "PageDown"
UPDATE shortcuts
SET keys = REPLACE(keys, 'Page Down', 'PageDown')
WHERE keys LIKE '%Page Down%';

-- Update windows_keys column
UPDATE shortcuts
SET windows_keys = REPLACE(windows_keys, 'Page Up', 'PageUp')
WHERE windows_keys LIKE '%Page Up%';

UPDATE shortcuts
SET windows_keys = REPLACE(windows_keys, 'Page Down', 'PageDown')
WHERE windows_keys LIKE '%Page Down%';

-- Update macos_keys column
UPDATE shortcuts
SET macos_keys = REPLACE(macos_keys, 'Page Up', 'PageUp')
WHERE macos_keys LIKE '%Page Up%';

UPDATE shortcuts
SET macos_keys = REPLACE(macos_keys, 'Page Down', 'PageDown')
WHERE macos_keys LIKE '%Page Down%';
