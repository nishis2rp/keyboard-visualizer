-- 青枠表示するショートカット（2026-01-30更新）
-- Ctrl + W, N, T, Tab, PageUp, PageDown, Shift + N, Shift + W, Shift + Tab
UPDATE shortcuts
SET
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen'
WHERE
    keys IN (
        'Ctrl + W',
        'Ctrl + N',
        'Ctrl + T',
        'Ctrl + Tab',
        'Ctrl + PageUp',
        'Ctrl + PageDown',
        'Ctrl + Shift + N',
        'Ctrl + Shift + W',
        'Ctrl + Shift + Tab'
    );