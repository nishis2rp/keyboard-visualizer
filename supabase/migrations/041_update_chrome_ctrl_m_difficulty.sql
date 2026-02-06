-- Migration 041: Update Chrome Ctrl + M difficulty to hard
-- Set 'Ctrl + M' (Mute current user) to 'hard' for Chrome.

UPDATE shortcuts 
SET difficulty = 'hard' 
WHERE keys = 'Ctrl + M' 
  AND application = 'chrome';
