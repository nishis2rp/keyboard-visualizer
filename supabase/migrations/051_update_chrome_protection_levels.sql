-- ChromeのCtrl + F4, Ctrl + 1～9 を「全画面で防げる」に変更
UPDATE shortcuts
SET
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen'
WHERE
    application = 'chrome'
    AND keys IN (
        'Ctrl + 1',
        'Ctrl + 2',
        'Ctrl + 3',
        'Ctrl + 4',
        'Ctrl + 5',
        'Ctrl + 6',
        'Ctrl + 7',
        'Ctrl + 8',
        'Ctrl + 9',
        'Ctrl + F4'
    );
