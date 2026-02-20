import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();
const { Client } = pg;

async function removeDuplicates() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Remove duplicate shortcuts that will conflict after abbreviation
    const duplicatesToRemove = [
      { id: 1204, app: 'windows11', keys: 'Ctrl + Esc', desc: 'スタートメニューを開く' },
      { id: 1461, app: 'gmail', keys: 'Esc', desc: '入力フィールドから抜ける' }
    ];

    console.log('🗑️  Removing duplicate shortcuts...\n');

    for (const dup of duplicatesToRemove) {
      const { rows } = await client.query(
        'DELETE FROM shortcuts WHERE id = $1 RETURNING *',
        [dup.id]
      );

      if (rows.length > 0) {
        console.log(`  ✅ Removed: [${dup.app}] "${dup.keys}" - ${dup.desc} (ID: ${dup.id})`);
      } else {
        console.log(`  ⚠️  Not found: ID ${dup.id}`);
      }
    }

    console.log('\n✅ Duplicates removed successfully!');

  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
    throw error;
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
}

removeDuplicates();
