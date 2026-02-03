-- Add comprehensive Gmail keyboard shortcuts
-- Gmail has 80+ official shortcuts for efficient email management

-- Basic shortcuts - よく使う基本操作
INSERT INTO shortcuts (application, keys, description, difficulty, platform) VALUES
('gmail', 'c', '新規メールを作成', 'basic', 'Cross-Platform'),
('gmail', 'r', '返信', 'basic', 'Cross-Platform'),
('gmail', 'a', '全員に返信', 'basic', 'Cross-Platform'),
('gmail', 'f', '転送', 'basic', 'Cross-Platform'),
('gmail', 'e', 'アーカイブ', 'basic', 'Cross-Platform'),
('gmail', '#', '削除', 'basic', 'Cross-Platform'),
('gmail', '/', '検索ボックスに移動', 'basic', 'Cross-Platform'),
('gmail', 's', 'スターを付ける/外す', 'basic', 'Cross-Platform'),
('gmail', 'u', 'スレッドリストに戻る', 'basic', 'Cross-Platform'),
('gmail', 'j', '次のスレッドに移動', 'basic', 'Cross-Platform'),
('gmail', 'k', '前のスレッドに移動', 'basic', 'Cross-Platform'),
('gmail', 'n', '次のメッセージ', 'basic', 'Cross-Platform'),
('gmail', 'p', '前のメッセージ', 'basic', 'Cross-Platform')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty;

-- Standard shortcuts - 一般的な操作
INSERT INTO shortcuts (application, keys, description, difficulty, platform) VALUES
('gmail', 'l', 'ラベルを付ける', 'standard', 'Cross-Platform'),
('gmail', 'v', 'フォルダに移動', 'standard', 'Cross-Platform'),
('gmail', 'x', 'スレッドを選択', 'standard', 'Cross-Platform'),
('gmail', '!', '迷惑メールとして報告', 'standard', 'Cross-Platform'),
('gmail', 'z', '操作を元に戻す', 'standard', 'Cross-Platform'),
('gmail', 'Shift + i', '既読にする', 'standard', 'Cross-Platform'),
('gmail', 'Shift + u', '未読にする', 'standard', 'Cross-Platform'),
('gmail', 'Shift + c', 'Ccに追加', 'standard', 'Cross-Platform'),
('gmail', 'Shift + b', 'Bccに追加', 'standard', 'Cross-Platform'),
('gmail', '[', 'アーカイブして前のスレッドへ', 'standard', 'Cross-Platform'),
('gmail', ']', 'アーカイブして次のスレッドへ', 'standard', 'Cross-Platform'),
('gmail', '{', 'アーカイブしてリストへ戻る', 'standard', 'Cross-Platform'),
('gmail', 'o', 'スレッドを開く', 'standard', 'Cross-Platform'),
('gmail', 'Enter', 'スレッドを開く', 'standard', 'Cross-Platform'),
('gmail', 'Shift + n', '受信トレイを更新', 'standard', 'Cross-Platform'),
('gmail', 'Ctrl + s', '下書きを保存', 'standard', 'Cross-Platform'),
('gmail', 'Ctrl + Enter', 'メールを送信', 'standard', 'Cross-Platform'),
('gmail', 'Shift + Esc', 'フォーカスを外す', 'standard', 'Cross-Platform'),
('gmail', 'Esc', '入力フィールドから抜ける', 'standard', 'Cross-Platform'),
('gmail', 'Tab + Enter', 'メールを送信（カーソルが送信ボタン上）', 'standard', 'Cross-Platform'),
('gmail', 'y + o', 'チャットを開く', 'standard', 'Cross-Platform')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty;

-- Madmax shortcuts - 複数キーのナビゲーション
INSERT INTO shortcuts (application, keys, description, difficulty, platform) VALUES
('gmail', 'g + i', '受信トレイに移動', 'madmax', 'Cross-Platform'),
('gmail', 'g + s', 'スター付きに移動', 'madmax', 'Cross-Platform'),
('gmail', 'g + t', '送信済みに移動', 'madmax', 'Cross-Platform'),
('gmail', 'g + d', '下書きに移動', 'madmax', 'Cross-Platform'),
('gmail', 'g + a', 'すべてのメールに移動', 'madmax', 'Cross-Platform'),
('gmail', 'g + c', '連絡先に移動', 'madmax', 'Cross-Platform'),
('gmail', 'g + k', 'タスクに移動', 'madmax', 'Cross-Platform'),
('gmail', 'g + l', 'ラベルに移動', 'madmax', 'Cross-Platform')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty;

-- Madmax shortcuts - 複数キーの選択操作
INSERT INTO shortcuts (application, keys, description, difficulty, platform) VALUES
('gmail', '* + a', 'すべてのスレッドを選択', 'madmax', 'Cross-Platform'),
('gmail', '* + n', 'すべての選択を解除', 'madmax', 'Cross-Platform'),
('gmail', '* + r', '既読のスレッドを選択', 'madmax', 'Cross-Platform'),
('gmail', '* + u', '未読のスレッドを選択', 'madmax', 'Cross-Platform'),
('gmail', '* + s', 'スター付きスレッドを選択', 'madmax', 'Cross-Platform'),
('gmail', '* + t', 'スター未付きスレッドを選択', 'madmax', 'Cross-Platform')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty;

-- Madmax shortcuts - フォーマット操作
INSERT INTO shortcuts (application, keys, description, difficulty, platform) VALUES
('gmail', 'Ctrl + Shift + 5', '取り消し線', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + Shift + 7', '番号付きリスト', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + Shift + 8', '箇条書きリスト', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + Shift + 9', '引用', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + Shift + -', 'フォントサイズを小さく', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + Shift + +', 'フォントサイズを大きく', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + Shift + l', '左揃え', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + Shift + e', '中央揃え', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + Shift + r', '右揃え', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + \', '書式をクリア', 'madmax', 'Cross-Platform')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty;

-- Madmax shortcuts - その他の高度な操作
INSERT INTO shortcuts (application, keys, description, difficulty, platform) VALUES
('gmail', '. + i', '重要マークを付ける', 'madmax', 'Cross-Platform'),
('gmail', '. + b', '重要マークを外す', 'madmax', 'Cross-Platform'),
('gmail', '. + u', '未読にする', 'madmax', 'Cross-Platform'),
('gmail', 'm + a', 'すべてを既読にする', 'madmax', 'Cross-Platform'),
('gmail', 'Shift + 3', '削除（同じく #）', 'madmax', 'Cross-Platform'),
('gmail', 'Shift + 1', '迷惑メール（同じく !）', 'madmax', 'Cross-Platform'),
('gmail', 'Ctrl + k', 'リンクを挿入', 'madmax', 'Cross-Platform'),
('gmail', 'Shift + t', '新しいタスクを追加', 'madmax', 'Cross-Platform')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty;
