-- VSCode ショートカットを大幅に追加
-- エディタ管理、マルチカーソル、Git、ターミナルなどの操作を追加

-- エディタ管理 (Editor Management) - Basic
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + W', 'エディターを閉じる', 'Editor', 'basic'),
('vscode', 'Ctrl + Tab', '次のエディターに切り替え', 'Editor', 'basic'),
('vscode', 'Ctrl + Shift + Tab', '前のエディターに切り替え', 'Editor', 'basic'),
('vscode', 'Ctrl + \\', 'エディターを分割', 'Editor', 'basic'),
('vscode', 'Ctrl + 1', '最初のエディターグループにフォーカス', 'Editor', 'basic'),
('vscode', 'Ctrl + 2', '2番目のエディターグループにフォーカス', 'Editor', 'basic'),
('vscode', 'Ctrl + 3', '3番目のエディターグループにフォーカス', 'Editor', 'basic')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 行操作 (Line Operations) - Basic
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Enter', '下に行を挿入', 'Editing', 'basic'),
('vscode', 'Ctrl + Shift + Enter', '上に行を挿入', 'Editing', 'basic'),
('vscode', 'Ctrl + ]', 'インデントを増やす', 'Editing', 'basic'),
('vscode', 'Ctrl + [', 'インデントを減らす', 'Editing', 'basic'),
('vscode', 'Home', '行の先頭に移動', 'Navigation', 'basic'),
('vscode', 'End', '行の末尾に移動', 'Navigation', 'basic')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- マルチカーソル操作 (Multi-Cursor) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Alt + Click', 'カーソルを追加', 'Editing', 'standard'),
('vscode', 'Ctrl + Alt + ↑', '上にカーソルを追加', 'Editing', 'standard'),
('vscode', 'Ctrl + Alt + ↓', '下にカーソルを追加', 'Editing', 'standard'),
('vscode', 'Ctrl + U', '最後のカーソル操作を元に戻す', 'Editing', 'standard'),
('vscode', 'Shift + Alt + I', '選択した各行の末尾にカーソルを追加', 'Editing', 'standard'),
('vscode', 'Ctrl + L', '行を選択', 'Editing', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 検索と置換 (Search & Replace) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'F3', '次を検索', 'Search', 'standard'),
('vscode', 'Shift + F3', '前を検索', 'Search', 'standard'),
('vscode', 'Alt + Enter', '一致するすべてを選択', 'Search', 'standard'),
('vscode', 'Ctrl + K + Ctrl + D', '次の一致まで移動', 'Search', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- ナビゲーション (Navigation) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Shift + \\', '対応する括弧に移動', 'Navigation', 'standard'),
('vscode', 'Ctrl + Home', 'ファイルの先頭に移動', 'Navigation', 'standard'),
('vscode', 'Ctrl + End', 'ファイルの末尾に移動', 'Navigation', 'standard'),
('vscode', 'Ctrl + ↑', '画面を上にスクロール', 'Navigation', 'standard'),
('vscode', 'Ctrl + ↓', '画面を下にスクロール', 'Navigation', 'standard'),
('vscode', 'Ctrl + PageUp', '前のエディターを開く', 'Navigation', 'standard'),
('vscode', 'Ctrl + PageDown', '次のエディターを開く', 'Navigation', 'standard'),
('vscode', 'Alt + ←', '戻る', 'Navigation', 'standard'),
('vscode', 'Alt + →', '進む', 'Navigation', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- コード操作 (Code Operations) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Shift + Alt + A', 'ブロックコメントの切り替え', 'Editing', 'standard'),
('vscode', 'Ctrl + Space', 'IntelliSenseをトリガー', 'Editing', 'standard'),
('vscode', 'Ctrl + .', 'クイックフィックス', 'Editing', 'standard'),
('vscode', 'F12', '定義へ移動', 'Navigation', 'standard'),
('vscode', 'Alt + F12', '定義をここに表示', 'Navigation', 'standard'),
('vscode', 'Ctrl + K + F12', '定義を横に開く', 'Navigation', 'standard'),
('vscode', 'Shift + F12', '参照を表示', 'Navigation', 'standard'),
('vscode', 'Ctrl + F12', '実装へ移動', 'Navigation', 'standard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- ターミナル操作 (Terminal) - Standard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Shift + `', '新しいターミナルを作成', 'Terminal', 'standard'),
('vscode', 'Ctrl + Shift + C', 'ターミナルをコピー', 'Terminal', 'standard'),
('vscode', 'Ctrl + Shift + V', 'ターミナルに貼り付け', 'Terminal', 'standard')
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

-- エディタ管理 (Editor Management) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + K + W', 'すべてのエディターを閉じる', 'Editor', 'hard'),
('vscode', 'Ctrl + K + Ctrl + W', 'すべてのエディターグループを閉じる', 'Editor', 'hard'),
('vscode', 'Ctrl + K + Ctrl + ←', 'エディターを左のグループに移動', 'Editor', 'hard'),
('vscode', 'Ctrl + K + Ctrl + →', 'エディターを右のグループに移動', 'Editor', 'hard'),
('vscode', 'Ctrl + K + ←', '左のエディターグループにフォーカス', 'Editor', 'hard'),
('vscode', 'Ctrl + K + →', '右のエディターグループにフォーカス', 'Editor', 'hard'),
('vscode', 'Ctrl + K + Shift + ←', 'エディターグループを左に移動', 'Editor', 'hard'),
('vscode', 'Ctrl + K + Shift + →', 'エディターグループを右に移動', 'Editor', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 高度な編集 (Advanced Editing) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Shift + \\', 'ブロックを選択', 'Editing', 'hard'),
('vscode', 'Ctrl + K + Ctrl + L', '折りたたみを切り替え', 'Editing', 'hard'),
('vscode', 'Ctrl + K + Ctrl + [', 'すべてのサブ領域を折りたたむ', 'Editing', 'hard'),
('vscode', 'Ctrl + K + Ctrl + ]', 'すべてのサブ領域を展開', 'Editing', 'hard'),
('vscode', 'Ctrl + K + Ctrl + /', 'すべてのブロックコメントを折りたたむ', 'Editing', 'hard'),
('vscode', 'Ctrl + K + Ctrl + 8', 'すべての領域を折りたたむ', 'Editing', 'hard'),
('vscode', 'Ctrl + K + Ctrl + 9', 'すべての領域を展開', 'Editing', 'hard'),
('vscode', 'Ctrl + J', '行を結合', 'Editing', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 選択操作 (Selection) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Shift + Alt + →', '選択を拡大', 'Editing', 'hard'),
('vscode', 'Shift + Alt + ←', '選択を縮小', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + L', 'すべての出現箇所を選択', 'Editing', 'hard'),
('vscode', 'Ctrl + F2', 'すべての出現箇所を選択', 'Editing', 'hard'),
('vscode', 'Shift + Alt + Drag', '列（ボックス）選択', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + Alt + ↑', '列選択を上に', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + Alt + ↓', '列選択を下に', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + Alt + ←', '列選択を左に', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + Alt + →', '列選択を右に', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + Alt + PageUp', '列選択を上のページに', 'Editing', 'hard'),
('vscode', 'Ctrl + Shift + Alt + PageDown', '列選択を下のページに', 'Editing', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 表示操作 (View) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + K + Z', 'Zenモード', 'View', 'hard'),
('vscode', 'Ctrl + =', 'ズームイン', 'View', 'hard'),
('vscode', 'Ctrl + -', 'ズームアウト', 'View', 'hard'),
('vscode', 'Ctrl + Shift + D', 'デバッグビューを開く', 'View', 'hard'),
('vscode', 'Ctrl + Shift + U', '出力パネルを開く', 'View', 'hard'),
('vscode', 'Ctrl + Shift + Y', 'デバッグコンソールを開く', 'View', 'hard'),
('vscode', 'Ctrl + K + V', 'Markdownプレビューを横に開く', 'View', 'hard')
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
('vscode', 'Ctrl + K + Ctrl + I', 'ホバー情報を表示', 'Debug', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 統合ターミナル (Integrated Terminal) - Hard
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + K + Ctrl + H', 'ターミナルをクリア', 'Terminal', 'hard'),
('vscode', 'Ctrl + PageUp', '前のターミナルに切り替え', 'Terminal', 'hard'),
('vscode', 'Ctrl + PageDown', '次のターミナルに切り替え', 'Terminal', 'hard')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- 上級操作 (Advanced) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + K + Ctrl + N', '色のテーマを変更', 'Settings', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + P', 'ファイルをパスでコピー', 'File', 'madmax'),
('vscode', 'Ctrl + K + P', 'アクティブファイルのパスをコピー', 'File', 'madmax'),
('vscode', 'Ctrl + K + R', 'フォルダーで表示', 'File', 'madmax'),
('vscode', 'Ctrl + K + O', '新しいウィンドウでフォルダーを開く', 'File', 'madmax'),
('vscode', 'Ctrl + Shift + N', '新しいウィンドウ', 'Window', 'madmax'),
('vscode', 'Ctrl + Shift + W', 'ウィンドウを閉じる', 'Window', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- リファクタリング (Refactoring) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + Shift + R', 'ワークスペースでシンボルの名前を変更', 'Refactoring', 'madmax'),
('vscode', 'Shift + Alt + O', 'インポートを整理', 'Refactoring', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + X', '末尾の空白を削除', 'Refactoring', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- ファイル操作 (File Operations) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + N', '新しいファイル', 'File', 'madmax'),
('vscode', 'Ctrl + O', 'ファイルを開く', 'File', 'madmax'),
('vscode', 'Ctrl + Shift + S', '名前を付けて保存', 'File', 'madmax'),
('vscode', 'Ctrl + K + S', 'すべて保存', 'File', 'madmax'),
('vscode', 'Ctrl + F4', 'エディターを閉じる', 'File', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + Shift + S', 'すべてを保存せずに閉じる', 'File', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- ワークスペース操作 (Workspace) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + R', '最近使ったファイルを開く', 'Workspace', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + O', 'フォルダーを開く', 'Workspace', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + C', 'フォルダーをワークスペースに追加', 'Workspace', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;

-- その他の便利なショートカット (Miscellaneous) - MadMax
INSERT INTO shortcuts (application, keys, description, category, difficulty) VALUES
('vscode', 'Ctrl + K + Ctrl + V', 'Markdownのプレビューを開く', 'Markdown', 'madmax'),
('vscode', 'Ctrl + Shift + [ ', 'フォールディング領域を折りたたむ', 'Editing', 'madmax'),
('vscode', 'Ctrl + Shift + ] ', 'フォールディング領域を展開', 'Editing', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + L', 'トグルフォールディング', 'Editing', 'madmax'),
('vscode', 'Ctrl + K + Ctrl + 7', 'すべてのコメントを折りたたむ', 'Editing', 'madmax')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty;
