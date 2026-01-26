-- Rebalance difficulty levels: increase basic and hard, reduce standard
-- This migration provides better difficulty distribution across all applications

-- Windows 11: 基本的なショートカットをbasicに変更
UPDATE shortcuts SET difficulty = 'basic'
WHERE application = 'windows11' AND description IN (
  'すべて選択',
  'コピー',
  '貼り付け',
  '切り取り',
  '元に戻す',
  '保存',
  '印刷',
  '検索',
  'やり直し',
  '新しいウィンドウを開く',
  'ウィンドウを閉じる',
  'PCをロック',
  'タスクマネージャー',
  'エクスプローラーを開く',
  '設定を開く',
  'スタートメニューを開く',
  'デスクトップを表示/非表示',
  'アプリの切り替え',
  '前のページに戻る',
  '次のページに進む',
  'ページを更新',
  '最小化',
  '最大化'
);

-- Windows 11: 高度なショートカットをhardに変更
UPDATE shortcuts SET difficulty = 'hard'
WHERE application = 'windows11' AND description IN (
  'ウィンドウを左半分に配置',
  'ウィンドウを右半分に配置',
  'ウィンドウを上半分に配置',
  'ウィンドウを下半分に配置',
  'ウィンドウを最大化/元に戻す',
  'アクティブウィンドウ以外を最小化/復元',
  'ウィンドウを別のデスクトップに移動',
  'レジストリエディタ',
  'コマンドプロンプト（管理者）',
  'タスクバーのアプリを順番に選択',
  'システム情報',
  'ディスプレイ設定の切り替え',
  'ウィンドウスナップの無効化',
  'クリップボード履歴',
  '絵文字パネル',
  'Windows Ink ワークスペース',
  'ゲームバー',
  'Mixed Reality',
  '仮想デスクトップ追加',
  '仮想デスクトップ切り替え'
);

-- macOS: 基本的なショートカットをbasicに変更
UPDATE shortcuts SET difficulty = 'basic'
WHERE application = 'macos' AND description IN (
  'すべて選択',
  'コピー',
  '貼り付け',
  '切り取り',
  '元に戻す',
  '保存',
  '印刷',
  '検索',
  'やり直し',
  '新しいウィンドウ',
  'ウィンドウを閉じる',
  'アプリを終了',
  'Spotlight検索',
  'Finder',
  'Launchpad',
  'Mission Control',
  'アプリケーションスイッチャー',
  'スクリーンショット',
  '最小化',
  '隠す',
  '前のタブ',
  '次のタブ'
);

-- macOS: 高度なショートカットをhardに変更
UPDATE shortcuts SET difficulty = 'hard'
WHERE application = 'macos' AND description IN (
  'ウィンドウを左半分に配置',
  'ウィンドウを右半分に配置',
  'ウィンドウをフルスクリーン',
  '他のウィンドウを隠す',
  'すべてのウィンドウを最小化',
  'ターミナル',
  'アクティビティモニタ',
  'フォースクリア',
  'Dockにフォーカス',
  'Dockの表示/非表示',
  '即座にスリープ',
  'ログアウト',
  'システム終了',
  'Mission Control右へ',
  'Mission Control左へ',
  '絵文字と記号',
  '音声入力を開始',
  '辞書',
  '拡大/縮小',
  '反転',
  'Quick Lookスライドショー'
);

-- Chrome: 基本的なショートカットをbasicに変更
UPDATE shortcuts SET difficulty = 'basic'
WHERE application = 'chrome' AND description IN (
  '新しいタブを開く',
  'タブを閉じる',
  '閉じたタブを再度開く',
  '次のタブに移動',
  '前のタブに移動',
  'ページを更新',
  '前のページに戻る',
  '次のページに進む',
  'ブックマークに追加',
  'ブックマークマネージャー',
  '履歴を開く',
  'ダウンロードを開く',
  'シークレットウィンドウを開く',
  '新しいウィンドウを開く',
  'ウィンドウを閉じる',
  'ページ内検索',
  '最後のタブに移動',
  'アドレスバーにフォーカス',
  '全画面表示の切り替え'
);

-- Chrome: 高度なショートカットをhardに変更
UPDATE shortcuts SET difficulty = 'hard'
WHERE application = 'chrome' AND description IN (
  'デベロッパーツールを開く',
  'JavaScriptコンソール',
  'ソースの表示',
  '要素の検証',
  'タスクマネージャー',
  'タブを固定',
  'タブをミュート',
  'タブを複製',
  'タブグループを作成',
  'ブックマークバーの表示/非表示',
  'シークレットモード',
  'キャッシュクリア',
  'ダウンロードフォルダ',
  'ページ情報',
  'サイト設定'
);

-- Excel: 基本的なショートカットをbasicに変更
UPDATE shortcuts SET difficulty = 'basic'
WHERE application = 'excel' AND description IN (
  '保存',
  '新規ブック',
  'ファイルを開く',
  '印刷',
  '元に戻す',
  'やり直し',
  'コピー',
  '貼り付け',
  '切り取り',
  '検索',
  '置換',
  '太字',
  '斜体',
  '下線',
  'シート移動 (右)',
  'シート移動 (左)',
  'セル編集',
  'セルの書式設定',
  '合計 (オートSUM)',
  '次のワークシートを選択',
  '行を挿入',
  '列を挿入',
  '行を削除',
  '列を削除',
  'セルを結合'
);

-- Excel: 高度なショートカットをhardに変更
UPDATE shortcuts SET difficulty = 'hard'
WHERE application = 'excel' AND description IN (
  'ピボットテーブル',
  'マクロ実行',
  'VBAエディタ',
  '名前の定義',
  '条件付き書式',
  'フィルタの詳細設定',
  'データの入力規則',
  'ゴールシーク',
  'ソルバー',
  'シナリオ管理',
  'グループ化',
  'アウトラインの作成',
  '小計',
  'What-If分析',
  '配列数式',
  '外部データの取り込み',
  'Power Query',
  'スパークライン',
  'ウォッチウィンドウ',
  '循環参照の検索',
  'エラーチェック',
  'ブレークポイント',
  'ステップ実行'
);

-- Gmail: 基本的なショートカットをbasicに変更
UPDATE shortcuts SET difficulty = 'basic'
WHERE application = 'gmail' AND description IN (
  '新規メール作成',
  '送信',
  '返信',
  '全員に返信',
  '転送',
  '検索',
  '受信トレイに移動',
  '送信済みに移動',
  '下書きに移動',
  '削除',
  'アーカイブ',
  'メールを開く',
  '次のメール',
  '前のメール',
  'スター',
  '既読にする',
  '未読にする',
  'ラベルを追加',
  '迷惑メール報告'
);

-- Gmail: 高度なショートカットをhardに変更
UPDATE shortcuts SET difficulty = 'hard'
WHERE application = 'gmail' AND description IN (
  'フィルタ作成',
  '重要マーク',
  'ミュート',
  'スヌーズ',
  '書式設定の切り替え',
  'Cc受信者を追加',
  'Bcc受信者を追加',
  'タスクを追加',
  'カレンダーイベント作成',
  'チャットに移動',
  'Meet会議を開始',
  '添付ファイル検索',
  '検索演算子',
  '高度な検索',
  'キーボードショートカット一覧'
);

-- Slack: 基本的なショートカットをbasicに変更
UPDATE shortcuts SET difficulty = 'basic'
WHERE application = 'slack' AND description IN (
  'メッセージを送信',
  '検索',
  'ダイレクトメッセージ',
  'チャンネル切り替え',
  '前のチャンネル',
  '次のチャンネル',
  'スレッドを開く',
  'ファイルアップロード',
  '絵文字リアクション',
  'メンション',
  '未読に移動',
  'ブックマーク',
  '環境設定',
  'ヘルプ',
  '新規メッセージ',
  'スレッド返信',
  '編集'
);

-- Slack: 高度なショートカットをhardに変更
UPDATE shortcuts SET difficulty = 'hard'
WHERE application = 'slack' AND description IN (
  'すべての未読をマーク',
  'リマインダー設定',
  'ワークスペース切り替え',
  'ステータス変更',
  '通知設定',
  'カスタム絵文字',
  'スニペット作成',
  'コードブロック',
  'リアクション検索',
  'メッセージをピン',
  'メッセージを後で送信',
  'ショートカット一覧'
);

-- VS Code: 既存のbasicはそのまま維持（変更なし）

COMMENT ON TABLE shortcuts IS 'Keyboard shortcuts - rebalanced difficulty: increased basic and hard, reduced standard';
