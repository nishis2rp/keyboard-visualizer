-- Ctrl+Shift+Tab, Ctrl+W, Ctrl+N以外の青枠を全て消す（2026-01-30更新）
UPDATE shortcuts
SET
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen'
WHERE
    keys IN (
        'Ctrl + W',
        'Ctrl + N',
        'Ctrl + Shift + Tab'
    );