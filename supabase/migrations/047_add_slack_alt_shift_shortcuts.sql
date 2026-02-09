-- Add Alt + Shift shortcuts for Slack
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES 
('slack', 'Alt + Shift + ↑', '[ナビゲーション] 前の未読チャンネルまたはDMに移動', 'Navigation', 'standard'),
('slack', 'Alt + Shift + ↓', '[ナビゲーション] 次の未読チャンネルまたはDMに移動', 'Navigation', 'standard'),
('slack', 'Alt + Shift + K', '[ナビゲーション] 全てのチャンネルを閲覧する', 'Navigation', 'standard'),
('slack', 'Alt + Shift + L', '[ナビゲーション] ダイレクトメッセージを閲覧する', 'Navigation', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET 
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty;
