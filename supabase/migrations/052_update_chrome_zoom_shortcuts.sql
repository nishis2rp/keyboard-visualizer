-- ChromeのCtrl + +, Ctrl + ; を「全画面で防げる」に変更
-- Ctrl + ; は存在しない場合は追加、存在する場合は更新
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_protection_level, macos_protection_level)
VALUES ('chrome', 'Ctrl + ;', 'Google プレビュー（または拡張機能など）', 'General', 'standard', 'Cross-Platform', 'preventable_fullscreen', 'preventable_fullscreen')
ON CONFLICT (application, keys) 
DO UPDATE SET 
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen';

UPDATE shortcuts
SET
    windows_protection_level = 'preventable_fullscreen',
    macos_protection_level = 'preventable_fullscreen'
WHERE
    application = 'chrome'
    AND keys = 'Ctrl + +';
