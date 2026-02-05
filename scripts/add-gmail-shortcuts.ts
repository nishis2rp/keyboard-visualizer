import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('Connected to database\n');

    // Gmail shortcuts to add
    const shortcuts = [
      // Basic - 基本的な操作
      { keys: 'c', description: '新規メールを作成', difficulty: 'basic' },
      { keys: 'r', description: '返信', difficulty: 'basic' },
      { keys: 'a', description: '全員に返信', difficulty: 'basic' },
      { keys: 'f', description: '転送', difficulty: 'basic' },
      { keys: 'e', description: 'アーカイブ', difficulty: 'basic' },
      { keys: '#', description: '削除', difficulty: 'basic' },
      { keys: '/', description: '検索ボックスに移動', difficulty: 'basic' },
      { keys: 's', description: 'スターを付ける/外す', difficulty: 'basic' },
      { keys: 'u', description: 'スレッドリストに戻る', difficulty: 'basic' },
      { keys: 'j', description: '次のスレッドに移動', difficulty: 'basic' },
      { keys: 'k', description: '前のスレッドに移動', difficulty: 'basic' },
      { keys: 'n', description: '次のメッセージ', difficulty: 'basic' },
      { keys: 'p', description: '前のメッセージ', difficulty: 'basic' },

      // Standard - 一般的な操作
      { keys: 'l', description: 'ラベルを付ける', difficulty: 'standard' },
      { keys: 'v', description: 'フォルダに移動', difficulty: 'standard' },
      { keys: 'x', description: 'スレッドを選択', difficulty: 'standard' },
      { keys: '!', description: '迷惑メールとして報告', difficulty: 'standard' },
      { keys: 'z', description: '操作を元に戻す', difficulty: 'standard' },
      { keys: 'Shift + i', description: '既読にする', difficulty: 'standard' },
      { keys: 'Shift + u', description: '未読にする', difficulty: 'standard' },
      { keys: 'Shift + c', description: 'Ccに追加', difficulty: 'standard' },
      { keys: 'Shift + b', description: 'Bccに追加', difficulty: 'standard' },
      { keys: '[', description: 'アーカイブして前のスレッドへ', difficulty: 'standard' },
      { keys: ']', description: 'アーカイブして次のスレッドへ', difficulty: 'standard' },
      { keys: '{', description: 'アーカイブしてリストへ戻る', difficulty: 'standard' },
      { keys: 'o', description: 'スレッドを開く', difficulty: 'standard' },
      { keys: 'Enter', description: 'スレッドを開く', difficulty: 'standard' },
      { keys: 'Shift + n', description: '受信トレイを更新', difficulty: 'standard' },
      { keys: 'Ctrl + s', description: '下書きを保存', difficulty: 'standard' },
      { keys: 'Ctrl + Enter', description: 'メールを送信', difficulty: 'standard' },
      { keys: 'Shift + Esc', description: 'フォーカスを外す', difficulty: 'standard' },
      { keys: 'Esc', description: '入力フィールドから抜ける', difficulty: 'standard' },
      { keys: 'Tab + Enter', description: 'メールを送信（カーソルが送信ボタン上）', difficulty: 'standard' },
      { keys: 'y + o', description: 'チャットを開く', difficulty: 'standard' },

      // Madmax - ナビゲーション（複数キー）
      { keys: 'g + i', description: '受信トレイに移動', difficulty: 'madmax' },
      { keys: 'g + s', description: 'スター付きに移動', difficulty: 'madmax' },
      { keys: 'g + t', description: '送信済みに移動', difficulty: 'madmax' },
      { keys: 'g + d', description: '下書きに移動', difficulty: 'madmax' },
      { keys: 'g + a', description: 'すべてのメールに移動', difficulty: 'madmax' },
      { keys: 'g + c', description: '連絡先に移動', difficulty: 'madmax' },
      { keys: 'g + k', description: 'タスクに移動', difficulty: 'madmax' },
      { keys: 'g + l', description: 'ラベルに移動', difficulty: 'madmax' },

      // Madmax - 選択操作（複数キー）
      { keys: '* + a', description: 'すべてのスレッドを選択', difficulty: 'madmax' },
      { keys: '* + n', description: 'すべての選択を解除', difficulty: 'madmax' },
      { keys: '* + r', description: '既読のスレッドを選択', difficulty: 'madmax' },
      { keys: '* + u', description: '未読のスレッドを選択', difficulty: 'madmax' },
      { keys: '* + s', description: 'スター付きスレッドを選択', difficulty: 'madmax' },
      { keys: '* + t', description: 'スター未付きスレッドを選択', difficulty: 'madmax' },

      // Madmax - フォーマット操作
      { keys: 'Ctrl + Shift + 5', description: '取り消し線', difficulty: 'madmax' },
      { keys: 'Ctrl + Shift + 7', description: '番号付きリスト', difficulty: 'madmax' },
      { keys: 'Ctrl + Shift + 8', description: '箇条書きリスト', difficulty: 'madmax' },
      { keys: 'Ctrl + Shift + 9', description: '引用', difficulty: 'madmax' },
      { keys: 'Ctrl + Shift + -', description: 'フォントサイズを小さく', difficulty: 'madmax' },
      { keys: 'Ctrl + Shift + +', description: 'フォントサイズを大きく', difficulty: 'madmax' },
      { keys: 'Ctrl + Shift + l', description: '左揃え', difficulty: 'madmax' },
      { keys: 'Ctrl + Shift + e', description: '中央揃え', difficulty: 'madmax' },
      { keys: 'Ctrl + Shift + r', description: '右揃え', difficulty: 'madmax' },
      { keys: 'Ctrl + \\', description: '書式をクリア', difficulty: 'madmax' },

      // Madmax - その他の高度な操作
      { keys: '. + i', description: '重要マークを付ける', difficulty: 'madmax' },
      { keys: '. + b', description: '重要マークを外す', difficulty: 'madmax' },
      { keys: '. + u', description: '未読にする', difficulty: 'madmax' },
      { keys: 'm + a', description: 'すべてを既読にする', difficulty: 'madmax' },
      { keys: 'Shift + 3', description: '削除（同じく #）', difficulty: 'madmax' },
      { keys: 'Shift + 1', description: '迷惑メール（同じく !）', difficulty: 'madmax' },
      { keys: 'Ctrl + k', description: 'リンクを挿入', difficulty: 'madmax' },
      { keys: 'Shift + t', description: '新しいタスクを追加', difficulty: 'madmax' },
    ];

    console.log(`Adding ${shortcuts.length} Gmail shortcuts...\n`);

    for (const shortcut of shortcuts) {
      const result = await client.query(
        `INSERT INTO shortcuts (application, keys, description, difficulty, platform)
         VALUES ('gmail', $1, $2, $3, 'Cross-Platform')
         ON CONFLICT (application, keys) DO UPDATE
         SET description = EXCLUDED.description,
             difficulty = EXCLUDED.difficulty
         RETURNING id, keys, description, difficulty`,
        [shortcut.keys, shortcut.description, shortcut.difficulty]
      );

      if (result.rows.length > 0) {
        console.log(`✓ ${shortcut.keys} - ${shortcut.description} [${shortcut.difficulty}]`);
      }
    }

    console.log(`\nTotal shortcuts added/updated: ${shortcuts.length}`);
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
