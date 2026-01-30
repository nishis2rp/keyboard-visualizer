import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function restoreWNShortcuts() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Ctrl+W、Ctrl+Nをpreventable_fullscreenに戻す
    const result = await client.query(
      `UPDATE shortcuts
       SET windows_protection_level = 'preventable_fullscreen',
           macos_protection_level = 'preventable_fullscreen'
       WHERE keys IN ('Ctrl + W', 'Ctrl + N')`
    );

    console.log(`✅ Restored ${result.rowCount} shortcuts to 'preventable_fullscreen'\n`);

    // 確認：preventable_fullscreenのショートカットを表示
    const remaining = await client.query(
      `SELECT DISTINCT keys
       FROM shortcuts
       WHERE windows_protection_level = 'preventable_fullscreen'
          OR macos_protection_level = 'preventable_fullscreen'
       ORDER BY keys`
    );

    console.log('Current preventable_fullscreen shortcuts:');
    remaining.rows.forEach(row => {
      console.log(`  ✓ ${row.keys}`);
    });

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

restoreWNShortcuts();
