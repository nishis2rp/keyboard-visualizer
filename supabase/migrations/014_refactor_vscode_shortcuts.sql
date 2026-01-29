-- 014_refactor_vscode_shortcuts.sql

-- 1. 'Ctrl + Y' の説明を修正し、プラットフォーム固有のキーを割り当てる
--    WindowsのCtrl + Yはデフォルトで「行を削除」
UPDATE shortcuts
SET
    description = '行を削除',
    platform = 'Windows',
    windows_keys = 'Ctrl + Y',
    macos_keys = NULL
WHERE
    application = 'vscode' AND keys = 'Ctrl + Y';

-- 2. 'Ctrl + Shift + \' / 'Cmd + Shift + \' の重複と説明の不一致を修正

-- 'ブロックを選択' の説明を持つレコードを '対応する括弧に移動' に修正
UPDATE shortcuts
SET
    description = '対応する括弧に移動',
    category = 'Navigation',
    difficulty = 'standard',
    platform = 'Cross-Platform',
    windows_keys = 'Ctrl + Shift + \\',
    macos_keys = 'Cmd + Shift + \\'
WHERE
    application = 'vscode' AND (keys = 'Ctrl + Shift + \\' OR keys = 'Cmd + Shift + \\') AND description = 'ブロックを選択';

-- 既存の '対応する括弧に移動' レコードの difficulty を 'standard' に統一し、プラットフォーム情報を更新
UPDATE shortcuts
SET
    difficulty = 'standard',
    platform = 'Cross-Platform',
    windows_keys = 'Ctrl + Shift + \\',
    macos_keys = 'Cmd + Shift + \\'
WHERE
    application = 'vscode' AND (keys = 'Ctrl + Shift + \\' OR keys = 'Cmd + Shift + \\') AND description = '対応する括弧に移動';

--
-- 'Alt + ↑' / 'Alt + ↓' (Windows) と 'Option + ↑' / 'Option + ↓' (macOS) の '行を移動'
-- description自体は正しいが、windows_keys/macos_keys/platformが未設定の可能性があるので、
-- ここで明示的に更新しておく。
-- ただし、これらのショートカットは 'Ctrl + Up/Down' の代替として存在する場合があるため、
-- 個別に検証し、必要であれば調整が必要。
-- 現状では description が正しいので、keyのプラットフォーム対応のみを行う。
UPDATE shortcuts
SET
    platform = 'Cross-Platform',
    windows_keys = 'Alt + Up',
    macos_keys = 'Option + Up'
WHERE
    application = 'vscode' AND keys = 'Alt + ↑' AND description = '行を上に移動';

UPDATE shortcuts
SET
    platform = 'Cross-Platform',
    windows_keys = 'Alt + Down',
    macos_keys = 'Option + Down'
WHERE
    application = 'vscode' AND keys = 'Alt + ↓' AND description = '行を下に移動';
