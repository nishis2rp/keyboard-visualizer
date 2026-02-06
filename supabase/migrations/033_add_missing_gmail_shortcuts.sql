-- Add missing Gmail keyboard shortcuts (expanded set)

INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys, windows_protection_level, macos_protection_level)
VALUES
-- ナビゲーション
('gmail', 'Ctrl + .', '[タブ] 次の受信トレイセクションに移動', 'ナビゲーション', 'madmax', 'Cross-Platform', 'Ctrl + .', 'Cmd + .', 'none', 'none'),
('gmail', 'Ctrl + ,', '[タブ] 前の受信トレイセクションに移動', 'ナビゲーション', 'madmax', 'Cross-Platform', 'Ctrl + ,', 'Cmd + ,', 'none', 'none'),
('gmail', 'Ctrl + Down', 'チャットに移動', 'ナビゲーション', 'madmax', 'Cross-Platform', 'Ctrl + Down', 'Cmd + Down', 'none', 'none'),
('gmail', 'Shift + G', '前のページに移動', 'ナビゲーション', 'madmax', 'Cross-Platform', 'Shift + G', 'Shift + G', 'none', 'none'),
('gmail', 'Shift + J', '古いスレッドに移動', 'ナビゲーション', 'madmax', 'Cross-Platform', 'Shift + J', 'Shift + J', 'none', 'none'),
('gmail', 'Shift + K', '新しいスレッドに移動', 'ナビゲーション', 'madmax', 'Cross-Platform', 'Shift + K', 'Shift + K', 'none', 'none'),
('gmail', 'Shift + O', '会話を開く', 'ナビゲーション', 'madmax', 'Cross-Platform', 'Shift + O', 'Shift + O', 'none', 'none'),
('gmail', 'g + p', '通話に移動', 'ナビゲーション', 'madmax', 'Cross-Platform', 'g + p', 'g + p', 'none', 'none'),

-- アクション
('gmail', 'Shift + #', '[削除] 削除（同じく #）', 'アクション', 'madmax', 'Cross-Platform', 'Shift + #', 'Shift + #', 'none', 'none'),
('gmail', 'Shift + H', 'スレッドを既読/未読切り替え', 'アクション', 'madmax', 'Cross-Platform', 'Shift + H', 'Shift + H', 'none', 'none'),
('gmail', 'Shift + 8', 'スターを付ける/外す（同じく s）', 'アクション', 'madmax', 'Cross-Platform', 'Shift + 8', 'Shift + 8', 'none', 'none'),
('gmail', 'Shift + X', 'スレッドを選択してラベルメニューを開く', 'ラベル', 'madmax', 'Cross-Platform', 'Shift + X', 'Shift + X', 'none', 'none'),
('gmail', 'Shift + L', 'ラベルメニューを開く', 'ラベル', 'madmax', 'Cross-Platform', 'Shift + L', 'Shift + L', 'none', 'none'),
('gmail', 'Shift + V', 'フォルダに移動メニューを開く', 'アクション', 'madmax', 'Cross-Platform', 'Shift + V', 'Shift + V', 'none', 'none'),

-- ビュー
('gmail', 'h', 'スレッドを展開/折りたたみ', 'ビュー', 'madmax', 'Cross-Platform', 'h', 'h', 'none', 'none'),

-- ラベル（数字キー）
('gmail', '1', 'ラベル1を適用/削除', 'ラベル', 'madmax', 'Cross-Platform', '1', '1', 'none', 'none'),
('gmail', '2', 'ラベル2を適用/削除', 'ラベル', 'madmax', 'Cross-Platform', '2', '2', 'none', 'none'),
('gmail', '3', 'ラベル3を適用/削除', 'ラベル', 'madmax', 'Cross-Platform', '3', '3', 'none', 'none'),
('gmail', '4', 'ラベル4を適用/削除', 'ラベル', 'madmax', 'Cross-Platform', '4', '4', 'none', 'none'),

-- 書式設定
('gmail', 'Ctrl + ]', '[書式] インデント', '書式設定', 'madmax', 'Cross-Platform', 'Ctrl + ]', 'Cmd + ]', 'none', 'none'),
('gmail', 'Ctrl + [', '[書式] インデント解除', '書式設定', 'madmax', 'Cross-Platform', 'Ctrl + [', 'Cmd + [', 'none', 'none'),
('gmail', 'Ctrl + Shift + X', '[書式] インデント解除', '書式設定', 'madmax', 'Cross-Platform', 'Ctrl + Shift + X', 'Cmd + Shift + X', 'none', 'none'),
('gmail', 'Ctrl + Shift + L', '[書式] 左揃え', '書式設定', 'madmax', 'Cross-Platform', 'Ctrl + Shift + L', 'Cmd + Shift + L', 'none', 'none'),
('gmail', 'Ctrl + Shift + E', '[書式] 中央揃え', '書式設定', 'madmax', 'Cross-Platform', 'Ctrl + Shift + E', 'Cmd + Shift + E', 'none', 'none'),
('gmail', 'Ctrl + Shift + R', '[書式] 右揃え', '書式設定', 'madmax', 'Cross-Platform', 'Ctrl + Shift + R', 'Cmd + Shift + R', 'none', 'none'),

-- チャット
('gmail', 'Ctrl + ;', 'アーカイブ済みチャットを表示', 'チャット', 'madmax', 'Cross-Platform', 'Ctrl + ;', 'Cmd + ;', 'none', 'none'),

-- 作成
('gmail', 'Shift + Enter', '作成ウィンドウを全画面表示', '作成', 'madmax', 'Cross-Platform', 'Shift + Enter', 'Shift + Enter', 'none', 'none'),
('gmail', 'Ctrl + Shift + 2', '絵文字を挿入', '作成', 'madmax', 'Cross-Platform', 'Ctrl + Shift + 2', 'Cmd + Shift + 2', 'none', 'none'),

-- 重要マーク（追加のバリエーション）
('gmail', 'Shift + -', '[重要] 重要マークを外す（同じく -）', '重要', 'madmax', 'Cross-Platform', 'Shift + -', 'Shift + -', 'none', 'none'),
('gmail', 'Shift + =', '[重要] 重要マークを付ける（同じく +）', '重要', 'madmax', 'Cross-Platform', 'Shift + =', 'Shift + =', 'none', 'none');
