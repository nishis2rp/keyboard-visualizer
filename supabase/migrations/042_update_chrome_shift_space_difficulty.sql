-- Migration 042: Update Chrome Shift + Space difficulty to basic
-- Set 'Shift + Space' to 'basic' for Chrome.

UPDATE shortcuts 
SET difficulty = 'basic' 
WHERE keys = 'Shift + Space' 
  AND application = 'chrome';
