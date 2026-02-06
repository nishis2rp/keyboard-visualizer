-- Migration 036: Update shortcut difficulties
-- This migration updates the difficulty levels for various shortcuts based on user-provided list.

-- Update Chrome shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'Shift + Backspace' AND description = '次のページに進む';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'Escape' AND description = '読み込みを停止';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'Alt + D' AND description = 'アドレスバーにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'F3' AND description = 'ページ内検索を開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'Ctrl + G' AND description = '次を検索';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'Ctrl + U' AND description = 'ソースを表示';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'Ctrl + J' AND description = 'ダウンロードを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'Ctrl + D' AND description = 'ブックマークに追加';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'F12' AND description = 'デベロッパーツールを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chrome' AND keys = 'Ctrl + Shift + W' AND description = 'ウィンドウを閉じる';

-- Update Excel shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'F3' AND description = '[名前] 名前を数式に貼り付け';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'F5' AND description = '[その他] ジャンプダイアログ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'F7' AND description = '[その他] スペルチェック';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'F11' AND description = '[データ] グラフを作成（新しいシート）';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'Ctrl + R' AND description = '[編集] 右方向にコピー';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'Ctrl + G' AND description = '[その他] ジャンプダイアログ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'Ctrl + K' AND description = '[その他] ハイパーリンクを挿入';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'Ctrl + T' AND description = '[データ] テーブルを作成';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'Ctrl + L' AND description = '[テーブル] テーブルを作成';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'Ctrl + Q' AND description = '[分析] クイック分析';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'Ctrl + E' AND description = '[入力] フラッシュフィル';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'F11' AND description = '[グラフ] 新しいシートにグラフを作成';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'F8' AND description = '[選択] 拡張選択モードの切り替え';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'excel' AND keys = 'Ctrl + K' AND description = '[書式] リンクを挿入';

-- Update Gmail shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'd' AND description = '[作成] 下書きに保存';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'Ctrl + S' AND description = '[作成] 下書きを保存';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'm' AND description = '[操作] ミュート';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'b' AND description = '[操作] スヌーズ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '#' AND description = '削除';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '!' AND description = '迷惑メールとして報告';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'l' AND description = 'ラベルを付ける';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'v' AND description = 'フォルダに移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '+' AND description = '[重要] 重要マークを付ける';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '-' AND description = '[重要] 重要マークを外す';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '=' AND description = '[重要] 重要マークを付ける';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '_' AND description = '[重要] 重要マークを外す';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'j' AND description = '次のスレッドに移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'k' AND description = '前のスレッドに移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'n' AND description = '次のメッセージ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'p' AND description = '前のメッセージ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'o' AND description = 'スレッドを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'u' AND description = 'スレッドリストに戻る';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'Enter' AND description = 'スレッドを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = ']' AND description = 'アーカイブして次のスレッドへ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '[' AND description = 'アーカイブして前のスレッドへ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'z' AND description = '操作を元に戻す';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'x' AND description = 'スレッドを選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '/' AND description = '検索ボックスに移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'y' AND description = '[アクション] アーカイブして前/次へ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'w' AND description = '[アクション] タスクに追加';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'i' AND description = '[アクション] 既読としてマーク';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'q' AND description = '[アクション] チャット セクションに移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'Escape' AND description = '[システム] フォーカスを外す/検索をクリア';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '.' AND description = '[その他] その他の操作メニューを表示';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = ',' AND description = '[設定] 設定を開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '`' AND description = '[タブ] 次のセクション';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '~' AND description = '[タブ] 前のセクション';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'Tab then Enter' AND description = '[操作] 送信ボタンにフォーカスして送信';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = '{' AND description = 'アーカイブしてリストへ戻る';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'Esc' AND description = '入力フィールドから抜ける';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'gmail' AND keys = 'Ctrl + J' AND description = '[操作方法] 未読メッセージに移動する';

-- Update Terminal shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + H' AND description = '前の文字を削除';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + T' AND description = '文字を入れ替え';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + O' AND description = '次の行に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + P' AND description = '上の行に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + N' AND description = '下の行に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + F' AND description = '右の文字に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + B' AND description = '左の文字に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + A' AND description = '行頭に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + E' AND description = '行末に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + K' AND description = 'カーソルから行末まで削除';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + Y' AND description = '削除した文字列を貼り付け';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + U' AND description = 'カーソルから行頭まで削除 (Terminal)';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + W' AND description = '前の単語を削除 (Terminal)';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + L' AND description = '画面をクリア (Terminal)';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + R' AND description = 'コマンド履歴を検索 (Terminal)';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + C' AND description = 'プロセスを中断 (Terminal)';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'terminal' AND keys = 'Ctrl + Z' AND description = 'プロセスを一時停止 (Terminal)';

-- Update Xcode shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'xcode' AND keys = 'Ctrl + I' AND description = 'インデントを自動修正 (Xcode)';

-- Update Calendar shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'calendar' AND keys = 'Delete' AND description = 'イベントを削除 (Calendar)';

-- Update System/Presentation shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'system' AND keys = 'Fn Fn (2回)' AND description = '音声入力を開始';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'presentation' AND keys = 'B' AND description = '黒い画面にする/解除';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'presentation' AND keys = 'W' AND description = '白い画面にする/解除';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'presentation' AND keys = 'S' AND description = 'スライドショーを一時停止/再開';

-- Update Drawing/Annotation shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'drawing' AND keys = 'Ctrl + E' AND description = '消しゴムツールを使用';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'drawing' AND keys = 'E' AND description = 'すべてのインクマークを消去';

-- Update Word Processor shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'word_processor' AND keys = 'Ctrl + J' AND description = '両端揃え';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'word_processor' AND keys = 'Ctrl + G' AND description = 'オブジェクトをグループ化';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'word_processor' AND keys = 'Ctrl + K' AND description = 'ハイパーリンクを挿入';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'word_processor' AND keys = 'Ctrl + T' AND description = 'フォントダイアログを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'word_processor' AND keys = 'Ctrl + Y' AND description = '行を削除';

-- Update IDE shortcuts (assuming VS Code or similar)
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + /' AND description = '行コメントの切り替え';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + P' AND description = 'ファイルを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + B' AND description = 'サイドバーの表示/非表示';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + D' AND description = '次の一致を選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + G' AND description = '行に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + T' AND description = 'ワークスペースのシンボルを表示';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + \\' AND description = 'エディターを分割';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + 1' AND description = '最初のエディターグループにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + 2' AND description = '2番目のエディターグループにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + 3' AND description = '3番目のエディターグループにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + ]' AND description = 'インデントを増やす';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + [' AND description = 'インデントを減らす';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'ide' AND keys = 'Ctrl + U' AND description = '最後のカーソル操作を元に戻す';

-- Update macOS browser shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'macos' AND keys = 'Cmd + Shift + [' AND description = '前のタブ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'macos' AND keys = 'Cmd + Shift + ]' AND description = '次のタブ';

-- Update General Browser/System shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'F7' AND description = 'カーソルブラウジングの切り替え';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'F6' AND description = '次のペインにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Alt + ↑' AND description = '親フォルダーに移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + ←' AND description = '前の単語の先頭に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + →' AND description = '次の単語の先頭に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + ↑' AND description = '前の段落の先頭に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + ↓' AND description = '次の段落の先頭に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Shift + ←' AND description = '1文字左を選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Shift + →' AND description = '1文字右を選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Shift + ↑' AND description = '1行上を選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Shift + ↓' AND description = '1行下を選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Shift + Home' AND description = '行の先頭まで選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Shift + End' AND description = '行の末尾まで選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Right Shift (8秒間長押し)' AND description = 'フィルターキーのオン/オフ';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'F7' AND description = 'スペルチェック（一部アプリ）';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'F10' AND description = 'メニューバーをアクティブにする';

-- Update Windows shortcuts
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + A' AND description = 'クイック設定を開く';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + G' AND description = 'Xbox Game Barを開く';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + H' AND description = '音声入力を開始';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + M' AND description = 'すべてのウィンドウを最小化';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + N' AND description = '通知センターを開く';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + P' AND description = 'プレゼンテーション表示モード';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + R' AND description = 'ファイル名を指定して実行';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + S' AND description = '検索を開く';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + W' AND description = 'ウィジェットを開く';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + X' AND description = 'クイックリンクメニュー';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + Z' AND description = 'スナップレイアウト';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 1' AND description = 'タスクバーの1番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 2' AND description = 'タスクバーの2番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 3' AND description = 'タスクバーの3番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 4' AND description = 'タスクバーの4番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 5' AND description = 'タスクバーの5番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 6' AND description = 'タスクバーの6番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 7' AND description = 'タスクバーの7番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 8' AND description = 'タスクバーの8番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 9' AND description = 'タスクバーの9番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + 0' AND description = 'タスクバーの10番目のアプリを起動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + ↑' AND description = 'ウィンドウを最大化';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + ↓' AND description = 'ウィンドウを最小化/元に戻す';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + ←' AND description = 'ウィンドウを画面左半分にスナップ';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + →' AND description = 'ウィンドウを画面右半分にスナップ';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + Tab' AND description = 'タスクビュー';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + Ctrl + D' AND description = '新しい仮想デスクトップを追加';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + Ctrl + ←' AND description = '左の仮想デスクトップに切り替え';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + Ctrl + →' AND description = '右の仮想デスクトップに切り替え';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + Shift + S' AND description = 'スクリーンショット（Snipping Tool）';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Alt + F4' AND description = 'アプリを閉じる';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Alt + ←' AND description = '前に戻る';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Alt + →' AND description = '次に進む';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Ctrl + Shift + Escape' AND description = 'タスクマネージャーを開く';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Ctrl + Shift + N' AND description = '新しいフォルダーを作成';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Alt + P' AND description = 'プレビューウィンドウを表示';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + B' AND description = '通知領域の最初のアイコンにフォーカス';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + Shift + ←' AND description = 'ウィンドウを左のモニターに移動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'windows11' AND keys = 'Win + Shift + →' AND description = 'ウィンドウを右のモニターに移動';

-- Update other browser navigation shortcuts to 'basic' as requested
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'browser' AND keys = 'Ctrl + Shift + T' AND description = '閉じたタブを再度開く';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'browser' AND keys = 'Ctrl + Tab' AND description = '次のタブに切り替え';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'browser' AND keys = 'Ctrl + Shift + Tab' AND description = '前のタブに切り替え';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'browser' AND keys = 'Ctrl + Shift + V' AND description = 'クリップボード履歴から貼り付け';

-- Update other specific shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Shift + Backspace' AND description = '次のページに進む';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Escape' AND description = '読み込みを停止';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Alt + D' AND description = 'アドレスバーにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'F7' AND description = 'カーソルブラウジングの切り替え';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'F3' AND description = 'ページ内検索を開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + J' AND description = 'ダウンロードを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + D' AND description = 'ブックマークに追加';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'F12' AND description = 'デベロッパーツールを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'F6' AND description = '次のペインにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + Shift + W' AND description = 'ウィンドウを閉じる';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + Tab' AND description = '次のタブに切り替え';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'browser' AND keys = 'Ctrl + Shift + Tab' AND description = '前のタブに切り替え';

-- Update VS Code shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + /' AND description = '行コメントの切り替え';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + P' AND description = 'ファイルを開く';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + B' AND description = 'サイドバーの表示/非表示';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + D' AND description = '次の一致を選択';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + G' AND description = '行に移動';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + T' AND description = 'ワークスペースのシンボルを表示';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + \\' AND description = 'エディターを分割';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + 1' AND description = '最初のエディターグループにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + 2' AND description = '2番目のエディターグループにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + 3' AND description = '3番目のエディターグループにフォーカス';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + ]' AND description = 'インデントを増やす';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + [' AND description = 'インデントを減らす';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'vscode' AND keys = 'Ctrl + U' AND description = '最後のカーソル操作を元に戻す';

-- Update other miscellaneous shortcuts
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'general' AND keys = 'T' AND description = '[基本] 次に移動...';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chat' AND keys = '↑' AND description = '[基本] 直近のメッセージを編集する';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'chat' AND keys = 'Ctrl + Z' AND description = '[基本] 直近のメッセージの送信を取り消す';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'calendar' AND keys = 'Shift + PageUp' AND description = '[操作方法] 前の日へスクロールする';
UPDATE shortcuts SET difficulty = 'standard' WHERE application = 'calendar' AND keys = 'Shift + PageDown' AND description = '[操作方法] 次の日へスクロールする';

-- Ensure Chrome's Ctrl + 1 to Ctrl + 8 remain basic as per previous instruction
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'chrome' AND keys IN ('Ctrl + 1', 'Ctrl + 2', 'Ctrl + 3', 'Ctrl + 4', 'Ctrl + 5', 'Ctrl + 6', 'Ctrl + 7', 'Ctrl + 8') AND description LIKE '%番目のタブに移動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'chrome' AND keys = 'Ctrl + PageUp' AND description = '前のタブへ移動';
UPDATE shortcuts SET difficulty = 'basic' WHERE application = 'chrome' AND keys = 'Ctrl + PageDown' AND description = '次のタブへ移動';

-- Update specific shortcuts to madmax
UPDATE shortcuts SET difficulty = 'madmax' WHERE application = 'chrome' AND keys = 'Alt + Shift + I' AND description = 'フィードバックを送信';
UPDATE shortcuts SET difficulty = 'madmax' WHERE application = 'excel' AND keys = 'Ctrl + Shift + F2' AND description = '[コメント] コメントをすべて表示/非表示';
UPDATE shortcuts SET difficulty = 'madmax' WHERE application = 'excel' AND keys = 'Ctrl + Shift + F3' AND description = '[名前] 選択範囲から名前を作成';
UPDATE shortcuts SET difficulty = 'madmax' WHERE application = 'excel' AND keys = 'Ctrl + Shift + F6' AND description = '[その他] 前のブックウィンドウに切り替え';
UPDATE shortcuts SET difficulty = 'madmax' WHERE application = 'excel' AND keys = 'Ctrl + Shift + "' AND description = '[コピー] 上のセルの値をコピー';
