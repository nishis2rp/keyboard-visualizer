// macOS ショートカット
export const macosShortcuts = {
  // システム基本操作
  'Cmd + A': 'すべて選択',
  'Cmd + C': 'コピー',
  'Cmd + X': '切り取り',
  'Cmd + V': '貼り付け',
  'Cmd + Z': '元に戻す',
  'Cmd + Shift + Z': 'やり直し',
  'Cmd + S': '保存',
  'Cmd + P': '印刷',
  'Cmd + W': 'ウィンドウを閉じる',
  'Cmd + Q': 'アプリを終了',
  'Cmd + N': '新規ウィンドウ',
  'Cmd + T': '新規タブ',
  'Cmd + O': 'ファイルを開く',
  'Cmd + F': '検索',
  'Cmd + G': '次を検索',
  'Cmd + H': 'ウィンドウを隠す',
  'Cmd + M': 'ウィンドウを最小化',
  'Cmd + Option + H': '他のウィンドウを隠す',
  'Cmd + ,': '環境設定を開く',
  'Cmd + Space': 'Spotlightを表示',
  'Cmd + Tab': 'アプリケーションの切り替え',
  'Cmd + `': '同じアプリのウィンドウ切り替え',

  // Finder操作
  'Cmd + Delete': 'ゴミ箱に移動',
  'Cmd + Shift + Delete': 'ゴミ箱を空にする',
  'Cmd + D': '複製',
  'Cmd + E': 'ディスクを取り出す',
  'Cmd + I': '情報を見る (Finder)',
  'Cmd + Shift + N': '新規フォルダ (Finder)',
  'Cmd + Option + V': '移動（カット&ペースト）',
  'Cmd + [': '戻る',
  'Cmd + ]': '進む',
  'Cmd + ↑': '親フォルダを開く',
  'Cmd + ↓': '選択項目を開く',
  'Cmd + Shift + G': 'フォルダへ移動',
  'Cmd + Shift + .': '隠しファイル表示切り替え',
  'Cmd + Ctrl + Space': '絵文字と記号',

  // スクリーンショット
  'Cmd + Shift + 3': 'スクリーン全体をキャプチャ',
  'Cmd + Shift + 4': '選択範囲をキャプチャ',
  'Cmd + Shift + 5': 'スクリーンショットオプション',
  'Cmd + Shift + 6': 'Touch Barをキャプチャ',

  // ウィンドウ管理
  'Cmd + Ctrl + F': 'フルスクリーン切り替え',
  'Ctrl + ←': 'Mission Control左へ',
  'Ctrl + →': 'Mission Control右へ',
  'Ctrl + ↑': 'Mission Controlを表示',
  'Ctrl + ↓': 'アプリケーションWindowsを表示',
  'F3': 'Mission Control',
  'F4': 'Launchpadを表示',

  // テキスト編集
  'Cmd + B': '太字 (テキスト編集)',
  'Cmd + I': '斜体 (テキスト編集)',
  'Cmd + U': '下線',
  'Cmd + →': '行末へ移動',
  'Cmd + ←': '行頭へ移動',
  'Option + →': '次の単語へ',
  'Option + ←': '前の単語へ',
  'Cmd + ↑': '文書の先頭へ',
  'Cmd + ↓': '文書の末尾へ',
  'Cmd + Shift + →': '行末まで選択',
  'Cmd + Shift + ←': '行頭まで選択',

  // Safari/ブラウザ
  'Cmd + R': '再読み込み',
  'Cmd + L': 'アドレスバーにフォーカス',
  'Cmd + +': 'ズームイン',
  'Cmd + -': 'ズームアウト',
  'Cmd + 0': 'ズームをリセット',
  'Cmd + Shift + T': '閉じたタブを開く',
  'Cmd + Shift + [': '前のタブ',
  'Cmd + Shift + ]': '次のタブ',
  'Cmd + 1': '1番目のタブ',
  'Cmd + 2': '2番目のタブ',
  'Cmd + 9': '最後のタブ',

  // その他
  'Ctrl + Cmd + Q': '画面をロック',
  'Cmd + Option + Escape': '強制終了',
  'Cmd + Shift + Q': 'ログアウト',
  'Cmd + Ctrl + Power': '再起動',
  'Option + Cmd + Power': 'スリープ',

  // Dock
  'Cmd + Option + D': 'Dockの表示/非表示',
  'Option + クリック': 'アプリを隠す',

  // Spotlight・検索
  'Cmd + Option + Space': 'Finderの検索ウィンドウを表示',

  // メニューバー
  'Ctrl + F2': 'メニューバーにフォーカス',
  'Ctrl + F3': 'Dockにフォーカス',
  'Cmd + Shift + /': 'ヘルプメニューを検索',

  // 通知センター
  'Ctrl + Cmd + N': '通知センターを表示',

  // Pages・Numbers・Keynote
  'Cmd + Shift + P': 'ページ設定',
  'Cmd + Return': 'ページ区切りを挿入',
  'Cmd + K': 'リンクを追加',

  // Mail
  'Cmd + Shift + D': 'メールを送信 (Mail)',
  'Cmd + Shift + R': '全員に返信 (Mail)',
  'Cmd + Shift + F': '転送',
  'Cmd + Shift + U': '既読/未読を切り替え',
  'Cmd + Shift + L': 'フラグを設定',
  'Cmd + Shift + J': '迷惑メール',

  // Safari（追加）
  'Cmd + Shift + R': 'キャッシュなしで再読み込み (Safari)',
  'Cmd + Shift + \\': 'すべてのタブを表示',
  'Cmd + Option + L': 'ダウンロードを表示',
  'Cmd + Shift + N': 'プライベートブラウズ (Safari)',
  'Cmd + Y': '履歴を表示',
  'Cmd + Option + B': 'すべてのブックマークを編集',
  'Cmd + Option + 1': 'サイドバーを表示',
  'Cmd + Option + 2': 'リーディングリストを表示',

  // ユニバーサルアクセス
  'Cmd + Option + F5': 'アクセシビリティオプション',
  'Cmd + Option + 8': 'ズーム機能のオン/オフ',
  'Cmd + Option + =': 'ズームイン (アクセシビリティ)',
  'Cmd + Option + -': 'ズームアウト (アクセシビリティ)',
  'Ctrl + Option + Cmd + 8': '色を反転',

  // スクリーンショット（詳細）
  'Cmd + Shift + 4 + Space': 'ウィンドウをキャプチャ',

  // Time Machine
  'Cmd + Option + Shift + Delete': 'ゴミ箱を空にする（確認なし）',

  // その他の便利なショートカット (Finder)
  'Cmd + Shift + A': 'アプリケーションフォルダを開く',
  'Cmd + Shift + U': 'ユーティリティフォルダを開く',
  'Cmd + Shift + I': 'iCloudドライブを開く',
  'Cmd + Shift + O': '書類フォルダを開く',
  'Cmd + Shift + D': 'デスクトップフォルダを開く (Finder)',
  'Cmd + Shift + H': 'ホームフォルダを開く',
  'Cmd + Shift + K': 'ネットワークを開く',
  'Cmd + Shift + R': 'AirDropウィンドウを開く (Finder)',

  // ディクテーション
  'Fn Fn (2回)': '音声入力を開始',

  // Launchpad
  'Fn + F4': 'Launchpadを表示',

  // Dashboard（古いmacOS）
  'Fn + F12': 'Dashboardを表示',
}
