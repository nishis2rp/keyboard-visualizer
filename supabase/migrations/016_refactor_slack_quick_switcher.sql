-- 016_refactor_slack_quick_switcher.sql

-- Slackのクイック スイッチャーショートカットを更新
UPDATE shortcuts
SET
    description = 'クイック スイッチャーを開く',
    category = 'Navigation',
    difficulty = 'standard',
    platform = 'Cross-Platform',
    windows_keys = 'Ctrl + K',
    macos_keys = 'Cmd + K',
    keys = 'Ctrl + K' -- NOT NULL制約のためWindows側のキーを設定
WHERE
    application = 'slack' AND keys = 'Ctrl + K';
