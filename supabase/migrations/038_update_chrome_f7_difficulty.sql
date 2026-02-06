-- Migration 038: Update Chrome F7 shortcut difficulty
-- Set 'F7' (Caret Browsing) to 'standard' for Chrome.

INSERT INTO shortcuts (application, keys, description, difficulty)
VALUES ('chrome', 'F7', 'カーソルブラウジングの切り替え', 'standard')
ON CONFLICT (application, keys) 
DO UPDATE SET 
  difficulty = 'standard',
  description = 'カーソルブラウジングの切り替え';
