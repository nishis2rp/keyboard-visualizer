import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function deleteOldPageUpShortcuts() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // 削除するショートカットのIDをリスト
    const idsToDelete = [7, 8, 9, 10, 75, 76];

    console.log('Deleting old PageUp/PageDown shortcuts with null windows_keys/macos_keys:\n');

    for (const id of idsToDelete) {
      const result = await client.query(
        `DELETE FROM shortcuts WHERE id = $1 RETURNING keys, description`,
        [id]
      );

      if (result.rowCount && result.rowCount > 0) {
        console.log(`  ✓ Deleted ID ${id}: ${result.rows[0].keys} - ${result.rows[0].description}`);
      } else {
        console.log(`  ⚠️  ID ${id} not found`);
      }
    }

    console.log('\n✅ Old shortcuts deleted successfully!');

    // 確認：残っているPageUp/PageDown系のショートカットを表示
    const remaining = await client.query(
      `SELECT id, keys, windows_keys, macos_keys, description
       FROM shortcuts
       WHERE application = 'chrome'
         AND (
           keys LIKE '%PageUp%' OR keys LIKE '%PageDown%' OR
           keys LIKE '%PgUp%' OR keys LIKE '%PgDn%' OR
           keys LIKE '%Page Up%' OR keys LIKE '%Page Down%'
         )
       ORDER BY keys`
    );

    console.log(`\nRemaining Chrome PageUp/PageDown shortcuts: ${remaining.rows.length}\n`);
    remaining.rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id} | ${row.keys} - ${row.description}`);
    });

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

deleteOldPageUpShortcuts();
