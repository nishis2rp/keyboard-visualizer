import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

async function findDuplicateChromeShortcuts() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // ChromeアプリのすべてのShortcutsを取得
    const result = await client.query(
      `SELECT id, keys, windows_keys, macos_keys, description
       FROM shortcuts
       WHERE application = 'chrome'
       ORDER BY keys, id`
    );

    console.log(`Total Chrome shortcuts: ${result.rows.length}\n`);

    // windows_keys でグループ化して重複を検出
    const grouped = new Map<string, any[]>();
    result.rows.forEach(row => {
      const key = row.windows_keys || row.keys;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(row);
    });

    console.log('Checking for duplicates by windows_keys:\n');
    let duplicatesFound = false;

    grouped.forEach((rows, key) => {
      if (rows.length > 1) {
        console.log(`❌ DUPLICATE: "${key}" (${rows.length} entries)`);
        rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ID: ${row.id} | keys: ${row.keys} | Description: ${row.description}`);
        });
        console.log('');
        duplicatesFound = true;
      }
    });

    if (!duplicatesFound) {
      console.log('✅ No duplicates found in Chrome shortcuts');
    }

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err);
    await client.end();
    process.exit(1);
  }
}

findDuplicateChromeShortcuts();
