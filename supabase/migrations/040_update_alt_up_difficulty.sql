-- Migration 040: Update Windows Alt + Up difficulty to basic
-- Set 'Alt + Up' (Go to parent folder) to 'basic' for windows11 and browser applications.

UPDATE shortcuts 
SET difficulty = 'basic' 
WHERE keys = 'Alt + ↑' 
  AND (application = 'windows11' OR application = 'browser' OR application = 'os-common')
  AND (description LIKE '%親フォルダー%' OR description LIKE '%上%');
