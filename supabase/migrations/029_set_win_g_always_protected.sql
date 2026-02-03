-- Set Win+G (Xbox Game Bar) to always-protected
-- Win+G cannot be prevented even in fullscreen mode on Windows

UPDATE shortcuts
SET windows_protection_level = 'always-protected'
WHERE keys = 'Win + G';
