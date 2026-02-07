// さらに包括的なGmailショートカットリスト
// Googleの公式ドキュメントと実際の使用から収集

export const additionalGmailShortcuts = [
  // 既に見つかった11個に加えて、さらに追加

  // ラベル番号キー (1-9)
  { keys: '1', description: 'ラベル1を適用/削除', category: 'ラベル', difficulty: 'madmax' },
  { keys: '2', description: 'ラベル2を適用/削除', category: 'ラベル', difficulty: 'madmax' },
  { keys: '3', description: 'ラベル3を適用/削除', category: 'ラベル', difficulty: 'madmax' },
  { keys: '4', description: 'ラベル4を適用/削除', category: 'ラベル', difficulty: 'madmax' },

  // 拡張ナビゲーション
  { keys: 'g + p', description: '通話に移動', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'g + v', description: '音声通話に移動', category: 'ナビゲーション', difficulty: 'madmax' },

  // スレッド操作
  { keys: 'Shift + 8', description: 'スターを付ける（同じく s）', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + -', description: '重要マークを外す（同じく -）', category: '重要', difficulty: 'madmax' },
  { keys: 'Shift + =', description: '重要マークを付ける（同じく +）', category: '重要', difficulty: 'madmax' },
  { keys: 'Shift + ;', description: 'フィルタメッセージを表示', category: 'フィルタ', difficulty: 'madmax' },

  // 作成・編集
  { keys: 'Ctrl + Shift + A', description: '宛先フィールドに全員を追加', category: '作成', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + D', description: '下書きを破棄', category: '作成', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + O', description: '箇条書きリストを開始', category: '書式設定', difficulty: 'madmax' },

  // 書式設定（さらに追加）
  { keys: 'Ctrl + Shift + L', description: '左揃え（大文字L）', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + E', description: '中央揃え（大文字E）', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + R', description: '右揃え（大文字R）', category: '書式設定', difficulty: 'madmax' },

  // 検索・フィルタ
  { keys: 'Ctrl + /', description: 'カスタムキーボードショートカットを検索', category: 'ヘルプ', difficulty: 'madmax' },

  // 選択の拡張
  { keys: '* + i', description: '未読スレッドを選択', category: '選択', difficulty: 'madmax' },
  { keys: '* + c', description: '連絡先グループを選択', category: '選択', difficulty: 'madmax' },

  // タスク管理
  { keys: 'g + k', description: 'タスクに移動', category: 'タスク', difficulty: 'madmax' }, // 重複チェック必要
  { keys: 'Shift + t', description: '新しいタスクを追加', category: 'タスク', difficulty: 'madmax' }, // 重複チェック必要

  // その他の便利なショートカット
  { keys: 'Ctrl + Shift + 6', description: 'メンションを挿入', category: '作成', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + ;', description: 'スペルチェック', category: '作成', difficulty: 'madmax' },
  { keys: 'Shift + X', description: 'スレッドを選択してラベルメニューを開く', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + L', description: 'ラベルメニューを開く', category: 'ラベル', difficulty: 'madmax' },
  { keys: 'Shift + V', description: 'フォルダに移動メニューを開く', category: 'アクション', difficulty: 'madmax' },

  // 会話の操作
  { keys: 'Shift + J', description: '古いスレッドに移動', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'Shift + K', description: '新しいスレッドに移動', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'Shift + O', description: '会話を開く', category: 'ナビゲーション', difficulty: 'madmax' },

  // アクセシビリティ
  { keys: 'Ctrl + Shift + M', description: 'メインメニューを開く', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'Ctrl + Alt + ,', description: 'チャットに切り替え', category: 'チャット', difficulty: 'madmax' },
  { keys: 'Ctrl + Alt + .', description: 'メールに切り替え', category: 'ナビゲーション', difficulty: 'madmax' },

  // 絵文字と特殊文字
  { keys: 'Ctrl + Shift + 2', description: '絵文字を挿入', category: '作成', difficulty: 'madmax' },

  // カレンダー統合
  { keys: 'Ctrl + Shift + G', description: 'Googleカレンダーイベントを挿入', category: '作成', difficulty: 'madmax' },

  // マルチアカウント
  { keys: 'Ctrl + Alt + 1', description: 'アカウント1に切り替え', category: 'アカウント', difficulty: 'madmax' },
  { keys: 'Ctrl + Alt + 2', description: 'アカウント2に切り替え', category: 'アカウント', difficulty: 'madmax' },
  { keys: 'Ctrl + Alt + 3', description: 'アカウント3に切り替え', category: 'アカウント', difficulty: 'madmax' },

  // その他
  { keys: 'Shift + Enter', description: '作成ウィンドウを全画面表示', category: '作成', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + I', description: '画像を挿入', category: '作成', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + L', description: 'リンクを挿入（代替）', category: '作成', difficulty: 'madmax' }, // Ctrl+kの代替
];

console.log('Additional shortcuts to consider:', additionalGmailShortcuts.length);
