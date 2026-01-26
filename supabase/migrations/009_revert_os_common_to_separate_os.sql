-- Revert os-common approach: keep shortcuts separate for each OS
-- Instead of creating os-common, keep windows11 and macos separate but with cross-reference keys

-- 1. Change os-common records back to windows11
UPDATE shortcuts SET
  application = 'windows11'
WHERE application = 'os-common';

-- 2. Re-create the deleted macOS records with both windows_keys and macos_keys for reference
INSERT INTO shortcuts (application, keys, description, platform, windows_keys, macos_keys)
VALUES
  ('macos', 'Fn Fn (2回)', '音声入力を開始', 'macOS', 'Win + H', 'Fn Fn (2回)'),
  ('macos', 'Cmd + Option + M', 'すべてのウィンドウを最小化', 'macOS', 'Win + M', 'Cmd + Option + M'),
  ('macos', 'Cmd + A', 'すべて選択', 'macOS', 'Ctrl + A', 'Cmd + A'),
  ('macos', 'Cmd + C', 'コピー', 'macOS', 'Ctrl + Insert', 'Cmd + C'),
  ('macos', 'Cmd + V', '貼り付け', 'macOS', 'Shift + Insert', 'Cmd + V'),
  ('macos', 'Cmd + X', '切り取り', 'macOS', 'Ctrl + X', 'Cmd + X'),
  ('macos', 'Cmd + Z', '元に戻す', 'macOS', 'Ctrl + Z', 'Cmd + Z'),
  ('macos', 'Cmd + Shift + Z', 'やり直し', 'macOS', 'Ctrl + Y', 'Cmd + Shift + Z'),
  ('macos', 'Cmd + S', '保存', 'macOS', 'Ctrl + S', 'Cmd + S'),
  ('macos', 'Cmd + P', '印刷', 'macOS', 'Ctrl + P', 'Cmd + P'),
  ('macos', 'Cmd + F', '検索', 'macOS', 'F3', 'Cmd + F'),
  ('macos', 'Option + Delete', '前の単語を削除', 'macOS', 'Ctrl + Backspace', 'Option + Delete')
ON CONFLICT (application, keys) DO NOTHING;

-- 3. Ensure all windows11 and macos records have proper platform designation
UPDATE shortcuts SET platform = 'Windows' WHERE application = 'windows11' AND (platform IS NULL OR platform = 'Cross-Platform');
UPDATE shortcuts SET platform = 'macOS' WHERE application = 'macos' AND (platform IS NULL OR platform = 'Cross-Platform');

COMMENT ON TABLE shortcuts IS 'Keyboard shortcuts - each OS has separate records, with cross-reference keys stored in windows_keys/macos_keys columns';
