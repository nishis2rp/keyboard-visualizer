-- Merge common Windows/macOS shortcuts into unified records
-- This migration consolidates shortcuts with identical descriptions across both platforms

-- 1. Update Windows shortcuts to be cross-platform with both windows_keys and macos_keys

-- 音声入力を開始
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Win + H',
  macos_keys = 'Fn Fn (2回)'
WHERE application = 'windows11' AND description = '音声入力を開始';

-- すべてのウィンドウを最小化
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Win + M',
  macos_keys = 'Cmd + Option + M'
WHERE application = 'windows11' AND description = 'すべてのウィンドウを最小化';

-- すべて選択
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Ctrl + A',
  macos_keys = 'Cmd + A'
WHERE application = 'windows11' AND description = 'すべて選択';

-- コピー
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Ctrl + Insert',
  macos_keys = 'Cmd + C'
WHERE application = 'windows11' AND description = 'コピー';

-- 貼り付け
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Shift + Insert',
  macos_keys = 'Cmd + V'
WHERE application = 'windows11' AND description = '貼り付け';

-- 切り取り
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Ctrl + X',
  macos_keys = 'Cmd + X'
WHERE application = 'windows11' AND description = '切り取り';

-- 元に戻す
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Ctrl + Z',
  macos_keys = 'Cmd + Z'
WHERE application = 'windows11' AND description = '元に戻す';

-- やり直し
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Ctrl + Y',
  macos_keys = 'Cmd + Shift + Z'
WHERE application = 'windows11' AND description = 'やり直し';

-- 保存
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Ctrl + S',
  macos_keys = 'Cmd + S'
WHERE application = 'windows11' AND description = '保存';

-- 印刷
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Ctrl + P',
  macos_keys = 'Cmd + P'
WHERE application = 'windows11' AND description = '印刷';

-- 検索
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'F3',
  macos_keys = 'Cmd + F'
WHERE application = 'windows11' AND description = '検索';

-- 前の単語を削除
UPDATE shortcuts SET
  application = 'os-common',
  platform = 'Cross-Platform',
  windows_keys = 'Ctrl + Backspace',
  macos_keys = 'Option + Delete'
WHERE application = 'windows11' AND description = '前の単語を削除';

-- 2. Delete duplicate macOS records (now merged into cross-platform records)
DELETE FROM shortcuts WHERE application = 'macos' AND description = '音声入力を開始';
DELETE FROM shortcuts WHERE application = 'macos' AND description = 'すべてのウィンドウを最小化';
DELETE FROM shortcuts WHERE application = 'macos' AND description = 'すべて選択';
DELETE FROM shortcuts WHERE application = 'macos' AND description = 'コピー';
DELETE FROM shortcuts WHERE application = 'macos' AND description = '貼り付け';
DELETE FROM shortcuts WHERE application = 'macos' AND description = '切り取り';
DELETE FROM shortcuts WHERE application = 'macos' AND description = '元に戻す';
DELETE FROM shortcuts WHERE application = 'macos' AND description = 'やり直し';
DELETE FROM shortcuts WHERE application = 'macos' AND description = '保存';
DELETE FROM shortcuts WHERE application = 'macos' AND description = '印刷';
DELETE FROM shortcuts WHERE application = 'macos' AND description = '検索';
DELETE FROM shortcuts WHERE application = 'macos' AND description = '前の単語を削除';

-- 3. Update remaining OS-specific shortcuts to have proper platform designation
UPDATE shortcuts SET platform = 'Windows' WHERE application = 'windows11' AND platform IS NULL;
UPDATE shortcuts SET platform = 'macOS' WHERE application = 'macos' AND platform IS NULL;

-- Add comments
COMMENT ON TABLE shortcuts IS 'Keyboard shortcuts - now includes cross-platform shortcuts with both Windows and macOS key combinations';
