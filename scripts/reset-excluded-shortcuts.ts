import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function resetExcludedShortcuts() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // 除外するショートカット（noneに戻す）
    const excludedShortcuts = [
      'Ctrl + 1',
      'Ctrl + 2',
      'Ctrl + 3',
      'Ctrl + 4',
      'Ctrl + 5',
      'Ctrl + 6',
      'Ctrl + 7',
      'Ctrl + 8',
      'Ctrl + 9',
      'Ctrl + 0',
      'Ctrl + O',
      'Ctrl + P',
      'Ctrl + U',
      'Ctrl + E',
      'Ctrl + D',
      'Ctrl + G',
      'Ctrl + S',
      'Ctrl + L',
      'Ctrl + R',
      'Ctrl + +',
      'Ctrl + -'
    ];

    console.log('Resetting excluded shortcuts to "none"...\n');

    for (const key of excludedShortcuts) {
      const result = await client.query(
        `UPDATE shortcuts
         SET windows_protection_level = 'none',
             macos_protection_level = 'none'
         WHERE keys = $1`,
        [key]
      );

      if (result.rowCount && result.rowCount > 0) {
        console.log(`  ✓ Reset ${key} (${result.rowCount} row(s))`);
      } else {
        console.log(`  ⚠️  ${key} not found`);
      }
    }

    console.log('\n✅ Excluded shortcuts reset successfully!');
    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

resetExcludedShortcuts();
