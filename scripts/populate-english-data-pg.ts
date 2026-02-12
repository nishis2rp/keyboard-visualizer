import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Category translations
const categoryTranslations: Record<string, string> = {
  'Action': 'Action',
  'Application': 'Application',
  'Compose': 'Compose',
  'Debug': 'Debug',
  'Editing': 'Editing',
  'Editor': 'Editor',
  'File': 'File',
  'Format': 'Format',
  'General': 'General',
  'Git': 'Git',
  'Help': 'Help',
  'Information': 'Information',
  'Insert': 'Insert',
  'Markdown': 'Markdown',
  'Navigation': 'Navigation',
  'Object': 'Object',
  'Refactoring': 'Refactoring',
  'Review': 'Review',
  'Search': 'Search',
  'Selection': 'Selection',
  'Settings': 'Settings',
  'Slide': 'Slide',
  'Slideshow': 'Slideshow',
  'System': 'System',
  'Table': 'Table',
  'Terminal': 'Terminal',
  'Tools': 'Tools',
  'Window': 'Window',
  'Workspace': 'Workspace',
  'チャット': 'Chat',
  'ラベル': 'Label',
};

// Common description translations
const descriptionTranslations: Record<string, string> = {
  'コピー': 'Copy',
  'カット': 'Cut',
  '切り取り': 'Cut',
  '貼り付け': 'Paste',
  'ペースト': 'Paste',
  '元に戻す': 'Undo',
  'やり直し': 'Redo',
  '保存': 'Save',
  '名前を付けて保存': 'Save As',
  '印刷': 'Print',
  '全て選択': 'Select All',
  'すべて選択': 'Select All',
  '検索': 'Find',
  '置換': 'Replace',
  '検索と置換': 'Find and Replace',
  '開く': 'Open',
  '新規作成': 'New',
  '新しいウィンドウ': 'New Window',
  '新しいタブ': 'New Tab',
  '閉じる': 'Close',
  'タブを閉じる': 'Close Tab',
  'ウィンドウを閉じる': 'Close Window',
  '更新': 'Refresh',
  '再読み込み': 'Reload',
  '次のタブ': 'Next Tab',
  '前のタブ': 'Previous Tab',
  '最初のタブ': 'First Tab',
  '最後のタブ': 'Last Tab',
  '戻る': 'Go Back',
  '進む': 'Go Forward',
  'ホーム': 'Home',
  '終わり': 'End',
  '上': 'Up',
  '下': 'Down',
  '左': 'Left',
  '右': 'Right',
  'ページアップ': 'Page Up',
  'ページダウン': 'Page Down',
  'アドレスバーにフォーカス': 'Focus Address Bar',
  'ブックマークに追加': 'Add Bookmark',
  'ブックマークを開く': 'Open Bookmarks',
  '履歴を開く': 'Open History',
  'ダウンロードを開く': 'Open Downloads',
  'デベロッパーツールを開く': 'Open Developer Tools',
  'シークレットウィンドウを開く': 'Open Incognito Window',
  'プライベートウィンドウを開く': 'Open Private Window',
  'フルスクリーン': 'Full Screen',
  'フルスクリーン切り替え': 'Toggle Full Screen',
  '拡大': 'Zoom In',
  '縮小': 'Zoom Out',
  'ズームリセット': 'Reset Zoom',
  '太字': 'Bold',
  '斜体': 'Italic',
  '下線': 'Underline',
  '左揃え': 'Align Left',
  '中央揃え': 'Center',
  '右揃え': 'Align Right',
  '箇条書き': 'Bullet List',
  '番号付きリスト': 'Numbered List',
  'リンクを挿入': 'Insert Link',
  '画像を挿入': 'Insert Image',
  'テーブルを挿入': 'Insert Table',
  'スペルチェック': 'Spell Check',
  'ヘルプ': 'Help',
  '設定': 'Settings',
  '環境設定': 'Preferences',
  'スクリーンショット': 'Screenshot',
  'タスクマネージャー': 'Task Manager',
  'ロック': 'Lock',
  'デスクトップを表示': 'Show Desktop',
  'ウィンドウを最小化': 'Minimize Window',
  'ウィンドウを最大化': 'Maximize Window',
  'アプリケーションを切り替え': 'Switch Applications',
  'ウィンドウを切り替え': 'Switch Windows',
  'コマンドパレット': 'Command Palette',
  'クイックオープン': 'Quick Open',
  'ターミナル': 'Terminal',
  'サイドバー': 'Sidebar',
  'エクスプローラー': 'Explorer',
  'デバッグ': 'Debug',
  'ソース管理': 'Source Control',
  'コメント': 'Comment',
  'コメント解除': 'Uncomment',
  '行コメント': 'Line Comment',
  'ブロックコメント': 'Block Comment',
  'フォーマット': 'Format',
  'ドキュメントのフォーマット': 'Format Document',
  '定義へ移動': 'Go to Definition',
  '参照を検索': 'Find References',
  '名前の変更': 'Rename',
  'シンボルの検索': 'Find Symbol',
  'セル編集': 'Edit Cell',
  '列の選択': 'Select Column',
  '行の選択': 'Select Row',
  '数式バー': 'Formula Bar',
  '合計': 'Sum',
  'オートフィル': 'Auto Fill',
  'グラフの挿入': 'Insert Chart',
  'ピボットテーブル': 'Pivot Table',
  'フィルター': 'Filter',
  '並べ替え': 'Sort',
  '送信': 'Send',
  '返信': 'Reply',
  '全員に返信': 'Reply All',
  '転送': 'Forward',
  '削除': 'Delete',
  'アーカイブ': 'Archive',
  '既読': 'Mark as Read',
  '未読': 'Mark as Unread',
  'スター': 'Star',
  'ラベル': 'Label',
  '作成': 'Compose',
  'チャンネル検索': 'Search Channels',
  'ダイレクトメッセージ': 'Direct Message',
  'メンション': 'Mention',
  'スレッド': 'Thread',
  '絵文字': 'Emoji',
  'リアクション': 'Reaction',
  'メッセージを検索': 'Search Messages',
};

async function populateEnglishData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to database\n');

    // Update category_en for all shortcuts
    console.log('Updating category_en...');
    let updatedCategories = 0;

    for (const [japanese, english] of Object.entries(categoryTranslations)) {
      const result = await client.query(
        `UPDATE shortcuts
         SET category_en = $1
         WHERE category = $2`,
        [english, japanese]
      );
      if (result.rowCount && result.rowCount > 0) {
        console.log(`  Updated ${result.rowCount} shortcuts: ${japanese} → ${english}`);
        updatedCategories += result.rowCount;
      }
    }
    console.log(`\nTotal categories updated: ${updatedCategories}\n`);

    // Update description_en for common shortcuts
    console.log('Updating description_en for common shortcuts...');
    let updatedDescriptions = 0;

    for (const [japanese, english] of Object.entries(descriptionTranslations)) {
      const result = await client.query(
        `UPDATE shortcuts
         SET description_en = $1
         WHERE description = $2`,
        [english, japanese]
      );
      if (result.rowCount && result.rowCount > 0) {
        console.log(`  Updated ${result.rowCount} shortcuts: ${japanese} → ${english}`);
        updatedDescriptions += result.rowCount;
      }
    }
    console.log(`\nTotal descriptions updated: ${updatedDescriptions}\n`);

    // For shortcuts without English description, copy Japanese description
    console.log('Copying Japanese descriptions for remaining shortcuts...');
    const result = await client.query(
      `UPDATE shortcuts
       SET description_en = description
       WHERE description_en IS NULL`
    );
    console.log(`  Copied ${result.rowCount} Japanese descriptions\n`);

    // Summary
    const summary = await client.query(
      `SELECT
        COUNT(*) as total,
        COUNT(category_en) as with_category_en,
        COUNT(description_en) as with_description_en
       FROM shortcuts`
    );

    console.log('Summary:');
    console.log(`  Total shortcuts: ${summary.rows[0].total}`);
    console.log(`  With category_en: ${summary.rows[0].with_category_en}`);
    console.log(`  With description_en: ${summary.rows[0].with_description_en}`);

  } catch (error) {
    console.error('Error populating English data:', error);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

populateEnglishData();
