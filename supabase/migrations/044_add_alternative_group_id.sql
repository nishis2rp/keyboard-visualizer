-- Migration 044: Add alternative_group_id to shortcuts table
ALTER TABLE shortcuts ADD COLUMN alternative_group_id INTEGER;

COMMENT ON COLUMN shortcuts.alternative_group_id IS 'Group ID for shortcuts that perform the same action (e.g., Ctrl+C and Ctrl+Insert)';

-- Create index for faster lookup
CREATE INDEX idx_shortcuts_alternative_group_id ON shortcuts(alternative_group_id);

-- Populate initial alternative groups based on common shortcuts
-- 1: Copy (Ctrl+C, Ctrl+Insert)
UPDATE shortcuts SET alternative_group_id = 1 WHERE keys IN ('Ctrl + C', 'Ctrl + Insert');

-- 2: Paste (Ctrl+V, Shift+Insert)
UPDATE shortcuts SET alternative_group_id = 2 WHERE keys IN ('Ctrl + V', 'Shift + Insert');

-- 3: Cut (Ctrl+X, Shift+Delete)
UPDATE shortcuts SET alternative_group_id = 3 WHERE keys IN ('Ctrl + X', 'Shift + Delete');

-- 4: Undo (Ctrl+Z, Alt+Backspace)
UPDATE shortcuts SET alternative_group_id = 4 WHERE keys IN ('Ctrl + Z', 'Alt + Backspace');

-- 5: Redo (Ctrl+Y, Ctrl+Shift+Z)
UPDATE shortcuts SET alternative_group_id = 5 WHERE keys IN ('Ctrl + Y', 'Ctrl + Shift + Z');

-- 6: Tab Close (Ctrl+W, Ctrl+F4)
UPDATE shortcuts SET alternative_group_id = 6 WHERE keys IN ('Ctrl + W', 'Ctrl + F4');

-- 7: Browser Refresh (Ctrl+R, F5)
UPDATE shortcuts SET alternative_group_id = 7 WHERE keys IN ('Ctrl + R', 'F5');

-- 8: Browser Force Refresh (Ctrl+Shift+R, Ctrl+F5)
UPDATE shortcuts SET alternative_group_id = 8 WHERE keys IN ('Ctrl + Shift + R', 'Ctrl + F5');

-- 9: Address Bar (Ctrl+L, Alt+D, F6)
UPDATE shortcuts SET alternative_group_id = 9 WHERE keys IN ('Ctrl + L', 'Alt + D', 'F6');

-- 10: Developer Tools (Ctrl+Shift+I, F12)
UPDATE shortcuts SET alternative_group_id = 10 WHERE keys IN ('Ctrl + Shift + I', 'F12');

-- 11: Start Menu (Win, Ctrl+Esc)
UPDATE shortcuts SET alternative_group_id = 11 WHERE keys IN ('Win', 'Ctrl + Esc');

-- 12: Zoom In (Ctrl++, Ctrl+=)
UPDATE shortcuts SET alternative_group_id = 12 WHERE keys IN ('Ctrl + +', 'Ctrl + =');

-- 13: Excel Bold (Ctrl+B, Ctrl+2)
UPDATE shortcuts SET alternative_group_id = 13 WHERE keys IN ('Ctrl + B', 'Ctrl + 2');

-- 14: Excel Italic (Ctrl+I, Ctrl+3)
UPDATE shortcuts SET alternative_group_id = 14 WHERE keys IN ('Ctrl + I', 'Ctrl + 3');

-- 15: Excel Underline (Ctrl+U, Ctrl+4)
UPDATE shortcuts SET alternative_group_id = 15 WHERE keys IN ('Ctrl + U', 'Ctrl + 4');
