-- Combined migration: Add difficulty column and VSCode shortcuts
-- This file combines migrations 003 and 004 for easier execution

-- Step 1: Add difficulty column to shortcuts table (from 003)
ALTER TABLE shortcuts
ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'standard';

-- Create index for faster queries on difficulty
CREATE INDEX IF NOT EXISTS idx_shortcuts_difficulty ON shortcuts(difficulty);

COMMENT ON COLUMN shortcuts.difficulty IS 'Difficulty level of the shortcut (e.g., basic, standard, hard, madmax)';

-- Step 2: Add VSCode shortcuts (from 004)
-- 基本的な編集操作 (Basic)
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + X', '行を切り取り', 'Editing', 'basic'),
('vscode', 'Ctrl + C', '行をコピー', 'Editing', 'basic'),
('vscode', 'Ctrl + V', '貼り付け', 'Editing', 'basic'),
('vscode', 'Ctrl + Z', '元に戻す', 'Editing', 'basic'),
('vscode', 'Ctrl + Y', 'やり直す', 'Editing', 'basic'),
('vscode', 'Ctrl + S', '保存', 'File', 'basic'),
('vscode', 'Ctrl + F', '検索', 'Search', 'basic'),
('vscode', 'Ctrl + H', '置換', 'Search', 'basic'),
('vscode', 'Ctrl + /', '行コメントの切り替え', 'Editing', 'basic'),
('vscode', 'Alt + ↑', '行を上に移動', 'Editing', 'basic'),
('vscode', 'Alt + ↓', '行を下に移動', 'Editing', 'basic')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 標準的な操作 (Standard)
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + P', 'ファイルを開く', 'Navigation', 'standard'),
('vscode', 'Ctrl + Shift + P', 'コマンドパレットを開く', 'Navigation', 'standard'),
('vscode', 'Ctrl + B', 'サイドバーの表示/非表示', 'View', 'standard'),
('vscode', 'Ctrl + `', 'ターミナルの表示/非表示', 'View', 'standard'),
('vscode', 'Ctrl + Shift + F', 'すべてのファイルで検索', 'Search', 'standard'),
('vscode', 'Ctrl + Shift + H', 'すべてのファイルで置換', 'Search', 'standard'),
('vscode', 'Ctrl + D', '次の一致を選択', 'Editing', 'standard'),
('vscode', 'Ctrl + Shift + L', 'すべての一致を選択', 'Editing', 'standard'),
('vscode', 'Ctrl + G', '行に移動', 'Navigation', 'standard'),
('vscode', 'Ctrl + Shift + O', 'シンボルに移動', 'Navigation', 'standard'),
('vscode', 'Ctrl + K + Ctrl + S', 'キーボードショートカットを開く', 'Settings', 'standard'),
('vscode', 'Ctrl + Shift + E', 'エクスプローラーを開く', 'View', 'standard'),
('vscode', 'Ctrl + Shift + X', '拡張機能を開く', 'View', 'standard'),
('vscode', 'Ctrl + Shift + M', '問題パネルを開く', 'View', 'standard'),
('vscode', 'F2', 'シンボルの名前を変更', 'Editing', 'standard'),
('vscode', 'F5', 'デバッグ開始/続行', 'Debug', 'standard'),
('vscode', 'Shift + F5', 'デバッグ停止', 'Debug', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 上級操作 (Hard)
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Shift + K', '行を削除', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + \', '対応する括弧に移動', 'Navigation', 'hard'),
('vscode', 'Ctrl + Shift + [', 'コードを折りたたむ', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + ]', 'コードを展開', 'Editing', 'hard'),
('vscode', 'Ctrl + K + Ctrl + 0', 'すべて折りたたむ', 'Editing', 'hard'),
('vscode', 'Ctrl + K + Ctrl + J', 'すべて展開', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + V', 'Markdownプレビュー', 'View', 'hard'),
('vscode', 'Ctrl + K + V', 'Markdownプレビューを横に表示', 'View', 'hard'),
('vscode', 'Ctrl + K + Ctrl + T', 'テーマ選択', 'Settings', 'hard'),
('vscode', 'Ctrl + K + Ctrl + X', '末尾の空白を削除', 'Editing', 'hard'),
('vscode', 'Alt + Shift + ↑', '行を上にコピー', 'Editing', 'hard'),
('vscode', 'Alt + Shift + ↓', '行を下にコピー', 'Editing', 'hard'),
('vscode', 'Ctrl + T', 'ワークスペースのシンボルを表示', 'Navigation', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 最上級操作 (MadMax)
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + K + Ctrl + I', 'ホバー情報を表示', 'Information', 'madmax'),
('vscode', 'Ctrl + Shift + Space', 'パラメーターヒントを表示', 'Information', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + C', '行コメントを追加', 'Editing', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + U', '行コメントを削除', 'Editing', 'madmax'),
('vscode', 'Ctrl + K + M', '言語モードを変更', 'Settings', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + F', '選択範囲をフォーマット', 'Editing', 'madmax'),
('vscode', 'Shift + Alt + F', 'ドキュメントをフォーマット', 'Editing', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + W', 'すべてのエディターを閉じる', 'View', 'madmax'),
('vscode', 'Ctrl + K + F', 'フォルダーを閉じる', 'File', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + R', 'ファイルの場所を開く', 'File', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;
