import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function checkProtectionLevels() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Chromeの主要なショートカットの保護レベルを確認
    const shortcuts = [
      'Ctrl + O',
      'Ctrl + P',
      'Ctrl + W',
      'Ctrl + T',
      'Ctrl + N',
      'Ctrl + PageUp',
      'Ctrl + PageDown',
      'Ctrl + Tab',
      'Ctrl + Shift + Tab',
      'Ctrl + H',
      'Ctrl + J',
      'Ctrl + 1',
      'Ctrl + 2',
      'Ctrl + D',
      'F11',
      'F12',
    ];

    console.log('Checking protection levels for Chrome shortcuts:\n');

    for (const key of shortcuts) {
      const result = await client.query(
        'SELECT application, keys, windows_protection_level, macos_protection_level FROM shortcuts WHERE application = $1 AND keys = $2',
        ['chrome', key]
      );

      if (result.rows.length > 0) {
        const row = result.rows[0];
        const winLevel = row.windows_protection_level || 'none';
        const macLevel = row.macos_protection_level || 'none';
        console.log(`✓ ${key.padEnd(25)} | Windows: ${winLevel.padEnd(25)} | macOS: ${macLevel}`);
      } else {
        console.log(`✗ ${key.padEnd(25)} | NOT FOUND IN DATABASE`);
      }
    }

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

checkProtectionLevels();
