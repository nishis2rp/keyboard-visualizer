-- Migration: Refactor redundant key columns and normalize categories
-- 1. Remove redundancy: set windows_keys/macos_keys to NULL if they match the primary 'keys' column
UPDATE shortcuts
SET windows_keys = NULL
WHERE windows_keys = keys;

UPDATE shortcuts
SET macos_keys = NULL
WHERE macos_keys = keys;

-- 2. Normalize Categories
-- Standardize to common names across all applications
UPDATE shortcuts SET category = 'Editing' WHERE category IN ('Edit', 'Editing', '編集', '編集操作');
UPDATE shortcuts SET category = 'Navigation' WHERE category IN ('Navigation', 'ナビゲーション', 'ビュー', 'View');
UPDATE shortcuts SET category = 'File' WHERE category IN ('File', 'ファイル', '文書');
UPDATE shortcuts SET category = 'Format' WHERE category IN ('Format', '書式設定', '書式');
UPDATE shortcuts SET category = 'Selection' WHERE category IN ('Selection', '選択', '選択操作');
UPDATE shortcuts SET category = 'System' WHERE category IN ('System', 'システム', 'OS', 'General');
UPDATE shortcuts SET category = 'Application' WHERE category IN ('Application', 'アプリ', 'アプリケーション', 'Tabs', 'tabs');

-- 3. Fix specific application categories
-- Gmail
UPDATE shortcuts SET category = 'Compose' WHERE application = 'gmail' AND category IN ('作成', 'Compose');
UPDATE shortcuts SET category = 'Action' WHERE application = 'gmail' AND category IN ('アクション', '操作', '重要');
UPDATE shortcuts SET category = 'Navigation' WHERE application = 'gmail' AND category IN ('移動', '開く', '戻る');

-- Excel / Word / PowerPoint
UPDATE shortcuts SET category = 'Insert' WHERE application IN ('excel', 'word', 'powerpoint') AND category IN ('Insert', '挿入');
UPDATE shortcuts SET category = 'Table' WHERE application IN ('excel', 'word', 'powerpoint') AND category IN ('Table', '表');
UPDATE shortcuts SET category = 'Review' WHERE application IN ('excel', 'word', 'powerpoint') AND category IN ('Review', '校閲', 'コメント');

-- VS Code
UPDATE shortcuts SET category = 'Terminal' WHERE application = 'vscode' AND category IN ('Terminal', 'ターミナル');
UPDATE shortcuts SET category = 'Debug' WHERE application = 'vscode' AND category IN ('Debug', 'デバッグ');

-- Null categories to 'General'
UPDATE shortcuts SET category = 'General' WHERE category IS NULL OR category = '';
