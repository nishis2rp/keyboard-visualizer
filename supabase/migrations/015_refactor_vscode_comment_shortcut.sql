-- 015_refactor_vscode_comment_shortcut.sql

-- 1. 'Ctrl + /' のレコードをCross-Platformとして更新
UPDATE shortcuts
SET
    description = '行コメントの切り替え', -- 念のため説明も更新
    category = 'Editing',
    difficulty = 'basic',
    platform = 'Cross-Platform',
    windows_keys = 'Ctrl + /',
    macos_keys = 'Cmd + /',
    keys = 'Ctrl + /' -- NOT NULL制約のためWindows側のキーを設定
WHERE
    application = 'vscode' AND keys = 'Ctrl + /'; -- ID指定はせず、keysで絞り込み

-- 2. 'Cmd + /' のレコードを削除
DELETE FROM shortcuts
WHERE
    application = 'vscode' AND keys = 'Cmd + /'; -- ID指定はせず、keysで絞り込み
