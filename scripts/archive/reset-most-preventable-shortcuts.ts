import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function resetMostPreventableShortcuts() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Ctrl+Shift+Tab, Ctrl+W, Ctrl+N以外の全てをnoneに戻す
    const result = await client.query(
      `UPDATE shortcuts
       SET windows_protection_level = 'none',
           macos_protection_level = 'none'
       WHERE (windows_protection_level = 'preventable_fullscreen'
              OR macos_protection_level = 'preventable_fullscreen')
         AND keys NOT IN ('Ctrl + Shift + Tab', 'Ctrl + W', 'Ctrl + N')`
    );

    console.log(`✅ Reset ${result.rowCount} shortcuts to 'none' protection level\n`);

    // 確認：残っているpreventable_fullscreenを表示
    const remaining = await client.query(
      `SELECT keys, windows_protection_level, macos_protection_level
       FROM shortcuts
       WHERE windows_protection_level = 'preventable_fullscreen'
          OR macos_protection_level = 'preventable_fullscreen'
       ORDER BY keys`
    );

    console.log('Remaining preventable_fullscreen shortcuts:');
    if (remaining.rows.length > 0) {
      remaining.rows.forEach(row => {
        console.log(`  ✓ ${row.keys} (Windows: ${row.windows_protection_level}, macOS: ${row.macos_protection_level})`);
      });
    } else {
      console.log('  None (all have been reset)');
    }

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

resetMostPreventableShortcuts();
