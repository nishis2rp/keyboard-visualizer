UPDATE shortcuts
SET
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen'
WHERE
    keys IN (
        'Ctrl + W',
        'Ctrl + T',
        'Ctrl + L',
        'Ctrl + N',
        'Ctrl + Shift + N',
        'Ctrl + P',
        'Ctrl + S',
        'Ctrl + F',
        'Ctrl + R',
        'F5',
        'Ctrl + H',
        'Ctrl + J',
        'Ctrl + O',
        'Ctrl + PageUp',
        'Ctrl + PageDown',
        'Ctrl + Tab',
        'Ctrl + Shift + Tab',
        'F11'
    );