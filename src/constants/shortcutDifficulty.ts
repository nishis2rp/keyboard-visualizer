/**
 * よく使われる基本的なショートカット（正規化形式）
 * これらは初心者にも覚えやすく、頻繁に使用されるショートカット
 */
export const BASIC_SHORTCUTS = new Set([
  // 基本操作（最もよく使われるもの）
  'Ctrl+C',          // コピー
  'Ctrl+V',          // 貼り付け
  'Ctrl+X',          // 切り取り
  'Ctrl+Z',          // 元に戻す
  'Ctrl+Y',          // やり直し
  'Ctrl+A',          // すべて選択
  'Ctrl+S',          // 上書き保存
  'Ctrl+F',          // 検索
  'Ctrl+P',          // 印刷
  'Ctrl+N',          // 新規作成
  'Ctrl+O',          // 開く
  'Ctrl+W',          // タブ/ウィンドウを閉じる

  // 基本キー
  'Enter',           // 確定・実行
  'Tab',             // 次のフィールド
  'Escape',          // キャンセル
  'Delete',          // 削除
  'Backspace',       // 後退削除
  'F2',              // 名前の変更・編集
  'F3',              // 次を検索

  // ナビゲーション基本
  'Home',            // 行の先頭に移動
  'End',             // 行の末尾に移動
  'PageUp',          // 1画面上にスクロール
  'PageDown',        // 1画面下にスクロール

  // ウィンドウ・タブ操作（よく使うもの）
  'Alt+Tab',         // アプリケーション切り替え
  'Alt+F4',          // ウィンドウを閉じる
  'Ctrl+T',          // 新しいタブ
  'Ctrl+Tab',        // タブ切り替え（次）
  'F11',             // 全画面

  // ブラウザ基本
  'Ctrl+R',          // ページ更新
  'F5',              // ページ更新
  'Ctrl+L',          // アドレスバーにフォーカス
  'Ctrl+D',          // ブックマーク
  'Ctrl+J',          // ダウンロードを開く

  // Windows基本
  'Win+D',           // デスクトップの表示
  'Win+E',           // エクスプローラーを開く
  'Win',             // スタートメニューを開く
  'Win+I',           // 設定を開く
  'Win+A',           // クイック設定を開く
  'Win+S',           // 検索を開く
  'Win+Q',           // 検索を開く
  'Win+X',           // クイックリンクメニュー
  'Win+K',           // キャスト（ワイヤレスディスプレイ）
  'Win+P',           // プレゼンテーション表示モード
  'Win+R',           // ファイル名を指定して実行
  'Win+M',           // すべてのウィンドウを最小化
  'Win+↑',           // ウィンドウを最大化
  'Win+↓',           // ウィンドウを最小化/元に戻す
  'Win+←',           // ウィンドウを画面左半分にスナップ
  'Win+→',           // ウィンドウを画面右半分にスナップ
  'Win+1',           // タスクバーの1番目のアプリを起動
  'Win+2',           // タスクバーの2番目のアプリを起動
  'Win+3',           // タスクバーの3番目のアプリを起動
  'Win+4',           // タスクバーの4番目のアプリを起動
  'Win+5',           // タスクバーの5番目のアプリを起動
  'Win+6',           // タスクバーの6番目のアプリを起動
  'Win+7',           // タスクバーの7番目のアプリを起動
  'Win+8',           // タスクバーの8番目のアプリを起動
  'Win+9',           // タスクバーの9番目のアプリを起動
  'Win+0',           // タスクバーの10番目のアプリを起動

  // 書式設定基本
  'Ctrl+B',          // 太字
  'Ctrl+I',          // 斜体
  'Ctrl+U',          // 下線

  // macOS基本（Windowsと同等のもの）
  'Meta+A',          // すべて選択（Mac）
  'Meta+C',          // コピー（Mac）
  'Meta+V',          // 貼り付け（Mac）
  'Meta+X',          // 切り取り（Mac）
  'Meta+Z',          // 元に戻す（Mac）
  'Meta+S',          // 保存 (Mac)
  'Meta+F',          // 検索 (Mac)
  'Meta+P',          // 印刷 (Mac)
  'Meta+N',          // 新規ウィンドウ (Mac)
  'Meta+O',          // 開く (Mac)
  'Meta+W',          // ウィンドウを閉じる (Mac)
  'Meta+Q',          // アプリを終了 (Mac)
  'Meta+T',          // 新規タブ (Mac)
  'Meta+Space',      // Spotlight検索
  'Meta+R',          // ブラウザ更新（Mac）
  'Meta+L',          // アドレスバー（Mac）
  'Meta+D',          // ブックマーク（Mac）
  'Meta+B',          // 太字（Mac）
  'Meta+I',          // 斜体（Mac）
  'Meta+U',          // 下線（Mac）

  // よく使う選択
  'Shift+↑',         // 1行上を選択
  'Shift+↓',         // 1行下を選択
  'Shift+←',         // 1文字左を選択
  'Shift+→',         // 1文字右を選択

  // よく使うブラウザ操作
  'Alt+←',           // 前に戻る
  'Alt+→',           // 次に進む

  // Slack
  'Shift+Enter',     // 改行する
]);

/**
 * 標準ショートカット（正規化形式）
 * 基本を超えた中級者向けのショートカット
 * BASICほど頻繁には使わないが、知っていると便利なもの
 */
export const STANDARD_SHORTCUTS = new Set([
  // BASIC から移動（複数修飾キー）
  'Meta+Shift+Z',    // やり直し（Mac）
  'Ctrl+Shift+N',    // 新しいフォルダーを作成
  'Shift+Home',      // 行の先頭まで選択
  'Shift+End',       // 行の末尾まで選択
  'Meta+G',          // 次を検索（Mac）
  'Meta+Tab',        // アプリケーション切り替え（Mac）

  // Gmail基本（よく使うもののみ）
  'c',               // 作成
  'r',               // 返信
  '/',               // 検索
  'k',               // 次のメール
  'j',               // 前のメール

  'Ctrl+Shift+Tab',  // タブ切り替え（前）
  'Ctrl+Shift+T',    // 閉じたタブを再度開く
  'Ctrl+H',          // 履歴
  'Ctrl++',          // ズームイン
  'Ctrl+-',          // ズームアウト
  'Ctrl+0',          // ズームリセット
  'Win+Tab',         // タスクビュー
  'Shift+Delete',    // 完全に削除
  'Ctrl+Shift+V',    // 書式なしで貼り付け (Windows/汎用)
  'Meta+Shift+V',    // 書式なしで貼り付け (Mac/汎用)
  'Meta+H',          // アプリケーションを隠す (Mac)
  'Meta+,',          // 環境設定 (Mac)

  // Chrome中級
  'Ctrl+G',          // 次を検索
  'Shift+F3',        // 前の検索結果に移動
  'Ctrl+Shift+G',    // 前を検索

  'Win+L',           // PCをロックする
  'PrtSc',           // スクリーンショット

  'Meta+Delete',     // ゴミ箱に移動
  'Meta+Shift+3',    // スクリーン全体をキャプチャ
  'Meta+Shift+4',    // 選択範囲をキャプチャ

  // Excel中級（シート移動のみ）
  'Ctrl+PageDown',   // 次のシート
  'Ctrl+PageUp',     // 前のシート

  // Gmail中級（特殊な単独キー）
  'a',               // 全員に返信
  'f',               // 転送
  'e',               // アーカイブ
  'u',               // スレッドリストに戻る
  's',               // スターを付ける
  'x',               // メールを選択
  'o',               // メールを開く
  'n',               // 次のメッセージ（会話内）
  'p',               // 前のメッセージ（会話内）
  'z',               // 元に戻す

  // Slack中級
  'Ctrl+K',          // 検索/移動
  'Ctrl+N',          // 新規メッセージ
  'Shift+Enter',     // 改行する

  // テキスト編集 - ドキュメント移動（BASICと重複しないもの）
  'Ctrl+Shift+Home', // ドキュメントの先頭まで選択
  'Ctrl+Shift+End',  // ドキュメントの末尾まで選択
  'Ctrl+Shift+Home', // ドキュメントの先頭まで選択
  'Ctrl+Shift+End',  // ドキュメントの末尾まで選択
  'Shift+↑',         // 1行上を選択
  'Shift+↓',         // 1行下を選択
  'Shift+←',         // 1文字左を選択
  'Shift+→',         // 1文字右を選択
  'Ctrl+↑',          // 前の段落の先頭に移動
  'Ctrl+↓',          // 次の段落の先頭に移動
  'Ctrl+Shift+←',    // 前の単語の先頭まで選択
  'Ctrl+Shift+→',    // 次の単語の先頭まで選択
  'Shift+Home',      // 行の先頭まで選択
  'Shift+End',       // 行の末尾まで選択
  'Shift+PageUp',    // 1画面分上まで選択
  'Shift+PageDown',  // 1画面分下まで選択


  'Win+Z',           // スナップレイアウト
  'Win+N',           // 通知センターを開く
  'Win+W',           // ウィジェットを開く
  'Win+,',           // デスクトップを一時的にプレビュー
  'Win+Space',       // 入力言語とキーボードレイアウトの切り替え
  'Win+;',           // 絵文字パネルを開く
  'F3',              // 検索
  'F4',              // アドレスバーのリストを表示
  'F6',              // 画面要素間を移動
  'Shift+F10',       // 右クリックメニューを表示
  'Insert',          // 挿入モード/上書きモードの切り替え

  // ブラウザ操作（BASICと重複しないもの）
  'Ctrl+9',          // 最後のタブ
  'Ctrl+2',          // 2番目のタブ
  'Ctrl+3',          // 3番目のタブ
  'Ctrl+4',          // 4番目のタブ
  'Ctrl+5',          // 5番目のタブ
  'Ctrl+6',          // 6番目のタブ
  'Ctrl+7',          // 7番目のタブ
  'Ctrl+8',          // 8番目のタブ
  'Alt+←',           // 前に戻る
  'Alt+→',           // 次に進む
  'Alt+Space',       // ウィンドウメニューを開く
  'F1',              // ヘルプを表示
  'F7',              // スペルチェック（一部アプリ）
  'F10',             // メニューバーをアクティブにする

  // エクスプローラー操作
  'Ctrl+E',          // エクスプローラーで検索ボックスを選択
  'Ctrl+Shift+N',    // 新しいフォルダーを作成
  'Ctrl+Shift+E',    // フォルダー内のすべてのフォルダーを展開
  'Alt+D',           // アドレスバーを選択
  'Alt+P',           // プレビューウィンドウを表示
  'Alt+Enter',       // 選択した項目のプロパティ
  'Backspace',       // 親フォルダーに移動
  'Alt+↑',           // 親フォルダーに移動
  'Ctrl+L',          // アドレスバーにフォーカス

  // macOS標準
  'Meta+Home',       // ドキュメントの先頭 (Mac)
  'Meta+End',        // ドキュメントの末尾 (Mac)
  'Meta+M',          // ウィンドウを最小化 (Mac)
  'Meta+Delete',     // ゴミ箱に移動
  'Meta+E',          // ディスクを取り出す
  'Meta+I',          // 情報を見る
  'Meta+Shift+N',    // 新規フォルダ
  'Meta+Option+V',   // 移動（カット&ペースト）
  'Meta+[',          // 戻る
  'Meta+]',          // 進む
  'Meta+↑',          // 親フォルダを開く
  'Meta+↓',          // 選択項目を開く
  'Meta+Shift+G',    // フォルダへ移動
  'Meta+Shift+.',    // 隠しファイル表示切り替え
  'Meta+Shift+3',    // スクリーン全体をキャプチャ
  'Meta+Shift+4',    // 選択範囲をキャプチャ
  'Ctrl+←',          // Mission Control左へ
  'Ctrl+→',          // Mission Control右へ
  'Ctrl+↑',          // Mission Controlを表示
  'Ctrl+↓',          // アプリケーションWindowsを表示
  'F3',              // Mission Control
  'F4',              // Launchpadを表示
  'Meta+Option+M',   // すべてのウィンドウを最小化
  'Meta+Option+W',   // すべてのウィンドウを閉じる
  'Meta+Shift+W',    // タブを閉じる
  'F11',             // デスクトップを表示
  'Option+→',        // 次の単語へ
  'Option+←',        // 前の単語へ
  'Option+Delete',   // 前の単語を削除
  'Fn+Delete',       // 後ろの文字を削除
  'Meta+Shift+[',    // 前のタブ
  'Meta+Shift+]',    // 次のタブ
  'Meta+Shift+T',    // 閉じたタブを開く
  'Meta+1',          // 1番目のタブ
  'Meta+2',          // 2番目のタブ
  'Meta+9',          // 最後のタブ
  'Meta+Ctrl+Space', // 絵文字と記号
  'Meta+Option+D',   // Dockの表示/非表示

  // Excel標準
  'F1',              // ヘルプ
  'F3',              // 名前を数式に貼り付け
  'F4',              // 数式内の参照を切り替え
  'F5',              // ジャンプダイアログ
  'F7',              // スペルチェック
  'F9',              // すべてのワークシートを再計算
  'F11',             // グラフを作成（新しいシート）
  'F12',             // 名前を付けて保存
  'Shift+Tab',       // 入力を確定して左に移動
  'Shift+F2',        // コメントを挿入/編集
  'Shift+F4',        // 次を検索
  'Shift+F9',        // アクティブシートを再計算
  'Shift+F10',       // コンテキストメニューを表示
  'Shift+F11',       // 新しいワークシートを挿入
  'Ctrl+D',          // 下方向にコピー
  'Ctrl+R',          // 右方向にコピー
  'Ctrl+-',          // セル/行/列を削除
  'Ctrl+H',          // 置換
  'Ctrl+G',          // ジャンプダイアログ
  'Ctrl+K',          // ハイパーリンクを挿入
  'Ctrl+T',          // テーブルを作成
  'Ctrl+L',          // テーブルを作成
  'Ctrl+Q',          // クイック分析
  'Ctrl+E',          // フラッシュフィル
  'Ctrl+F1',         // リボンの表示/非表示
  'Ctrl+F2',         // 印刷プレビュー
  'Ctrl+F3',         // 名前の管理
  'Ctrl+;',          // 現在の日付を入力
  'Ctrl+:',          // 現在の時刻を入力
  'Ctrl+`',          // 数式の表示/非表示を切り替え
  'Alt+Enter',       // セル内で改行
  'Alt+=',           // オートSUMを挿入
  'Alt+↓',           // オートフィルターのドロップダウンを開く
  'Alt+Page Up',     // 1画面左にスクロール
  'Alt+Page Down',   // 1画面右にスクロール
  'Alt+F1',          // グラフを作成（埋め込み）
  'Alt+F4',          // Excelを終了
  'Home',            // 行の先頭に移動
  'Page Up',         // 1画面上にスクロール
  'Page Down',       // 1画面下にスクロール
  'Ctrl+Shift+↑',    // 上方向にセルを選択
  'Ctrl+Shift+↓',    // 下方向にセルを選択
  'Ctrl+Shift+←',    // 左方向にセルを選択
  'Ctrl+Shift+→',    // 右方向にセルを選択
  'Ctrl+Shift+Home', // 先頭セルまで選択
  'Ctrl+Shift+End',  // 最終セルまで選択


  '#',               // オートコンプリートチャンネル
  ':',               // オートコンプリート絵文字
  '@',               // オートコンプリート@ユーザー名
  'Ctrl+Tab',        // 次のワークスペース
  'Ctrl+Shift+Tab',  // 前のワークスペース
  'Ctrl+1',          // ホーム
  'Ctrl+2',          // DM
  'Ctrl+3',          // アクティビティ
  'Ctrl+4',          // 後で
  'Ctrl+5',          // その他
  'Ctrl+G',          // 検索
  'Ctrl+↑',          // 直近のメッセージを編集
  'Ctrl+W',          // ウィンドウを閉じる
  'Ctrl+,',          // 環境設定を開く
  'Ctrl+J',          // 未読メッセージに移動
  'Page Up',         // 前のメッセージを表示
  'Page Down',       // 次のメッセージを表示
  'Home',            // 最初のメッセージにジャンプ
  'End',             // 最新のメッセージにジャンプ
  'E',               // リアクションを追加
  'R',               // スレッドで返信
  'T',               // スレッドを開く
  'A',               // すべてのDMを表示
  'P',               // ピン留めされたアイテムを表示
  '/',               // スラッシュコマンドを入力
  'Ctrl+/',          // ショートカット一覧を表示

  // Windows標準 (moved from hard)
  'Win+Shift+S',     // スクリーンショット（Snipping Tool）
  'Win+Home',        // アクティブウィンドウ以外を最小化/復元
  'Win+Shift+N',     // 通知センターとカレンダーを開く
  'Win+B',           // 通知領域の最初のアイコンにフォーカス
  'Win+T',           // タスクバーのアプリを順番に選択
  'Win+C',           // Microsoft Teams チャットを開く
  'Win+F',           // フィードバックHubを開く
  'Win+G',           // Xbox Game Barを開く
  'Win+H',           // 音声入力を開始
  'Win+O',           // デバイスの向きをロック
  'Win+U',           // 簡単操作センター
  'Win+Y',           // Windows Mixed Reality
  'Win+Pause',       // システムのプロパティを表示
  'Win+/',           // IME再変換
  'Win+Enter',       // ナレーターを開く
  'Win++',           // 拡大鏡で拡大
  'Win+-',           // 拡大鏡で縮小
  'Win+Escape',      // 拡大鏡を終了
]);

/**
 * 高度なショートカット（正規化形式）
 * 知っていると便利な、中級者向けのショートカット
 */
export const HARD_SHORTCUTS = new Set([
  // Gmail標準
  'g+i',             // 受信トレイに移動
  'g+s',             // スター付きに移動
  'g+t',             // 送信済みに移動
  'g+d',             // 下書きに移動
  'g+a',             // すべてのメールに移動
  'g+k',             // タスクに移動
  'g+b',             // スヌーズ中に移動
  'g+l',             // ラベルに移動
  '*+a',             // すべて選択
  '*+n',             // すべて選択解除
  '*+r',             // 既読メールを選択
  '*+u',             // 未読メールを選択
  '*+s',             // スター付きを選択
  '*+t',             // スターなしを選択

  // Slack標準
  'Alt+↑',           // 前のチャンネルまたはDM
  'Alt+↓',           // 次のチャンネルまたはDM
  'Shift+Alt+↑',     // 前の未読チャンネルまたはDM
  'Shift+Alt+↓',     // 次の未読チャンネルまたはDM

  // 代替キー
  'Ctrl+Insert',     // コピー（代替）
  'Shift+Insert',    // 貼り付け（代替）
  'Alt+Backspace',   // 元に戻す（代替）
  'Ctrl+Backspace',  // 前の単語を削除
  'Ctrl+Delete',     // 次の単語を削除

  // ブラウザ上級 (Chrome)
  'Ctrl+Shift+R',    // 強制更新
  'Ctrl+F5',         // 強制更新（代替）
  'Ctrl+=',          // ズームイン（代替）
  'Ctrl+Shift+M',    // デバイスツールバーの切り替え
  'Ctrl+Shift+V',    // クリップボード履歴から貼り付け

  // Excel上級（移動系 - STANDARDから移動）
  'Ctrl+Home',       // A1セルに移動
  'Ctrl+End',        // 使用範囲の最後のセルに移動
  'Ctrl+↑',          // 上方向の端に移動
  'Ctrl+↓',          // 下方向の端に移動
  'Ctrl+←',          // 左方向の端に移動
  'Ctrl+→',          // 右方向の端に移動
  'Shift+F3',        // 関数を挿入

  // Excel上級
  'Ctrl+1',          // セルの書式設定
  'Ctrl+2',          // 太字（代替）
  'Ctrl+3',          // 斜体（代替）
  'Ctrl+4',          // 下線（代替）
  'Ctrl+5',          // 取り消し線
  'Ctrl+8',          // アウトライン記号の表示/非表示
  'Ctrl+9',          // 行を非表示
  'Ctrl+0',          // 列を非表示
  'Ctrl+Shift+S',    // 名前を付けて保存（代替）
  'Shift+Space',     // 行全体を選択
  'Ctrl+Space',      // 列全体を選択
  'Ctrl+Shift+A',    // 関数の引数を挿入
  'Ctrl+Enter',      // 選択範囲に同じ値を入力
  'Ctrl+\'',         // 上のセルをコピー
  'Ctrl+Shift+~',    // 標準表示形式
  'Ctrl+Shift+!',    // 桁区切り表示形式
  'Ctrl+Shift+@',    // 時刻表示形式
  'Ctrl+Shift+#',    // 日付表示形式
  'Ctrl+Shift+$',    // 通貨表示形式
  'Ctrl+Shift+%',    // パーセント表示形式
  'Ctrl+Shift+^',    // 指数表示形式
  'Ctrl+Shift+&',    // 罫線を引く
  'Ctrl+Shift+_',    // 罫線を削除
  'Ctrl+Shift+1',    // 数値形式（桁区切り、小数点2桁）
  'Ctrl+Shift+2',    // 時刻形式（時:分 AM/PM）
  'Ctrl+Shift+3',    // 日付形式（年/月/日）
  'Ctrl+Shift+4',    // 通貨形式
  'Ctrl+Shift+5',    // パーセント形式
  'Ctrl+Shift+6',    // 指数形式
  'Ctrl+Shift+9',    // 行の再表示
  'Ctrl+Shift+0',    // 列の再表示
  'Ctrl+Shift+U',    // 数式バーを展開/折りたたみ
  'Ctrl+Shift+L',    // フィルターの切り替え
  'Ctrl+Shift+F',    // セルの書式を検索
  'Ctrl+Shift+F2',   // コメントをすべて表示/非表示
  'Ctrl+Shift+F3',   // 選択範囲から名前を作成
  'Ctrl+Shift+F6',   // 前のブックウィンドウに切り替え
  'Ctrl+Shift+"',    // 上のセルの値をコピー
  'Ctrl+Shift+=',    // セル/行/列を挿入（別バージョン）
  'Ctrl+Shift+T',    // テーブルの合計行を切り替え
  'Ctrl+Alt+V',      // 形式を選択して貼り付け
  'Ctrl+Alt+F9',     // すべてのブックを再計算
  'Ctrl+Backspace',  // アクティブセルまでスクロール
  'Ctrl+Insert',     // コピー（代替）
  'Ctrl+F4',         // アクティブなブックを閉じる
  'Ctrl+F6',         // 次のブックウィンドウに切り替え
  'Ctrl+F9',         // ブックウィンドウを最小化
  'Ctrl+F10',        // ブックウィンドウを最大化/復元
  'Ctrl+[',          // 参照元セルに移動
  'Ctrl+]',          // 参照先セルに移動
  'Insert',          // セルを挿入
  'Shift+Insert',    // 貼り付け
  'Shift+Backspace', // 選択範囲をアクティブセルのみに変更
  'Alt+F8',          // マクロダイアログを開く
  'Alt+F11',         // VBエディタを開く
  'Alt+Shift+→',     // グループ化
  'Alt+Shift+←',     // グループ解除
  'F8',              // 拡張選択モードの切り替え
  'Alt+;',           // 可視セルのみを選択
  'Ctrl+/',          // アクティブ配列を選択
  'Ctrl+\\',         // 行の違いを選択
  'Ctrl+Shift+|',    // 列の違いを選択
  'Ctrl+Shift+O',    // コメントがあるセルを選択
  'Ctrl+Shift+F9',   // 選択した数式を値に変換
  '=',               // 数式を開始

  // Windows特殊
  'Ctrl+F4',         // タブを閉じる（代替）
  'Win+Shift+↑',     // ウィンドウを垂直方向に最大化
  'Win+Shift+↓',     // 垂直方向のサイズを元に戻す
  'Win+Shift+←',     // ウィンドウを左のモニターに移動
  'Win+Shift+→',     // ウィンドウを右のモニターに移動
  'Win+Shift+M',     // 最小化したウィンドウを復元
  'Alt+Escape',      // ウィンドウを開いた順番で切り替え
  'Ctrl+Escape',     // スタートメニューを開く
  'Delete',          // 削除

  // macOS上級
  'Meta+Y',          // やり直し（Mac代替）
  'Meta+Ctrl+F',     // 全画面（Mac）
  'Meta+Shift+R',    // ブラウザ強制更新（Mac）
  'Meta+=',          // ズームイン（Mac代替）
  'Meta+-',          // ズームアウト（Mac）
  'Meta+0',          // ズームをリセット（Mac）
  'Meta+Shift+5',    // スクリーンショットオプション
  'Meta+Shift+6',    // Touch Barをキャプチャ
  'Meta+Shift+V',    // 書式なしで貼り付け (Mac)
  'Meta+`',          // 同じアプリのウィンドウ切り替え (Mac)
  'Meta+Option+H',   // 他のウィンドウを隠す
  'Meta+Shift+A',    // アプリケーションフォルダを開く
  'Meta+Shift+U',    // ユーティリティフォルダを開く
  'Meta+Shift+I',    // iCloudドライブを開く
  'Meta+Shift+O',    // 書類フォルダを開く
  'Meta+Shift+D',    // デスクトップフォルダを開く
  'Meta+Shift+H',    // ホームフォルダを開く
  'Meta+Shift+K',    // ネットワークを開く
  'Meta+Shift+R',    // AirDropウィンドウを開く
  'Meta+Shift+C',    // コンピュータを表示
  'Meta+Option+L',   // ダウンロードフォルダを開く
  'Meta+J',          // 表示オプション
  'Meta+Shift+~',    // 前のウィンドウに切り替え
  'Ctrl+F3',         // すべてのウィンドウを表示
  'Meta+→',          // 行末へ移動（テキスト）
  'Meta+←',          // 行頭へ移動（テキスト）
  'Meta+Shift+→',    // 行末まで選択
  'Meta+Shift+←',    // 行頭まで選択
  'Meta+Shift+↑',    // 文書の先頭まで選択
  'Meta+Shift+↓',    // 文書の末尾まで選択
  'Option+Shift+→',  // 次の単語まで選択
  'Option+Shift+←',  // 前の単語まで選択
  'Ctrl+H',          // 前の文字を削除
  'Ctrl+D',          // 後ろの文字を削除
  'Ctrl+T',          // 文字を入れ替え
  'Ctrl+O',          // 次の行に移動
  'Ctrl+P',          // 上の行に移動
  'Ctrl+N',          // 下の行に移動
  'Ctrl+F',          // 右の文字に移動
  'Ctrl+B',          // 左の文字に移動
  'Ctrl+A',          // 行頭に移動
  'Ctrl+E',          // 行末に移動
  'Ctrl+K',          // カーソルから行末まで削除
  'Ctrl+Y',          // 削除した文字列を貼り付け
  'Meta+Shift+\\',   // すべてのタブを表示
  'Meta+Option+B',   // すべてのブックマークを編集
  'Meta+Option+R',   // リーダー表示
  'Meta+.',          // 読み込みを停止
  'Meta+D',          // ブックマークに追加
  'Meta+Option+I',   // Webインスペクタ
  'Meta+Option+C',   // JavaScriptコンソール
  'Meta+Option+A',   // アクティビティ
  'Meta+Shift+L',    // サイドバーを表示/非表示
  'Meta+Shift+B',    // お気に入りバーを表示/非表示
  'Ctrl+F2',         // メニューバーにフォーカス
  'Meta+Shift+/',    // ヘルプメニューを検索
  'Meta+K',          // ターミナルの画面をクリア
  'Ctrl+U',          // カーソルから行頭まで削除（Terminal）
  'Ctrl+W',          // 前の単語を削除（Terminal）
  'Ctrl+L',          // 画面をクリア（Terminal）
  'Ctrl+R',          // コマンド履歴を検索（Terminal）
  'Ctrl+C',          // プロセスを中断（Terminal）
  'Ctrl+Z',          // プロセスを一時停止（Terminal）
  'Meta+/',          // コメントアウト
  'Fn+←',            // Home
  'Fn+→',            // End
  'Fn+↑',            // Page Up
  'Fn+↓',            // Page Down
  'Fn+F4',           // Launchpad
  'Meta+Ctrl+D',     // 辞書で調べる

  // Gmail上級
  'Shift+I',         // 既読にする (Gmail)
  '#',               // 削除 (Gmail)
  'Shift+3',         // 削除
  '!',               // スパムとして報告
  'Shift+1',         // スパムとして報告
  'Shift+N',         // すべて未読にする
  'Shift+T',         // 新しいタブで開く
  'Shift+D',         // 下書きとして保存
  'Shift+Z',         // やり直し
  'Ctrl+Shift+7',    // 番号付きリスト
  'Ctrl+Shift+8',    // 箇条書きリスト
  'Ctrl+Shift+9',    // 引用
  'Ctrl+K',          // リンクを挿入
  'Ctrl+\\',         // 書式をクリア
  'Ctrl+F',          // メール内を検索
  'Ctrl+Shift+F',    // メッセージを検索フィルタで検索
  ',',               // 設定を開く
  '`',               // 次のセクション
  '~',               // 前のセクション
  'g+c',             // 連絡先に移動
  'Tab then Enter',  // 送信ボタンにフォーカスして送信
  'q',               // チャット セクションに移動

  // Slack上級
  'Ctrl+Shift+A',    // 全未読 (Slack)
  'Ctrl+Shift+H',    // ハドルミーティング (Slack)
  'Ctrl+Shift+T',    // スレッド
  'Ctrl+Shift+X',    // 取り消し線
  'Ctrl+Shift+C',    // コードテキスト
  'Ctrl+Shift+7',    // 番号付きリスト
  'Ctrl+Shift+8',    // 箇条書きリスト
  'Ctrl+Shift+9',    // 引用
  'Ctrl+Shift+1',    // ホーム（代替）
  'Ctrl+Shift+2',    // DM（代替）
  'Ctrl+Shift+3',    // アクティビティ（代替）
  'Ctrl+Shift+4',    // 後で（代替）
  'Ctrl+Shift+L',    // チャンネル一覧
  'Ctrl+Shift+E',    // チームディレクトリ
  'Ctrl+Shift+I',    // チャンネル情報
  'Ctrl+Shift+S',    // ワークスペーススイッチャーを開く
  'Ctrl+Shift+Space', // ハドルミーティングのミュート切り替え
  'Ctrl+Shift+D',    // サイドバー表示/非表示
  'Ctrl+Shift+\\',   // カスタム絵文字
  'Ctrl+Shift+Enter', // コードスニペットを作成
  'Ctrl+Shift+Y',    // 通話を開始
  'M',               // ミュート/ミュート解除（通話中）
  'V',               // ビデオのオン/オフ（通話中）
  'Shift+Esc',       // 未読をすべて既読にする
  'Shift+Escape',    // 現在の選択をクリア
  'Ctrl+Shift+K',    // DMを開く
  'Ctrl+Shift+M',    // アクティビティに移動
  'Ctrl+.',          // 次の未読セクションに移動
  'Ctrl+Shift+F',    // 検索結果をフィルタ
  'Ctrl+Alt+Shift+K', // コードブロック
  'F11',             // フルスクリーン表示の切り替え

  // Chrome上級
  'Ctrl+U',          // ソースを表示
  'Ctrl+O',          // ファイルを開く
  'Ctrl+Shift+O',    // ブックマークマネージャを開く
  'Ctrl+Shift+B',    // ブックマークバーの表示/非表示
  'Ctrl+Shift+D',    // すべてのタブをブックマーク
  'Ctrl+K',          // 検索バーにフォーカス
  'Ctrl+E',          // 検索バーにフォーカス
  'Ctrl+Shift+Page Down', // タブを右に移動
  'Ctrl+Shift+Page Up',   // タブを左に移動
  'Ctrl+Enter',      // .comを追加してページを開く
  'F7',              // カーソルブラウジングの切り替え
  'Backspace',       // 前のページに戻る
  'Shift+Backspace', // 次のページに進む

  // 汎用テキスト編集 (単語単位移動)
  'Ctrl+←',          // 前の単語の先頭に移動 (Windows/汎用)
  'Ctrl+→',          // 次の単語の先頭に移動 (Windows/汎用)
  'Meta+←',          // 前の単語の先頭に移動 (Mac/汎用)
  'Meta+→',          // 次の単語の先頭に移動 (Mac/汎用)
]);

/**
 * 最難関ショートカット（正規化形式）
 * プロフェッショナル向け：非常に特殊で習得が難しいショートカット
 */
export const MADMAX_SHORTCUTS = new Set([
  'Tab then Enter',  // 送信ボタンにフォーカスして送信

  // ブラウザ上級 (Chrome)
  'Ctrl+Shift+I',    // デベロッパーツール
  'F12',             // デベロッパーツール（代替）
  'Ctrl+Shift+Delete', // 閲覧データを削除
  'Ctrl+Shift+J',    // コンソールを開く
  'Ctrl+Shift+C',    // 要素を検証
  'Ctrl+[',          // DevTools前のパネル
  'Ctrl+]',          // DevTools次のパネル
  'Ctrl+Shift+A',    // タブを検索
  'Ctrl+Shift+E',    // 拡張機能ページを開く
  'Shift+Escape',    // Chromeタスクマネージャーを開く
  'F3',              // ページ内検索を開く
  'Ctrl+Shift+W',    // ウィンドウを閉じる

  // Excel上級
  'Ctrl+Shift+Space',// すべてのセルを選択
  'Ctrl+Shift+Enter',// 配列数式を入力

  // Excel 順序押しショートカット（リボンアクセスキー）
  'Alt+I+R',         // 行を挿入
  'Alt+I+C',         // 列を挿入
  'Alt+E+D',         // 行または列を削除
  'Alt+H+O+I',       // 行の自動調整
  'Alt+H+O+A',       // 列の自動調整
  'Alt+H+L',         // 条件付き書式
  'Alt+H+L+R',       // ルールの管理
  'Alt+W+F+F',       // ウィンドウ枠の固定
  'Alt+A+T',         // フィルター
  'Alt+N+V',         // ピボットテーブル
  'Alt+D+P',         // ピボットテーブルウィザード（旧式）
  'Alt+F+T',         // Excelオプションを開く
  'Alt+R+D',         // コメントを削除
  'Alt+H+H',         // 塗りつぶしの色
  'Alt+H+F+C',       // フォントの色
  'Alt+H+I+S',       // シートの挿入
  'Alt+H+D+S',       // シートの削除
  'Alt+H+O+R',       // シート名の変更
  'Alt+W+V+G',       // 枠線の表示/非表示
  'Alt+W+V+H',       // 見出しの表示/非表示
  'Alt+A+S+A',       // 昇順で並べ替え
  'Alt+A+S+D',       // 降順で並べ替え
  'Alt+A+S+S',       // ユーザー設定の並べ替え
  'Alt+A+C',         // フィルターをクリア
  'Alt+H+M+C',       // セルを結合して中央揃え
  'Alt+H+M+U',       // セルの結合を解除
  'Alt+M+P',         // 参照元のトレース
  'Alt+M+D',         // 参照先のトレース
  'Alt+M+A+A',       // トレース矢印をすべて削除
  'Alt+F+I+S',       // ブックのプロパティ
  'Alt+F+A',         // 名前を付けて保存
  'Alt+N+S+L',       // 折れ線スパークラインを挿入
  'Alt+N+S+C',       // 縦棒スパークラインを挿入
  'Alt+N+S+W',       // 勝敗スパークラインを挿入

  // Windows特殊
  'Win+Ctrl+D',      // 新しい仮想デスクトップを追加
  'Win+Ctrl+←',      // 左の仮想デスクトップに切り替え
  'Win+Ctrl+→',      // 右の仮想デスクトップに切り替え
  'Win+Ctrl+F4',     // 使用中の仮想デスクトップを閉じる
  'Win+Ctrl+Enter',  // ナレーターを開く
  'Win+Ctrl+N',      // ナレーター設定を開く
  'Win+Ctrl+M',      // 拡大鏡を開く
  'Win+Ctrl+C',      // カラーフィルターのオン/オフ
  'Win+Ctrl+Shift+B', // グラフィックドライバーを再起動
  'Win+Print Screen', // スクリーンショットを保存
  'Win+Alt+R',       // ゲームバーで録画開始/停止
  'Win+Alt+Print Screen', // ゲームウィンドウのスクリーンショット
  'Win+Alt+G',       // 最後の30秒を録画
  'Ctrl+Shift+Escape', // タスクマネージャーを開く
  'Ctrl+Alt+Delete', // セキュリティオプション画面
  'Left Alt+Left Shift+Print Screen', // ハイコントラストのオン/オフ
  'Ctrl+Tab',        // 次のタブに切り替え
  'Ctrl+Shift+Tab',  // 前のタブに切り替え
  'Ctrl+PageDown',   // 次のタブ（代替）
  'Ctrl+PageUp',     // 前のタブ（代替）
  'Tab',             // 次のオプションに移動
  'Shift+Tab',       // 前のオプションに移動
  'Space',           // チェックボックスのオン/オフ
  'Enter',           // ボタンを実行

  // macOS最難関
  'Meta+Option+Escape',// 強制終了
  'Ctrl+Cmd+Q',      // 画面をロック
  'Meta+Shift+Q',    // ログアウト
  'Meta+Ctrl+Power', // 再起動
  'Option+Meta+Power', // スリープ
  'Meta+Shift+Delete', // ゴミ箱を空にする
  'Ctrl+Shift+Power', // ディスプレイをスリープ
  'Ctrl+Shift+Eject', // ディスプレイをスリープ（Eject）
  'Meta+Option+Eject', // スリープ
  'Meta+Option+F5',  // アクセシビリティオプション
  'Meta+Option+8',   // ズーム機能のオン/オフ
  'Meta+Option+=',   // ズームイン（アクセシビリティ）
  'Meta+Option+-',   // ズームアウト（アクセシビリティ）
  'Ctrl+Option+Meta+8', // 色を反転
  'Fn Fn',           // 音声入力を開始

  // 新規追加 - VSCode
  'Ctrl+K Ctrl+S',   // VSCode: キーボードショートカット
  'Ctrl+Shift+P',    // VSCode: コマンドパレット (Windows)
  'Meta+Shift+P',    // VSCode: コマンドパレット (Mac)
  'Ctrl+`',          // VSCode: 統合ターミナル表示/非表示 (Windows)
  'Meta+`',          // VSCode: 統合ターミナル表示/非表示 (Mac)

  // 新規追加 - その他の高度なショートカット
  'Alt+PrintScreen', // アクティブウィンドウのスクリーンショット
  'Win+.',           // Windows絵文字パネル
  'Win+V',           // Windowsクラウドクリップボード履歴
]);


/**
 * ショートカットの難易度を判定
 * @param normalizedShortcut - 正規化されたショートカット
 * @returns 難易度（'basic' | 'standard' | 'hard' | 'madmax' | 'allrange'）
 */
export const getShortcutDifficulty = (normalizedShortcut: string): 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange' => {
  if (MADMAX_SHORTCUTS.has(normalizedShortcut)) { // madmaxが最も優先される
    return 'madmax';
  }
  if (HARD_SHORTCUTS.has(normalizedShortcut)) {
    return 'hard';
  }
  if (BASIC_SHORTCUTS.has(normalizedShortcut)) {
    return 'basic';
  }
  if (STANDARD_SHORTCUTS.has(normalizedShortcut)) {
    return 'standard';
  }
  // どの難易度にも該当しない場合はstandardとして扱う
  return 'standard';
};

/**
 * 指定された難易度に適合するかチェック
 * @param normalizedShortcut - 正規化されたショートカット
 * @param targetDifficulty - 対象難易度
 * @returns 適合する場合true
 */
export const matchesDifficulty = (
  normalizedShortcut: string,
  targetDifficulty: 'basic' | 'standard' | 'hard' | 'madmax' | 'allrange'
): boolean => {
  const shortcutDifficulty = getShortcutDifficulty(normalizedShortcut);

  // allrangeは全てのショートカットを含む
  if (targetDifficulty === 'allrange') {
    return true;
  }

  // basicはbasicのみ
  if (targetDifficulty === 'basic') {
    return shortcutDifficulty === 'basic';
  }

  // standardはstandardのみ（basic、hard、madmax以外）
  if (targetDifficulty === 'standard') {
    return shortcutDifficulty === 'standard';
  }

  // hardはhardのみ
  if (targetDifficulty === 'hard') {
    return shortcutDifficulty === 'hard';
  }

  // madmaxはmadmaxのみ
  if (targetDifficulty === 'madmax') {
    return shortcutDifficulty === 'madmax';
  }

  return false;
};
