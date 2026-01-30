-- Fix protection levels for Alt+F4, Ctrl+P, and Ctrl+A

-- 1. Set Alt+F4 as always-protected for Word and PowerPoint (system shortcut)
UPDATE shortcuts
SET
    windows_protection_level = 'always-protected',
    macos_protection_level = 'none'
WHERE
    keys = 'Alt + F4'
    AND application IN ('word', 'powerpoint');

-- 2. Set Alt+F4 as always-protected for Chrome and Excel too
UPDATE shortcuts
SET
    windows_protection_level = 'always-protected',
    macos_protection_level = 'none'
WHERE
    keys = 'Alt + F4'
    AND application IN ('chrome', 'excel');

-- 3. Remove Ctrl+P blue border (set protection level to none)
UPDATE shortcuts
SET
    windows_protection_level = 'none',
    macos_protection_level = 'none'
WHERE
    keys = 'Ctrl + P';

-- 4. Remove Ctrl+A blue border (set protection level to none)
UPDATE shortcuts
SET
    windows_protection_level = 'none',
    macos_protection_level = 'none'
WHERE
    keys = 'Ctrl + A';
