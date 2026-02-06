// 主要なGmailショートカットリスト（Googleの公式ドキュメントより）
const knownGmailShortcuts = [
  // Navigation
  { keys: 'g + a', description: 'すべてのメール' },
  { keys: 'g + s', description: 'スター付き' },
  { keys: 'g + t', description: '送信済み' },
  { keys: 'g + d', description: '下書き' },
  { keys: 'g + i', description: '受信トレイ' },
  { keys: 'g + l', description: 'ラベル' },
  { keys: 'g + b', description: 'スヌーズ中' },
  { keys: 'g + k', description: 'タスク' },
  { keys: 'g + c', description: '連絡先' },

  // Additional navigation
  { keys: 'Ctrl + .', description: '次の受信トレイセクション' },
  { keys: 'Ctrl + ,', description: '前の受信トレイセクション' },
  { keys: 'Ctrl + Down', description: 'チャットに移動' },
  { keys: 'Ctrl + ;', description: 'チャットのアーカイブ済みを表示' },

  // Actions
  { keys: 'e', description: 'アーカイブ' },
  { keys: '#', description: '削除' },
  { keys: 'r', description: '返信' },
  { keys: 'a', description: '全員に返信' },
  { keys: 'f', description: '転送' },
  { keys: 's', description: 'スター' },
  { keys: 'i', description: '既読' },
  { keys: 'Shift + i', description: '既読' },
  { keys: 'Shift + u', description: '未読' },
  { keys: 'u', description: 'スレッドリストに戻る' },
  { keys: 'x', description: 'スレッドを選択' },
  { keys: 'l', description: 'ラベルを付ける' },
  { keys: 'v', description: 'フォルダに移動' },
  { keys: 'm', description: 'ミュート' },
  { keys: '!', description: '迷惑メール報告' },
  { keys: 'b', description: 'スヌーズ' },
  { keys: 'y', description: 'アーカイブして前/次へ' },
  { keys: 'w', description: 'タスクに追加' },
  { keys: 'Shift + t', description: '新しいタスクを追加' },
  { keys: 'h', description: 'スレッドを展開/折りたたみ' },

  // Compose
  { keys: 'c', description: '新規メール作成' },
  { keys: 'Shift + C', description: '新しいウィンドウで作成' },
  { keys: 'd', description: '下書きに保存' },
  { keys: 'Shift + R', description: '新しいウィンドウで返信' },
  { keys: 'Shift + A', description: '新しいウィンドウで全員に返信' },
  { keys: 'Shift + F', description: '新しいウィンドウで転送' },
  { keys: 'Tab then Enter', description: '送信' },
  { keys: 'Ctrl + Enter', description: '送信' },
  { keys: 'Ctrl + s', description: '下書きを保存' },
  { keys: 'Ctrl + Shift + C', description: 'CCに追加' },
  { keys: 'Ctrl + Shift + B', description: 'BCCに追加' },
  { keys: 'Shift + c', description: 'CCに追加' },
  { keys: 'Shift + b', description: 'BCCに追加' },

  // Formatting
  { keys: 'Ctrl + B', description: '太字' },
  { keys: 'Ctrl + I', description: '斜体' },
  { keys: 'Ctrl + U', description: '下線' },
  { keys: 'Ctrl + Shift + 5', description: '取り消し線' },
  { keys: 'Ctrl + k', description: 'リンク挿入' },
  { keys: 'Ctrl + Shift + 7', description: '番号付きリスト' },
  { keys: 'Ctrl + Shift + 8', description: '箇条書き' },
  { keys: 'Ctrl + Shift + 9', description: '引用' },
  { keys: 'Ctrl + Shift + -', description: 'フォントサイズを小さく' },
  { keys: 'Ctrl + Shift + +', description: 'フォントサイズを大きく' },
  { keys: 'Ctrl + Shift + l', description: '左揃え' },
  { keys: 'Ctrl + Shift + e', description: '中央揃え' },
  { keys: 'Ctrl + Shift + r', description: '右揃え' },
  { keys: 'Ctrl + \\', description: '書式をクリア' },
  { keys: 'Ctrl + Shift + X', description: 'インデント解除' },
  { keys: 'Ctrl + ]', description: 'インデント' },
  { keys: 'Ctrl + [', description: 'インデント解除' },

  // Selection
  { keys: '* + a', description: 'すべて選択' },
  { keys: '* + n', description: '選択解除' },
  { keys: '* + r', description: '既読を選択' },
  { keys: '* + u', description: '未読を選択' },
  { keys: '* + s', description: 'スター付きを選択' },
  { keys: '* + t', description: 'スターなしを選択' },

  // Movement
  { keys: 'j', description: '次のスレッド' },
  { keys: 'k', description: '前のスレッド' },
  { keys: 'n', description: '次のメッセージ' },
  { keys: 'p', description: '前のメッセージ' },
  { keys: 'o', description: 'スレッドを開く' },
  { keys: 'Enter', description: 'スレッドを開く' },
  { keys: '`', description: '次のセクション' },
  { keys: '~', description: '前のセクション' },
  { keys: '[', description: 'アーカイブして前へ' },
  { keys: ']', description: 'アーカイブして次へ' },
  { keys: '{', description: 'アーカイブしてリストへ' },

  // System
  { keys: '/', description: '検索ボックス' },
  { keys: '?', description: 'ショートカット一覧' },
  { keys: ',', description: '設定' },
  { keys: '.', description: 'その他の操作メニュー' },
  { keys: 'Esc', description: 'フォーカスを外す' },
  { keys: 'Shift + Esc', description: 'フォーカスを外す' },
  { keys: 'Ctrl + P', description: '印刷' },
  { keys: 'Ctrl + F', description: 'メール内検索' },
  { keys: 'Ctrl + Shift + F', description: 'フィルタで検索' },
  { keys: 'z', description: '元に戻す' },
  { keys: 'Shift + Z', description: 'やり直す' },
  { keys: 'Shift + n', description: '受信トレイを更新' },
  { keys: 'Shift + T', description: '新しいタブで開く' },
  { keys: 'Shift + #', description: '削除' },
  { keys: 'Shift + 1', description: '迷惑メール' },
  { keys: 'Shift + D', description: '下書きとして保存' },
  { keys: 'Shift + N', description: 'すべて未読にする' },
  { keys: 'Shift + I', description: '既読にする' },
  { keys: 'Shift + U', description: '未読にする' },

  // Importance markers
  { keys: '+', description: '重要マークを付ける' },
  { keys: '=', description: '重要マークを付ける' },
  { keys: '-', description: '重要マークを外す' },
  { keys: '_', description: '重要マークを外す' },
  { keys: '. + i', description: '重要マークを付ける' },
  { keys: '. + u', description: '未読にする' },
  { keys: '. + b', description: '重要マークを外す' },

  // Actions (extended)
  { keys: 'm + a', description: 'すべてを既読にする' },
  { keys: 'q', description: 'チャットセクションに移動' },
  { keys: 'y + o', description: 'チャットを開く' },
  { keys: 'Shift + G', description: '前のページ' },
  { keys: 'Shift + H', description: 'スレッドを既読/未読切り替え' },
];

console.log('Known Gmail shortcuts:', knownGmailShortcuts.length);

// Export for use in other scripts
export { knownGmailShortcuts };
