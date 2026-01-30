-- Set protection levels for Word and PowerPoint shortcuts
-- These shortcuts can be captured in fullscreen mode but are browser/system shortcuts

-- Update Word shortcuts
UPDATE shortcuts
SET
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen'
WHERE
    application = 'word'
    AND keys IN (
        'Ctrl + W',
        'Ctrl + N',
        'Ctrl + T',
        'Ctrl + Tab',
        'Ctrl + Page Up',
        'Ctrl + Page Down',
        'Ctrl + Shift + N',
        'Ctrl + Shift + W',
        'Ctrl + Shift + Tab',
        'Ctrl + Shift + Page Up',
        'Ctrl + Shift + Page Down'
    );

-- Update PowerPoint shortcuts
UPDATE shortcuts
SET
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen'
WHERE
    application = 'powerpoint'
    AND keys IN (
        'Ctrl + W',
        'Ctrl + N',
        'Ctrl + T',
        'Ctrl + Tab',
        'Ctrl + Page Up',
        'Ctrl + Page Down',
        'Ctrl + Shift + N',
        'Ctrl + Shift + W',
        'Ctrl + Shift + Tab',
        'Ctrl + Shift + Page Up',
        'Ctrl + Shift + Page Down',
        'Ctrl + P',  -- PowerPoint uses this for Pen tool in slideshow, but also file print
        'Ctrl + A'   -- PowerPoint uses this for Arrow pointer in slideshow, but also select all
    );

-- Also ensure Excel, Slack, Gmail have these set (in case they were missed)
UPDATE shortcuts
SET
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen'
WHERE
    application IN ('excel', 'slack', 'gmail')
    AND keys IN (
        'Ctrl + W',
        'Ctrl + N',
        'Ctrl + T',
        'Ctrl + Tab',
        'Ctrl + Page Up',
        'Ctrl + Page Down',
        'Ctrl + Shift + N',
        'Ctrl + Shift + W',
        'Ctrl + Shift + Tab',
        'Ctrl + Shift + Page Up',
        'Ctrl + Shift + Page Down'
    )
    AND (windows_protection_level IS NULL OR windows_protection_level = 'none');
