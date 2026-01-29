-- Update Slack shortcuts to match the official keyboard shortcuts list

-- First, delete existing Slack shortcuts
DELETE FROM shortcuts WHERE application = 'slack';

-- Basic shortcuts
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + /', '[基本] このパネルを開く') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + N', '[基本] 新規メッセージ') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + K', '[基本] 新規メッセージ') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + N', '[基本] 新しい canvas') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + K', '[基本] 次に移動...') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'T', '[基本] 次に移動...') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + G', '[基本] 検索') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + F', '[基本] 現在の会話を検索する') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', '↑', '[基本] 直近のメッセージを編集する') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + ↑', '[基本] 直近のメッセージを編集する') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Z', '[基本] 直近のメッセージの送信を取り消す') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Alt + ←', '[基本] 履歴に戻る') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Alt + →', '[基本] 履歴に進む') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + A', '[基本] 全未読') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + T', '[基本] スレッド') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Esc', '[基本] ダイアログを閉じる') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + Y', '[基本] ステータスを設定') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'F1', '[基本] ヘルプを開く') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + F10', '[基本] コンテキストメニューを開く') ON CONFLICT (application, keys) DO NOTHING;

-- Sidebar shortcuts
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + D', '[サイドバー] 表示 / 非表示') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + ←', '[サイドバー] サイズ変更') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + →', '[サイドバー] サイズ変更') ON CONFLICT (application, keys) DO NOTHING;

-- Navigation shortcuts
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + 1', '[操作方法] ホーム') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + 2', '[操作方法] DM') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + 3', '[操作方法] アクティビティ') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + M', '[操作方法] アクティビティ') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + 4', '[操作方法] 後で') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + 0', '[操作方法] その他メニューを開く') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'F6', '[操作方法] フォーカスを次の項目に移動') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + F6', '[操作方法] フォーカスを前の項目に移動') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Enter', '[操作方法] アクションの実行') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + +', '[操作方法] テキストサイズを大きくする') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + -', '[操作方法] テキストサイズを小さくする') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Page Up', '[操作方法] スクロールアップ') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Page Down', '[操作方法] スクロールダウン') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Page Up', '[操作方法] 前の日へスクロールする') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Page Down', '[操作方法] 次の日へスクロールする') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + .', '[操作方法] 右サイドバーを閉じる') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + I', '[操作方法] チャンネル情報') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + L', '[操作方法] チャンネル一覧') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Shift + Ctrl + E', '[操作方法] チームディレクトリ') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'F11', '[操作方法] フルスクリーン表示の切り替え') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + J', '[操作方法] 未読メッセージに移動する') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Enter', '[操作方法] 新しいウィンドウで会話を開く') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + W', '[操作方法] ウィンドウを閉じる') ON CONFLICT (application, keys) DO NOTHING;
INSERT INTO shortcuts (application, keys, description) VALUES ('slack', 'Ctrl + Shift + W', '[操作方法] 最後に閉じたウィンドウを開く') ON CONFLICT (application, keys) DO NOTHING;
