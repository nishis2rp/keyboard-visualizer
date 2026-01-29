INSERT INTO shortcuts (application, keys, description, category, difficulty, platform, windows_keys, macos_keys) VALUES
('vscode', 'F1', 'コマンドパレットを開く', 'General', 'standard', 'Cross-Platform', 'F1', 'F1'),
('vscode', 'Ctrl + `', 'ターミナルを開く/閉じる', 'Terminal', 'standard', 'Cross-Platform', 'Ctrl + `', 'Cmd + `'),
('vscode', 'Ctrl + Delete', '単語の最後まで削除', 'Editor', 'standard', 'Cross-Platform', 'Ctrl + Delete', 'Option + Delete'),
('vscode', 'Ctrl + Backspace', '単語の先頭まで削除', 'Editor', 'standard', 'Cross-Platform', 'Ctrl + Backspace', 'Cmd + Delete'),
('vscode', 'Alt + Up', '行を上に移動', 'Editor', 'standard', 'Cross-Platform', 'Alt + Up', 'Option + Up'),
('vscode', 'Alt + Down', '行を下に移動', 'Editor', 'standard', 'Cross-Platform', 'Alt + Down', 'Option + Down'),
('vscode', 'Shift + Alt + Up', '行を上にコピー', 'Editor', 'standard', 'Cross-Platform', 'Shift + Alt + Up', 'Shift + Option + Up'),
('vscode', 'Shift + Alt + Down', '行を下にコピー', 'Editor', 'standard', 'Cross-Platform', 'Shift + Alt + Down', 'Shift + Option + Down')
ON CONFLICT (application, keys) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  platform = EXCLUDED.platform,
  windows_keys = EXCLUDED.windows_keys,
  macos_keys = EXCLUDED.macos_keys;
