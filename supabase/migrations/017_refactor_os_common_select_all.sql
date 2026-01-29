-- 017_refactor_os_common_select_all.sql

-- 'すべて選択' ショートカットをos-commonのCross-Platformとして更新
UPDATE shortcuts
SET
    application = 'os-common',
    description = 'すべて選択',
    category = 'Editing', -- 適切なカテゴリに修正 (例: Editing, Selection)
    difficulty = 'basic', -- 適切な難易度に修正 (例: basic)
    platform = 'Cross-Platform',
    windows_keys = 'Ctrl + A',
    macos_keys = 'Cmd + A',
    keys = 'Ctrl + A' -- NOT NULL制約のためWindows側のキーを設定
WHERE
    application = 'windows11' AND keys = 'Ctrl + A';
