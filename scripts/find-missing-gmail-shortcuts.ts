import { getSupabaseClient } from './lib/supabase';

// 主要なGmailショートカットリスト（Googleの公式ドキュメントより）
const comprehensiveGmailShortcuts = [
  // Navigation
  { keys: 'g + a', description: 'すべてのメールに移動', category: 'ナビゲーション', difficulty: 'standard' },
  { keys: 'g + s', description: 'スター付きに移動', category: 'ナビゲーション', difficulty: 'standard' },
  { keys: 'g + t', description: '送信済みに移動', category: 'ナビゲーション', difficulty: 'standard' },
  { keys: 'g + d', description: '下書きに移動', category: 'ナビゲーション', difficulty: 'standard' },
  { keys: 'g + i', description: '受信トレイに移動', category: 'ナビゲーション', difficulty: 'basic' },
  { keys: 'g + l', description: 'ラベルに移動', category: 'ナビゲーション', difficulty: 'standard' },
  { keys: 'g + b', description: 'スヌーズ中に移動', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'g + k', description: 'タスクに移動', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'g + c', description: '連絡先に移動', category: 'ナビゲーション', difficulty: 'madmax' },

  // Additional navigation (missing from DB)
  { keys: 'Ctrl + .', description: '[タブ] 次の受信トレイセクションに移動', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'Ctrl + ,', description: '[タブ] 前の受信トレイセクションに移動', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'Ctrl + Down', description: 'チャットに移動', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: 'Ctrl + ;', description: 'アーカイブ済みチャットを表示', category: 'チャット', difficulty: 'madmax' },
  { keys: 'Shift + G', description: '前のページに移動', category: 'ナビゲーション', difficulty: 'madmax' },

  // Basic actions
  { keys: 'e', description: 'アーカイブ', category: 'アクション', difficulty: 'basic' },
  { keys: '#', description: '削除', category: 'アクション', difficulty: 'basic' },
  { keys: 'r', description: '返信', category: '返信', difficulty: 'basic' },
  { keys: 'a', description: '全員に返信', category: '返信', difficulty: 'basic' },
  { keys: 'f', description: '転送', category: '転送', difficulty: 'basic' },
  { keys: 's', description: 'スターを付ける/外す', category: 'アクション', difficulty: 'basic' },
  { keys: 'i', description: '既読としてマーク', category: 'アクション', difficulty: 'basic' },
  { keys: 'Shift + i', description: '既読にする', category: 'アクション', difficulty: 'standard' },
  { keys: 'Shift + u', description: '未読にする', category: 'アクション', difficulty: 'standard' },
  { keys: 'u', description: 'スレッドリストに戻る', category: 'ナビゲーション', difficulty: 'basic' },
  { keys: 'x', description: 'スレッドを選択', category: '選択', difficulty: 'standard' },
  { keys: 'l', description: 'ラベルを付ける', category: 'アクション', difficulty: 'standard' },
  { keys: 'v', description: 'フォルダに移動', category: 'アクション', difficulty: 'standard' },
  { keys: 'm', description: 'ミュート', category: 'アクション', difficulty: 'madmax' },
  { keys: '!', description: '迷惑メールとして報告', category: 'アクション', difficulty: 'standard' },
  { keys: 'b', description: 'スヌーズ', category: 'アクション', difficulty: 'madmax' },
  { keys: 'y', description: 'アーカイブして前/次へ', category: 'アクション', difficulty: 'madmax' },
  { keys: 'w', description: 'タスクに追加', category: 'タスク', difficulty: 'madmax' },
  { keys: 'Shift + t', description: '新しいタスクを追加', category: 'タスク', difficulty: 'madmax' },
  { keys: 'h', description: 'スレッドを展開/折りたたみ', category: 'ビュー', difficulty: 'madmax' },

  // Compose
  { keys: 'c', description: '新規メールを作成', category: '作成', difficulty: 'basic' },
  { keys: 'Shift + C', description: '新しいウィンドウで作成', category: '作成', difficulty: 'standard' },
  { keys: 'd', description: '下書きに保存', category: '作成', difficulty: 'standard' },
  { keys: 'Shift + R', description: '新しいウィンドウで返信', category: '返信', difficulty: 'standard' },
  { keys: 'Shift + A', description: '新しいウィンドウで全員に返信', category: '返信', difficulty: 'standard' },
  { keys: 'Shift + F', description: '新しいウィンドウで転送', category: '転送', difficulty: 'standard' },
  { keys: 'Tab then Enter', description: '送信ボタンにフォーカスして送信', category: '作成', difficulty: 'madmax' },
  { keys: 'Ctrl + Enter', description: 'メールを送信', category: '作成', difficulty: 'standard' },
  { keys: 'Ctrl + s', description: '下書きを保存', category: '作成', difficulty: 'standard' },
  { keys: 'Ctrl + S', description: '下書きを保存', category: '作成', difficulty: 'standard' },
  { keys: 'Ctrl + Shift + C', description: 'CCに追加', category: '作成', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + B', description: 'BCCに追加', category: '作成', difficulty: 'madmax' },
  { keys: 'Shift + c', description: 'CCに追加', category: '作成', difficulty: 'madmax' },
  { keys: 'Shift + b', description: 'BCCに追加', category: '作成', difficulty: 'madmax' },

  // Formatting
  { keys: 'Ctrl + B', description: '[書式] 太字', category: '書式設定', difficulty: 'basic' },
  { keys: 'Ctrl + I', description: '[書式] 斜体', category: '書式設定', difficulty: 'basic' },
  { keys: 'Ctrl + U', description: '[書式] 下線', category: '書式設定', difficulty: 'basic' },
  { keys: 'Ctrl + Shift + 5', description: '取り消し線', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + k', description: 'リンクを挿入', category: '書式設定', difficulty: 'standard' },
  { keys: 'Ctrl + K', description: '[書式] リンクを挿入', category: '書式設定', difficulty: 'standard' },
  { keys: 'Ctrl + Shift + 7', description: '番号付きリスト', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + 8', description: '箇条書きリスト', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + 9', description: '引用', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + -', description: 'フォントサイズを小さく', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + +', description: 'フォントサイズを大きく', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + l', description: '左揃え', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + e', description: '中央揃え', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + r', description: '右揃え', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + \\', description: '書式をクリア', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + ]', description: 'インデント', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + [', description: 'インデント解除', category: '書式設定', difficulty: 'madmax' },
  { keys: 'Ctrl + Shift + X', description: 'インデント解除', category: '書式設定', difficulty: 'madmax' },

  // Selection
  { keys: '* + a', description: 'すべてのスレッドを選択', category: '選択', difficulty: 'standard' },
  { keys: '* + n', description: 'すべての選択を解除', category: '選択', difficulty: 'standard' },
  { keys: '* + r', description: '既読のスレッドを選択', category: '選択', difficulty: 'madmax' },
  { keys: '* + u', description: '未読のスレッドを選択', category: '選択', difficulty: 'madmax' },
  { keys: '* + s', description: 'スター付きスレッドを選択', category: '選択', difficulty: 'madmax' },
  { keys: '* + t', description: 'スター未付きスレッドを選択', category: '選択', difficulty: 'madmax' },

  // Movement
  { keys: 'j', description: '次のスレッドに移動', category: 'ナビゲーション', difficulty: 'basic' },
  { keys: 'k', description: '前のスレッドに移動', category: 'ナビゲーション', difficulty: 'basic' },
  { keys: 'n', description: '次のメッセージ', category: 'ナビゲーション', difficulty: 'standard' },
  { keys: 'p', description: '前のメッセージ', category: 'ナビゲーション', difficulty: 'standard' },
  { keys: 'o', description: 'スレッドを開く', category: 'ナビゲーション', difficulty: 'standard' },
  { keys: 'Enter', description: 'スレッドを開く', category: 'ナビゲーション', difficulty: 'basic' },
  { keys: '`', description: '次のセクション', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: '~', description: '前のセクション', category: 'ナビゲーション', difficulty: 'madmax' },
  { keys: '[', description: 'アーカイブして前のスレッドへ', category: 'アクション', difficulty: 'madmax' },
  { keys: ']', description: 'アーカイブして次のスレッドへ', category: 'アクション', difficulty: 'madmax' },
  { keys: '{', description: 'アーカイブしてリストへ戻る', category: 'アクション', difficulty: 'madmax' },

  // System
  { keys: '/', description: '検索ボックスに移動', category: 'ナビゲーション', difficulty: 'basic' },
  { keys: '?', description: 'ショートカット一覧を表示', category: 'ヘルプ', difficulty: 'basic' },
  { keys: ',', description: '設定を開く', category: '設定', difficulty: 'standard' },
  { keys: '.', description: 'その他の操作メニューを表示', category: 'その他', difficulty: 'standard' },
  { keys: 'Esc', description: '入力フィールドから抜ける', category: 'システム', difficulty: 'basic' },
  { keys: 'Escape', description: 'フォーカスを外す/検索をクリア', category: 'システム', difficulty: 'basic' },
  { keys: 'Shift + Esc', description: 'フォーカスを外す', category: 'システム', difficulty: 'madmax' },
  { keys: 'Ctrl + P', description: '印刷', category: '印刷', difficulty: 'standard' },
  { keys: 'Ctrl + F', description: 'メール内を検索', category: '検索', difficulty: 'standard' },
  { keys: 'Ctrl + Shift + F', description: 'メッセージを検索フィルタで検索', category: '検索', difficulty: 'madmax' },
  { keys: 'z', description: '操作を元に戻す', category: 'アクション', difficulty: 'standard' },
  { keys: 'Shift + Z', description: '操作をやり直す', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + n', description: '受信トレイを更新', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + T', description: '新しいタブで開く', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + #', description: '削除（同じく #）', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + 1', description: '迷惑メール（同じく !）', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + 3', description: '削除（同じく #）', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + D', description: '下書きとして保存', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + N', description: 'すべて未読にする', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + I', description: '既読にする', category: 'アクション', difficulty: 'madmax' },
  { keys: 'Shift + U', description: '未読にする', category: 'アクション', difficulty: 'madmax' },

  // Importance markers
  { keys: '+', description: '重要マークを付ける', category: '重要', difficulty: 'madmax' },
  { keys: '=', description: '重要マークを付ける', category: '重要', difficulty: 'madmax' },
  { keys: '-', description: '重要マークを外す', category: '重要', difficulty: 'madmax' },
  { keys: '_', description: '重要マークを外す', category: '重要', difficulty: 'madmax' },
  { keys: '. + i', description: '重要マークを付ける', category: '重要', difficulty: 'madmax' },
  { keys: '. + u', description: '未読にする', category: 'アクション', difficulty: 'madmax' },
  { keys: '. + b', description: '重要マークを外す', category: '重要', difficulty: 'madmax' },

  // Additional actions
  { keys: 'm + a', description: 'すべてを既読にする', category: 'アクション', difficulty: 'madmax' },
  { keys: 'q', description: 'チャット セクションに移動', category: 'アクション', difficulty: 'madmax' },
  { keys: 'y + o', description: 'チャットを開く', category: 'チャット', difficulty: 'madmax' },
  { keys: 'Tab + Enter', description: 'メールを送信（カーソルが送信ボタン上）', category: '作成', difficulty: 'madmax' },
  { keys: 'Shift + H', description: 'スレッドを既読/未読切り替え', category: 'アクション', difficulty: 'madmax' },
];

async function main() {
  const supabase = getSupabaseClient();

  const { data: existingShortcuts, error } = await supabase
    .from('shortcuts')
    .select('keys')
    .eq('application', 'gmail');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const existingKeys = new Set(existingShortcuts.map((s: any) => s.keys));

  console.log('=== Missing Gmail Shortcuts ===\n');

  const missing = comprehensiveGmailShortcuts.filter(
    shortcut => !existingKeys.has(shortcut.keys)
  );

  if (missing.length === 0) {
    console.log('✓ No missing shortcuts found!');
    return;
  }

  console.log(`Found ${missing.length} missing shortcuts:\n`);

  const byCategory = missing.reduce((acc: any, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  Object.keys(byCategory).sort().forEach(category => {
    console.log(`\n${category}:`);
    byCategory[category].forEach((s: any) => {
      console.log(`  ${s.keys.padEnd(25)} ${s.description}`);
    });
  });

  console.log(`\n\nTotal missing: ${missing.length}`);
  console.log(`Current total: ${existingShortcuts.length}`);
  console.log(`After adding: ${existingShortcuts.length + missing.length}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
