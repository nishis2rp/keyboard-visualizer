-- Add Microsoft Word shortcuts
-- Basic editing, formatting, navigation, and document management shortcuts

-- Basic File Operations
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + N', '新しい文書を作成', 'File', 'basic', 'Cross-Platform', 'Ctrl + N', 'Cmd + N') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + O', '文書を開く', 'File', 'basic', 'Cross-Platform', 'Ctrl + O', 'Cmd + O') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + S', '文書を保存', 'File', 'basic', 'Cross-Platform', 'Ctrl + S', 'Cmd + S') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'F12', '名前を付けて保存', 'File', 'standard', 'Windows', 'F12', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + P', '印刷', 'File', 'basic', 'Cross-Platform', 'Ctrl + P', 'Cmd + P') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + W', '文書を閉じる', 'File', 'basic', 'Cross-Platform', 'Ctrl + W', 'Cmd + W') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Alt + F4', 'Wordを終了', 'File', 'basic', 'Windows', 'Alt + F4', NULL) ON CONFLICT (application, keys) DO NOTHING;

-- Basic Editing
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + C', 'コピー', 'Edit', 'basic', 'Cross-Platform', 'Ctrl + C', 'Cmd + C') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + X', '切り取り', 'Edit', 'basic', 'Cross-Platform', 'Ctrl + X', 'Cmd + X') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + V', '貼り付け', 'Edit', 'basic', 'Cross-Platform', 'Ctrl + V', 'Cmd + V') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Z', '元に戻す', 'Edit', 'basic', 'Cross-Platform', 'Ctrl + Z', 'Cmd + Z') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Y', 'やり直し', 'Edit', 'basic', 'Cross-Platform', 'Ctrl + Y', 'Cmd + Y') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + A', 'すべて選択', 'Edit', 'basic', 'Cross-Platform', 'Ctrl + A', 'Cmd + A') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Delete', '右の文字を削除', 'Edit', 'basic', 'Cross-Platform', 'Delete', 'Delete') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Backspace', '左の文字を削除', 'Edit', 'basic', 'Cross-Platform', 'Backspace', 'Backspace') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Backspace', '前の単語を削除', 'Edit', 'standard', 'Cross-Platform', 'Ctrl + Backspace', 'Cmd + Backspace') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Delete', '次の単語を削除', 'Edit', 'standard', 'Cross-Platform', 'Ctrl + Delete', 'Cmd + Delete') ON CONFLICT (application, keys) DO NOTHING;

-- Find and Replace
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + F', '検索', 'Navigation', 'basic', 'Cross-Platform', 'Ctrl + F', 'Cmd + F') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + H', '置換', 'Navigation', 'basic', 'Cross-Platform', 'Ctrl + H', 'Cmd + H') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + G', 'ページに移動', 'Navigation', 'standard', 'Cross-Platform', 'Ctrl + G', 'Cmd + Option + G') ON CONFLICT (application, keys) DO NOTHING;

-- Text Formatting - Font Style
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + B', '太字', 'Format', 'basic', 'Cross-Platform', 'Ctrl + B', 'Cmd + B') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + I', '斜体', 'Format', 'basic', 'Cross-Platform', 'Ctrl + I', 'Cmd + I') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + U', '下線', 'Format', 'basic', 'Cross-Platform', 'Ctrl + U', 'Cmd + U') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + D', '二重下線', 'Format', 'hard', 'Cross-Platform', 'Ctrl + Shift + D', 'Cmd + Shift + D') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + W', '単語のみ下線', 'Format', 'hard', 'Windows', 'Ctrl + Shift + W', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + D', 'フォントダイアログを開く', 'Format', 'standard', 'Cross-Platform', 'Ctrl + D', 'Cmd + D') ON CONFLICT (application, keys) DO NOTHING;

-- Text Formatting - Font Size
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + >', 'フォントサイズを拡大', 'Format', 'standard', 'Cross-Platform', 'Ctrl + Shift + >', 'Cmd + Shift + >') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + <', 'フォントサイズを縮小', 'Format', 'standard', 'Cross-Platform', 'Ctrl + Shift + <', 'Cmd + Shift + <') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + ]', 'フォントサイズを1pt拡大', 'Format', 'hard', 'Windows', 'Ctrl + ]', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + [', 'フォントサイズを1pt縮小', 'Format', 'hard', 'Windows', 'Ctrl + [', NULL) ON CONFLICT (application, keys) DO NOTHING;

-- Text Formatting - Case and Style
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Shift + F3', '大文字/小文字を切り替え', 'Format', 'standard', 'Cross-Platform', 'Shift + F3', 'Shift + F3') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + A', 'すべて大文字', 'Format', 'hard', 'Windows', 'Ctrl + Shift + A', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + K', 'すべて小文字', 'Format', 'hard', 'Windows', 'Ctrl + Shift + K', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Space', '書式をクリア', 'Format', 'standard', 'Cross-Platform', 'Ctrl + Space', 'Cmd + Space') ON CONFLICT (application, keys) DO NOTHING;

-- Paragraph Alignment
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + L', '左揃え', 'Format', 'basic', 'Cross-Platform', 'Ctrl + L', 'Cmd + L') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + E', '中央揃え', 'Format', 'basic', 'Cross-Platform', 'Ctrl + E', 'Cmd + E') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + R', '右揃え', 'Format', 'basic', 'Cross-Platform', 'Ctrl + R', 'Cmd + R') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + J', '両端揃え', 'Format', 'standard', 'Cross-Platform', 'Ctrl + J', 'Cmd + J') ON CONFLICT (application, keys) DO NOTHING;

-- Paragraph Formatting
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + M', '左インデントを増やす', 'Format', 'standard', 'Cross-Platform', 'Ctrl + M', 'Cmd + M') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + M', '左インデントを減らす', 'Format', 'standard', 'Cross-Platform', 'Ctrl + Shift + M', 'Cmd + Shift + M') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + T', 'ぶら下げインデントを設定', 'Format', 'hard', 'Windows', 'Ctrl + T', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + T', 'ぶら下げインデントを解除', 'Format', 'hard', 'Windows', 'Ctrl + Shift + T', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + 1', '行間を1行に設定', 'Format', 'standard', 'Cross-Platform', 'Ctrl + 1', 'Cmd + 1') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + 2', '行間を2行に設定', 'Format', 'standard', 'Cross-Platform', 'Ctrl + 2', 'Cmd + 2') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + 5', '行間を1.5行に設定', 'Format', 'hard', 'Cross-Platform', 'Ctrl + 5', 'Cmd + 5') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + 0', '段落前の余白を追加/削除', 'Format', 'hard', 'Windows', 'Ctrl + 0', NULL) ON CONFLICT (application, keys) DO NOTHING;

-- Styles
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + S', 'スタイルを適用', 'Format', 'standard', 'Windows', 'Ctrl + Shift + S', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Alt + 1', '見出し1を適用', 'Format', 'standard', 'Windows', 'Ctrl + Alt + 1', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Alt + 2', '見出し2を適用', 'Format', 'standard', 'Windows', 'Ctrl + Alt + 2', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Alt + 3', '見出し3を適用', 'Format', 'standard', 'Windows', 'Ctrl + Alt + 3', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + N', '標準スタイルを適用', 'Format', 'hard', 'Cross-Platform', 'Ctrl + Shift + N', 'Cmd + Shift + N') ON CONFLICT (application, keys) DO NOTHING;

-- Navigation
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Home', '文書の先頭に移動', 'Navigation', 'basic', 'Cross-Platform', 'Ctrl + Home', 'Cmd + Home') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + End', '文書の末尾に移動', 'Navigation', 'basic', 'Cross-Platform', 'Ctrl + End', 'Cmd + End') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + ←', '前の単語に移動', 'Navigation', 'standard', 'Cross-Platform', 'Ctrl + ←', 'Cmd + ←') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + →', '次の単語に移動', 'Navigation', 'standard', 'Cross-Platform', 'Ctrl + →', 'Cmd + →') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + ↑', '前の段落に移動', 'Navigation', 'standard', 'Cross-Platform', 'Ctrl + ↑', 'Cmd + ↑') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + ↓', '次の段落に移動', 'Navigation', 'standard', 'Cross-Platform', 'Ctrl + ↓', 'Cmd + ↓') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Page Up', '1画面上にスクロール', 'Navigation', 'basic', 'Cross-Platform', 'Page Up', 'Page Up') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Page Down', '1画面下にスクロール', 'Navigation', 'basic', 'Cross-Platform', 'Page Down', 'Page Down') ON CONFLICT (application, keys) DO NOTHING;

-- Selection
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Shift + ←', '左に1文字選択', 'Selection', 'basic', 'Cross-Platform', 'Shift + ←', 'Shift + ←') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Shift + →', '右に1文字選択', 'Selection', 'basic', 'Cross-Platform', 'Shift + →', 'Shift + →') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + ←', '前の単語まで選択', 'Selection', 'standard', 'Cross-Platform', 'Ctrl + Shift + ←', 'Cmd + Shift + ←') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + →', '次の単語まで選択', 'Selection', 'standard', 'Cross-Platform', 'Ctrl + Shift + →', 'Cmd + Shift + →') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Shift + Home', '行の先頭まで選択', 'Selection', 'standard', 'Cross-Platform', 'Shift + Home', 'Shift + Home') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Shift + End', '行の末尾まで選択', 'Selection', 'standard', 'Cross-Platform', 'Shift + End', 'Shift + End') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + Home', '文書の先頭まで選択', 'Selection', 'hard', 'Cross-Platform', 'Ctrl + Shift + Home', 'Cmd + Shift + Home') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + End', '文書の末尾まで選択', 'Selection', 'hard', 'Cross-Platform', 'Ctrl + Shift + End', 'Cmd + Shift + End') ON CONFLICT (application, keys) DO NOTHING;

-- Special Characters and Symbols
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Enter', '改ページを挿入', 'Insert', 'standard', 'Cross-Platform', 'Ctrl + Enter', 'Cmd + Enter') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Shift + Enter', '改行（段落を分けない）', 'Insert', 'standard', 'Cross-Platform', 'Shift + Enter', 'Shift + Enter') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + Enter', '段区切りを挿入', 'Insert', 'hard', 'Windows', 'Ctrl + Shift + Enter', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + -', '任意指定のハイフンを挿入', 'Insert', 'hard', 'Windows', 'Ctrl + -', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + -', '改行なしハイフンを挿入', 'Insert', 'hard', 'Windows', 'Ctrl + Shift + -', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + Space', '改行なしスペースを挿入', 'Insert', 'hard', 'Cross-Platform', 'Ctrl + Shift + Space', 'Cmd + Shift + Space') ON CONFLICT (application, keys) DO NOTHING;

-- Tables
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Tab', '次のセルに移動（表内）', 'Table', 'basic', 'Cross-Platform', 'Tab', 'Tab') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Shift + Tab', '前のセルに移動（表内）', 'Table', 'basic', 'Cross-Platform', 'Shift + Tab', 'Shift + Tab') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Alt + Home', '行の最初のセルに移動', 'Table', 'hard', 'Windows', 'Alt + Home', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Alt + End', '行の最後のセルに移動', 'Table', 'hard', 'Windows', 'Alt + End', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Alt + Page Up', '列の最初のセルに移動', 'Table', 'hard', 'Windows', 'Alt + Page Up', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Alt + Page Down', '列の最後のセルに移動', 'Table', 'hard', 'Windows', 'Alt + Page Down', NULL) ON CONFLICT (application, keys) DO NOTHING;

-- View and Window
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Alt + S', 'ウィンドウを分割', 'View', 'hard', 'Windows', 'Ctrl + Alt + S', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Alt + Shift + C', 'ウィンドウ分割を解除', 'View', 'hard', 'Windows', 'Alt + Shift + C', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + F6', '次のウィンドウに切り替え', 'View', 'standard', 'Windows', 'Ctrl + F6', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + F6', '前のウィンドウに切り替え', 'View', 'hard', 'Windows', 'Ctrl + Shift + F6', NULL) ON CONFLICT (application, keys) DO NOTHING;

-- Review and Comments
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Alt + M', 'コメントを挿入', 'Review', 'standard', 'Windows', 'Ctrl + Alt + M', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + Shift + E', '変更履歴の記録ON/OFF', 'Review', 'hard', 'Windows', 'Ctrl + Shift + E', NULL) ON CONFLICT (application, keys) DO NOTHING;

-- Other Useful Shortcuts
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'F7', 'スペルチェックと文章校正', 'Tools', 'standard', 'Cross-Platform', 'F7', 'F7') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Shift + F7', '類義語辞典', 'Tools', 'hard', 'Windows', 'Shift + F7', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Ctrl + K', 'ハイパーリンクを挿入', 'Insert', 'standard', 'Cross-Platform', 'Ctrl + K', 'Cmd + K') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Alt + Shift + D', '日付を挿入', 'Insert', 'hard', 'Windows', 'Alt + Shift + D', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'Alt + Shift + T', '時刻を挿入', 'Insert', 'hard', 'Windows', 'Alt + Shift + T', NULL) ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES ('word', 'F1', 'ヘルプを表示', 'Help', 'basic', 'Cross-Platform', 'F1', 'F1') ON CONFLICT (application, keys) DO NOTHING;
