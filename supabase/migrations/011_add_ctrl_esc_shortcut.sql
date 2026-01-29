-- Add Ctrl + Esc as alternative shortcut for opening Start Menu
INSERT INTO shortcuts (application, keys, description)
VALUES ('windows11', 'Ctrl + Esc', 'スタートメニューを開く')
ON CONFLICT (application, keys) DO NOTHING;
