import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    // 難易度を確認したいショートカットのリスト
    const checkList = [
      { app: 'chrome', keys: 'Ctrl + 1' },
      { app: 'chrome', keys: 'Ctrl + PageUp' },
      { app: 'chrome', keys: 'Alt + Shift + I' },
      { app: 'excel', keys: 'Ctrl + Shift + F2' },
      { app: 'windows11', keys: 'Win + A' }
    ];

    console.log('\nChecking shortcut difficulties in Supabase...\n');

    for (const item of checkList) {
      const result = await client.query(
        'SELECT application, keys, description, difficulty FROM shortcuts WHERE application = $1 AND keys = $2',
        [item.app, item.keys]
      );

      if (result.rows.length > 0) {
        const row = result.rows[0];
        console.log(`[${row.application}] ${row.keys}: ${row.description}`);
        console.log(`  Difficulty: ${row.difficulty}`);
      } else {
        console.log(`[${item.app}] ${item.keys}: NOT FOUND`);
      }
      console.log('---');
    }

    // 難易度ごとの統計
    const stats = await client.query(
      'SELECT difficulty, COUNT(*) as count FROM shortcuts GROUP BY difficulty ORDER BY count DESC'
    );
    console.log('\nDifficulty statistics:');
    stats.rows.forEach(row => {
      console.log(`  ${row.difficulty}: ${row.count}`);
    });
  });
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});