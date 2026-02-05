import { withDatabase } from './lib/db';

async function main() {
  await withDatabase(async (client) => {
    console.log('✓ Connected to database\n');

    // テーブル構造を確認
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'shortcuts'
      ORDER BY ordinal_position;
    `);

    console.log('Shortcuts table structure:\n');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name.padEnd(30)} ${row.data_type}`);
    });

    // サンプルデータを取得
    const sample = await client.query('SELECT * FROM shortcuts LIMIT 3');
    console.log('\nSample data:');
    console.log(sample.rows);
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
