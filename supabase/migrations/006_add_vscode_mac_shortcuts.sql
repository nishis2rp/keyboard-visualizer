-- VSCode ショートカット（Mac版）
-- Windowsの Ctrl → Cmd、Alt → Option に変換

-- エディタ管理 (Editor Management) - Basic
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + W', 'エディターを閉じる', 'Editor', 'basic'),
('vscode', 'Cmd + Tab', '次のエディターに切り替え', 'Editor', 'basic'),
('vscode', 'Cmd + Shift + Tab', '前のエディターに切り替え', 'Editor', 'basic'),
('vscode', 'Cmd + \\', 'エディターを分割', 'Editor', 'basic'),
('vscode', 'Cmd + 1', '最初のエディターグループにフォーカス', 'Editor', 'basic'),
('vscode', 'Cmd + 2', '2番目のエディターグループにフォーカス', 'Editor', 'basic'),
('vscode', 'Cmd + 3', '3番目のエディターグループにフォーカス', 'Editor', 'basic')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 基本的な編集操作 (Basic Editing) - Basic
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + X', '行を切り取り', 'Editing', 'basic'),
('vscode', 'Cmd + C', '行をコピー', 'Editing', 'basic'),
('vscode', 'Cmd + V', '貼り付け', 'Editing', 'basic'),
('vscode', 'Cmd + Z', '元に戻す', 'Editing', 'basic'),
('vscode', 'Cmd + Shift + Z', 'やり直す', 'Editing', 'basic'),
('vscode', 'Cmd + S', '保存', 'File', 'basic'),
('vscode', 'Cmd + F', '検索', 'Search', 'basic'),
('vscode', 'Cmd + Option + F', '置換', 'Search', 'basic'),
('vscode', 'Cmd + /', '行コメントの切り替え', 'Editing', 'basic'),
('vscode', 'Option + ↑', '行を上に移動', 'Editing', 'basic'),
('vscode', 'Option + ↓', '行を下に移動', 'Editing', 'basic')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 行操作 (Line Operations) - Basic
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + Enter', '下に行を挿入', 'Editing', 'basic'),
('vscode', 'Cmd + Shift + Enter', '上に行を挿入', 'Editing', 'basic'),
('vscode', 'Cmd + ]', 'インデントを増やす', 'Editing', 'basic'),
('vscode', 'Cmd + [', 'インデントを減らす', 'Editing', 'basic'),
('vscode', 'Cmd + ←', '行の先頭に移動', 'Navigation', 'basic'),
('vscode', 'Cmd + →', '行の末尾に移動', 'Navigation', 'basic')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 標準的な操作 (Standard Operations) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + P', 'ファイルを開く', 'Navigation', 'standard'),
('vscode', 'Cmd + Shift + P', 'コマンドパレットを開く', 'Navigation', 'standard'),
('vscode', 'Cmd + B', 'サイドバーの表示/非表示', 'View', 'standard'),
('vscode', 'Ctrl + `', 'ターミナルの表示/非表示', 'View', 'standard'),
('vscode', 'Cmd + Shift + F', 'すべてのファイルで検索', 'Search', 'standard'),
('vscode', 'Cmd + Shift + H', 'すべてのファイルで置換', 'Search', 'standard'),
('vscode', 'Cmd + D', '次の一致を選択', 'Editing', 'standard'),
('vscode', 'Cmd + Shift + L', 'すべての一致を選択', 'Editing', 'standard'),
('vscode', 'Ctrl + G', '行に移動', 'Navigation', 'standard'),
('vscode', 'Cmd + Shift + O', 'シンボルに移動', 'Navigation', 'standard'),
('vscode', 'Cmd + K + Cmd + S', 'キーボードショートカットを開く', 'Settings', 'standard'),
('vscode', 'Cmd + Shift + E', 'エクスプローラーを開く', 'View', 'standard'),
('vscode', 'Cmd + Shift + X', '拡張機能を開く', 'View', 'standard'),
('vscode', 'Cmd + Shift + M', '問題パネルを開く', 'View', 'standard'),
('vscode', 'F2', 'シンボルの名前を変更', 'Editing', 'standard'),
('vscode', 'F5', 'デバッグ開始/続行', 'Debug', 'standard'),
('vscode', 'Shift + F5', 'デバッグ停止', 'Debug', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- マルチカーソル操作 (Multi-Cursor) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Option + Click', 'カーソルを追加', 'Editing', 'standard'),
('vscode', 'Cmd + Option + ↑', '上にカーソルを追加', 'Editing', 'standard'),
('vscode', 'Cmd + Option + ↓', '下にカーソルを追加', 'Editing', 'standard'),
('vscode', 'Cmd + U', '最後のカーソル操作を元に戻す', 'Editing', 'standard'),
('vscode', 'Shift + Option + I', '選択した各行の末尾にカーソルを追加', 'Editing', 'standard'),
('vscode', 'Cmd + L', '行を選択', 'Editing', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 検索と置換 (Search & Replace) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + G', '次を検索', 'Search', 'standard'),
('vscode', 'Cmd + Shift + G', '前を検索', 'Search', 'standard'),
('vscode', 'Option + Enter', '一致するすべてを選択', 'Search', 'standard'),
('vscode', 'Cmd + K + Cmd + D', '次の一致まで移動', 'Search', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- ナビゲーション (Navigation) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + Shift + \\', '対応する括弧に移動', 'Navigation', 'standard'),
('vscode', 'Cmd + ↑', 'ファイルの先頭に移動', 'Navigation', 'standard'),
('vscode', 'Cmd + ↓', 'ファイルの末尾に移動', 'Navigation', 'standard'),
('vscode', 'Ctrl + PageUp', '前のエディターを開く', 'Navigation', 'standard'),
('vscode', 'Ctrl + PageDown', '次のエディターを開く', 'Navigation', 'standard'),
('vscode', 'Ctrl + -', '戻る', 'Navigation', 'standard'),
('vscode', 'Ctrl + Shift + -', '進む', 'Navigation', 'standard'),
('vscode', 'Cmd + Shift + [', '前のエディターに移動', 'Navigation', 'standard'),
('vscode', 'Cmd + Shift + ]', '次のエディターに移動', 'Navigation', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- コード操作 (Code Operations) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Shift + Option + A', 'ブロックコメントの切り替え', 'Editing', 'standard'),
('vscode', 'Ctrl + Space', 'IntelliSenseをトリガー', 'Editing', 'standard'),
('vscode', 'Cmd + .', 'クイックフィックス', 'Editing', 'standard'),
('vscode', 'F12', '定義へ移動', 'Navigation', 'standard'),
('vscode', 'Option + F12', '定義をここに表示', 'Navigation', 'standard'),
('vscode', 'Cmd + K + F12', '定義を横に開く', 'Navigation', 'standard'),
('vscode', 'Shift + F12', '参照を表示', 'Navigation', 'standard'),
('vscode', 'Cmd + F12', '実装へ移動', 'Navigation', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- ターミナル操作 (Terminal) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Shift + `', '新しいターミナルを作成', 'Terminal', 'standard'),
('vscode', 'Cmd + C', 'ターミナルをコピー', 'Terminal', 'standard'),
('vscode', 'Cmd + V', 'ターミナルに貼り付け', 'Terminal', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- Git操作 (Git) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Shift + G', 'ソース管理を開く', 'Git', 'standard'),
('vscode', 'Ctrl + Shift + G + G', 'Git: Commitを開く', 'Git', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 上級操作 (Advanced) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + Shift + K', '行を削除', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + \\', '対応する括弧に移動', 'Navigation', 'hard'),
('vscode', 'Cmd + Option + [', 'コードを折りたたむ', 'Editing', 'hard'),
('vscode', 'Cmd + Option + ]', 'コードを展開', 'Editing', 'hard'),
('vscode', 'Cmd + K + Cmd + 0', 'すべて折りたたむ', 'Editing', 'hard'),
('vscode', 'Cmd + K + Cmd + J', 'すべて展開', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + V', 'Markdownプレビュー', 'View', 'hard'),
('vscode', 'Cmd + K + V', 'Markdownプレビューを横に表示', 'View', 'hard'),
('vscode', 'Cmd + K + Cmd + T', 'テーマ選択', 'Settings', 'hard'),
('vscode', 'Cmd + K + Cmd + X', '末尾の空白を削除', 'Editing', 'hard'),
('vscode', 'Option + Shift + ↑', '行を上にコピー', 'Editing', 'hard'),
('vscode', 'Option + Shift + ↓', '行を下にコピー', 'Editing', 'hard'),
('vscode', 'Cmd + T', 'ワークスペースのシンボルを表示', 'Navigation', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- エディタ管理 (Editor Management) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + K + W', 'すべてのエディターを閉じる', 'Editor', 'hard'),
('vscode', 'Cmd + K + Cmd + W', 'すべてのエディターグループを閉じる', 'Editor', 'hard'),
('vscode', 'Cmd + K + Cmd + ←', 'エディターを左のグループに移動', 'Editor', 'hard'),
('vscode', 'Cmd + K + Cmd + →', 'エディターを右のグループに移動', 'Editor', 'hard'),
('vscode', 'Cmd + K + ←', '左のエディターグループにフォーカス', 'Editor', 'hard'),
('vscode', 'Cmd + K + →', '右のエディターグループにフォーカス', 'Editor', 'hard'),
('vscode', 'Cmd + K + Shift + ←', 'エディターグループを左に移動', 'Editor', 'hard'),
('vscode', 'Cmd + K + Shift + →', 'エディターグループを右に移動', 'Editor', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 高度な編集 (Advanced Editing) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + Shift + \\', 'ブロックを選択', 'Editing', 'hard'),
('vscode', 'Cmd + K + Cmd + L', '折りたたみを切り替え', 'Editing', 'hard'),
('vscode', 'Cmd + K + Cmd + [', 'すべてのサブ領域を折りたたむ', 'Editing', 'hard'),
('vscode', 'Cmd + K + Cmd + ]', 'すべてのサブ領域を展開', 'Editing', 'hard'),
('vscode', 'Cmd + K + Cmd + /', 'すべてのブロックコメントを折りたたむ', 'Editing', 'hard'),
('vscode', 'Cmd + K + Cmd + 8', 'すべての領域を折りたたむ', 'Editing', 'hard'),
('vscode', 'Cmd + K + Cmd + 9', 'すべての領域を展開', 'Editing', 'hard'),
('vscode', 'Cmd + J', '行を結合', 'Editing', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 選択操作 (Selection) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Shift + Cmd + →', '選択を拡大', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + Cmd + ←', '選択を縮小', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + L', 'すべての出現箇所を選択', 'Editing', 'hard'),
('vscode', 'Cmd + F2', 'すべての出現箇所を選択', 'Editing', 'hard'),
('vscode', 'Shift + Option + Drag', '列（ボックス）選択', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + Option + ↑', '列選択を上に', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + Option + ↓', '列選択を下に', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + Option + ←', '列選択を左に', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + Option + →', '列選択を右に', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + Option + PageUp', '列選択を上のページに', 'Editing', 'hard'),
('vscode', 'Cmd + Shift + Option + PageDown', '列選択を下のページに', 'Editing', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 表示操作 (View) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + K + Z', 'Zenモード', 'View', 'hard'),
('vscode', 'Cmd + =', 'ズームイン', 'View', 'hard'),
('vscode', 'Cmd + -', 'ズームアウト', 'View', 'hard'),
('vscode', 'Cmd + Shift + D', 'デバッグビューを開く', 'View', 'hard'),
('vscode', 'Cmd + Shift + U', '出力パネルを開く', 'View', 'hard'),
('vscode', 'Cmd + Shift + Y', 'デバッグコンソールを開く', 'View', 'hard'),
('vscode', 'Cmd + K + V', 'Markdownプレビューを横に開く', 'View', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- デバッグ操作 (Debug) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'F9', 'ブレークポイントの切り替え', 'Debug', 'hard'),
('vscode', 'F10', 'ステップオーバー', 'Debug', 'hard'),
('vscode', 'F11', 'ステップイン', 'Debug', 'hard'),
('vscode', 'Shift + F11', 'ステップアウト', 'Debug', 'hard'),
('vscode', 'Cmd + K + Cmd + I', 'ホバー情報を表示', 'Debug', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 統合ターミナル (Integrated Terminal) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + K + Cmd + H', 'ターミナルをクリア', 'Terminal', 'hard'),
('vscode', 'Cmd + Shift + [', '前のターミナルに切り替え', 'Terminal', 'hard'),
('vscode', 'Cmd + Shift + ]', '次のターミナルに切り替え', 'Terminal', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 最上級操作 (MadMax) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + K + Cmd + I', 'ホバー情報を表示', 'Information', 'madmax'),
('vscode', 'Cmd + Shift + Space', 'パラメーターヒントを表示', 'Information', 'madmax'),
('vscode', 'Cmd + K + Cmd + C', '行コメントを追加', 'Editing', 'madmax'),
('vscode', 'Cmd + K + Cmd + U', '行コメントを削除', 'Editing', 'madmax'),
('vscode', 'Cmd + K + M', '言語モードを変更', 'Settings', 'madmax'),
('vscode', 'Cmd + K + Cmd + F', '選択範囲をフォーマット', 'Editing', 'madmax'),
('vscode', 'Shift + Option + F', 'ドキュメントをフォーマット', 'Editing', 'madmax'),
('vscode', 'Cmd + K + Cmd + W', 'すべてのエディターを閉じる', 'View', 'madmax'),
('vscode', 'Cmd + K + F', 'フォルダーを閉じる', 'File', 'madmax'),
('vscode', 'Cmd + K + Cmd + R', 'ファイルの場所を開く', 'File', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 上級操作 (Advanced) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + K + Cmd + N', '色のテーマを変更', 'Settings', 'madmax'),
('vscode', 'Cmd + K + Cmd + P', 'ファイルをパスでコピー', 'File', 'madmax'),
('vscode', 'Cmd + K + P', 'アクティブファイルのパスをコピー', 'File', 'madmax'),
('vscode', 'Cmd + K + R', 'フォルダーで表示', 'File', 'madmax'),
('vscode', 'Cmd + K + O', '新しいウィンドウでフォルダーを開く', 'File', 'madmax'),
('vscode', 'Cmd + Shift + N', '新しいウィンドウ', 'Window', 'madmax'),
('vscode', 'Cmd + Shift + W', 'ウィンドウを閉じる', 'Window', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- リファクタリング (Refactoring) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + Shift + R', 'ワークスペースでシンボルの名前を変更', 'Refactoring', 'madmax'),
('vscode', 'Shift + Option + O', 'インポートを整理', 'Refactoring', 'madmax'),
('vscode', 'Cmd + K + Cmd + X', '末尾の空白を削除', 'Refactoring', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- ファイル操作 (File Operations) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + N', '新しいファイル', 'File', 'madmax'),
('vscode', 'Cmd + O', 'ファイルを開く', 'File', 'madmax'),
('vscode', 'Cmd + Shift + S', '名前を付けて保存', 'File', 'madmax'),
('vscode', 'Cmd + Option + S', 'すべて保存', 'File', 'madmax'),
('vscode', 'Cmd + W', 'エディターを閉じる', 'File', 'madmax'),
('vscode', 'Cmd + K + Cmd + Shift + S', 'すべてを保存せずに閉じる', 'File', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- ワークスペース操作 (Workspace) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + R', '最近使ったファイルを開く', 'Workspace', 'madmax'),
('vscode', 'Cmd + K + Cmd + O', 'フォルダーを開く', 'Workspace', 'madmax'),
('vscode', 'Cmd + K + Cmd + C', 'フォルダーをワークスペースに追加', 'Workspace', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- その他の便利なショートカット (Miscellaneous) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Cmd + K + Cmd + V', 'Markdownのプレビューを開く', 'Markdown', 'madmax'),
('vscode', 'Cmd + Option + [', 'フォールディング領域を折りたたむ', 'Editing', 'madmax'),
('vscode', 'Cmd + Option + ]', 'フォールディング領域を展開', 'Editing', 'madmax'),
('vscode', 'Cmd + K + Cmd + L', 'トグルフォールディング', 'Editing', 'madmax'),
('vscode', 'Cmd + K + Cmd + 7', 'すべてのコメントを折りたたむ', 'Editing', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;
