-- Migration 049: Add Ctrl + Shift + PageUp/PageDown to Chrome
-- These shortcuts move the current tab to the left or right.

INSERT INTO shortcuts (
    application, 
    keys, 
    description, 
    difficulty, 
    category, 
    windows_protection_level, 
    macos_protection_level,
    platform
)
VALUES 
(
    'chrome', 
    'Ctrl + Shift + PageUp', 
    'タブを左に移動', 
    'standard', 
    'Application', 
    'preventable_fullscreen', 
    'preventable_fullscreen',
    'Cross-Platform'
),
(
    'chrome', 
    'Ctrl + Shift + PageDown', 
    'タブを右に移動', 
    'standard', 
    'Application', 
    'preventable_fullscreen', 
    'preventable_fullscreen',
    'Cross-Platform'
)
ON CONFLICT (application, keys) DO UPDATE SET
    description = EXCLUDED.description,
    difficulty = EXCLUDED.difficulty,
    category = EXCLUDED.category,
    windows_protection_level = EXCLUDED.windows_protection_level,
    macos_protection_level = EXCLUDED.macos_protection_level,
    platform = EXCLUDED.platform;
